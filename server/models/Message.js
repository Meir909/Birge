const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Текст сообщения обязателен'],
    trim: true,
    maxlength: [1000, 'Сообщение не может быть длиннее 1000 символов']
  },
  type: {
    type: String,
    enum: ['text', 'system', 'broadcast', 'alert', 'location', 'image'],
    default: 'text'
  },
  metadata: {
    // Для различных типов сообщений
    location: {
      name: String,
      coordinates: [Number]
    },
    imageUrl: String,
    systemAction: {
      type: String,
      enum: ['user_joined', 'user_left', 'trip_started', 'trip_completed', 'trip_cancelled', 'route_change']
    },
    alertLevel: {
      type: String,
      enum: ['info', 'warning', 'error', 'success']
    }
  },
  recipients: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    read: {
      type: Boolean,
      default: false
    },
    readAt: Date
  }],
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  replies: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  expiresAt: Date, // для временных сообщений
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Индексы
messageSchema.index({ group: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ 'recipients.user': 1 });
messageSchema.index({ type: 1 });
messageSchema.index({ priority: 1 });
messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Виртуальные поля
messageSchema.virtual('readCount').get(function() {
  return this.recipients.filter(r => r.read).length;
});

messageSchema.virtual('unreadCount').get(function() {
  return this.recipients.filter(r => !r.read).length;
});

messageSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

messageSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

// Middleware
messageSchema.pre('save', function(next) {
  if (this.isModified('updatedAt')) {
    this.updatedAt = new Date();
  }
  
  // При редактировании сообщения
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true;
    this.editedAt = new Date();
  }
  
  next();
});

// Методы
messageSchema.methods.markAsRead = function(userId) {
  const recipient = this.recipients.find(r => r.user.toString() === userId.toString());
  if (recipient && !recipient.read) {
    recipient.read = true;
    recipient.readAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

messageSchema.methods.markAsUnread = function(userId) {
  const recipient = this.recipients.find(r => r.user.toString() === userId.toString());
  if (recipient && recipient.read) {
    recipient.read = false;
    recipient.readAt = null;
    return this.save();
  }
  return Promise.resolve(this);
};

messageSchema.methods.addReaction = function(userId, emoji) {
  // Проверяем, не добавлял ли пользователь уже такую реакцию
  const existingReaction = this.reactions.find(r => 
    r.user.toString() === userId.toString() && r.emoji === emoji
  );
  
  if (!existingReaction) {
    this.reactions.push({
      user: userId,
      emoji: emoji
    });
    return this.save();
  }
  
  return Promise.resolve(this);
};

messageSchema.methods.removeReaction = function(userId, emoji) {
  this.reactions = this.reactions.filter(r => 
    !(r.user.toString() === userId.toString() && r.emoji === emoji)
  );
  return this.save();
};

messageSchema.methods.addReply = function(senderId, content) {
  this.replies.push({
    sender: senderId,
    content: content
  });
  return this.save();
};

messageSchema.methods.editMessage = function(newContent) {
  this.content = newContent;
  this.isEdited = true;
  this.editedAt = new Date();
  return this.save();
};

messageSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

messageSchema.methods.addRecipient = function(userId) {
  // Проверяем, не является ли пользователь уже получателем
  const existingRecipient = this.recipients.find(r => r.user.toString() === userId.toString());
  if (!existingRecipient) {
    this.recipients.push({
      user: userId,
      read: false
    });
    return this.save();
  }
  return Promise.resolve(this);
};

messageSchema.methods.isExpired = function() {
  return this.expiresAt && this.expiresAt < new Date();
};

// Статические методы
messageSchema.statics.findByGroup = function(groupId, limit = 50, before = null) {
  const query = {
    group: groupId,
    isDeleted: false
  };
  
  if (before) {
    query.createdAt = { $lt: before };
  }
  
  return this.find(query)
    .populate('sender', 'name avatar')
    .populate('replies.sender', 'name avatar')
    .populate('reactions.user', 'name')
    .sort({ createdAt: -1 })
    .limit(limit);
};

messageSchema.statics.findUnreadByUser = function(userId, groupId = null) {
  const query = {
    'recipients.user': userId,
    'recipients.read': false,
    isDeleted: false
  };
  
  if (groupId) {
    query.group = groupId;
  }
  
  return this.find(query)
    .populate('sender group')
    .sort({ createdAt: -1 });
};

messageSchema.statics.search = function(groupId, searchTerm, userId = null) {
  const query = {
    group: groupId,
    content: new RegExp(searchTerm, 'i'),
    isDeleted: false
  };
  
  if (userId) {
    query.sender = userId;
  }
  
  return this.find(query)
    .populate('sender', 'name avatar')
    .sort({ createdAt: -1 });
};

messageSchema.statics.getStats = function(groupId, period = 'week') {
  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'day':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
  
  return this.aggregate([
    {
      $match: {
        group: new mongoose.Types.ObjectId(groupId),
        createdAt: { $gte: startDate },
        isDeleted: false
      }
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sender: "$sender"
        },
        messageCount: { $sum: 1 },
        avgReactions: { $avg: { $size: "$reactions" } }
      }
    },
    {
      $group: {
        _id: "$_id.date",
        totalMessages: { $sum: "$messageCount" },
        uniqueSenders: { $addToSet: "$_id.sender" },
        avgReactions: { $avg: "$avgReactions" }
      }
    },
    {
      $project: {
        date: "$_id",
        totalMessages: 1,
        senderCount: { $size: "$uniqueSenders" },
        avgReactions: 1
      }
    },
    {
      $sort: { date: 1 }
    }
  ]);
};

messageSchema.statics.cleanupExpired = function() {
  return this.deleteMany({
    expiresAt: { $lt: new Date() }
  });
};

messageSchema.statics.createSystemMessage = function(groupId, action, metadata = {}) {
  const systemMessages = {
    user_joined: 'Пользователь присоединился к группе',
    user_left: 'Пользователь покинул группу',
    trip_started: 'Поездка началась',
    trip_completed: 'Поездка завершена',
    trip_cancelled: 'Поездка отменена',
    route_change: 'Маршрут изменен'
  };
  
  return this.create({
    group: groupId,
    sender: null, // системные сообщения без отправителя
    content: systemMessages[action] || 'Системное уведомление',
    type: 'system',
    metadata: {
      systemAction: action,
      ...metadata
    },
    priority: action === 'trip_cancelled' ? 'high' : 'normal'
  });
};

messageSchema.statics.createBroadcastMessage = function(groupId, content, alertLevel = 'info') {
  return this.create({
    group: groupId,
    sender: null,
    content: content,
    type: 'broadcast',
    metadata: {
      alertLevel: alertLevel
    },
    priority: alertLevel === 'error' ? 'urgent' : 'high'
  });
};

// Очистка истекших сообщений (запускается периодически)
messageSchema.statics.startCleanupJob = function() {
  const cron = require('node-cron');
  
  // Запускаем каждый час
  cron.schedule('0 * * * *', async () => {
    try {
      const result = await this.cleanupExpired();
      console.log(`Удалено ${result.deletedCount} истекших сообщений`);
    } catch (error) {
      console.error('Ошибка при очистке истекших сообщений:', error);
    }
  });
};

module.exports = mongoose.model('Message', messageSchema);
