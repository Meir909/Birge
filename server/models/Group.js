const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Название группы обязательно'],
    trim: true,
    maxlength: [100, 'Название не может быть длиннее 100 символов']
  },
  description: {
    type: String,
    maxlength: [500, 'Описание не может быть длиннее 500 символов']
  },
  school: {
    type: String,
    required: [true, 'Школа обязательна'],
    trim: true
  },
  type: {
    type: String,
    enum: ['morning', 'evening', 'both'],
    default: 'morning'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'full'],
    default: 'active'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['driver', 'parent', 'admin'],
      default: 'parent'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'active'
    }
  }],
  route: {
    origin: {
      name: String,
      address: String,
      location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: [Number]
      }
    },
    destination: {
      name: String,
      address: String,
      location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: [Number]
      }
    },
    waypoints: [{
      name: String,
      address: String,
      location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: [Number]
      },
      order: Number
    }],
    estimatedDistance: Number, // в метрах
    estimatedDuration: Number, // в минутах
    optimizedRoute: {
      type: mongoose.Schema.Types.Mixed, // сохраненный оптимизированный маршрут
      coordinates: [[Number]], // массив координат
      distance: Number,
      duration: Number
    }
  },
  schedule: {
    monday: {
      active: { type: Boolean, default: false },
      departureTime: String,
      returnTime: String
    },
    tuesday: {
      active: { type: Boolean, default: false },
      departureTime: String,
      returnTime: String
    },
    wednesday: {
      active: { type: Boolean, default: false },
      departureTime: String,
      returnTime: String
    },
    thursday: {
      active: { type: Boolean, default: false },
      departureTime: String,
      returnTime: String
    },
    friday: {
      active: { type: Boolean, default: false },
      departureTime: String,
      returnTime: String
    },
    saturday: {
      active: { type: Boolean, default: false },
      departureTime: String,
      returnTime: String
    },
    sunday: {
      active: { type: Boolean, default: false },
      departureTime: String,
      returnTime: String
    }
  },
  capacity: {
    total: {
      type: Number,
      default: 4,
      min: 1,
      max: 8
    },
    available: {
      type: Number,
      default: 4
    }
  },
  requirements: {
    minAge: {
      type: Number,
      min: 0,
      max: 18
    },
    maxAge: {
      type: Number,
      min: 0,
      max: 18
    },
    gradeRange: {
      from: String,
      to: String
    },
    gender: {
      type: String,
      enum: ['any', 'male', 'female'],
      default: 'any'
    },
    specialNeeds: {
      type: Boolean,
      default: false
    }
  },
  preferences: {
    smokingAllowed: {
      type: Boolean,
      default: false
    },
    petsAllowed: {
      type: Boolean,
      default: false
    },
    musicAllowed: {
      type: Boolean,
      default: true
    },
    conversationLevel: {
      type: String,
      enum: ['quiet', 'moderate', 'talkative'],
      default: 'moderate'
    }
  },
  pricing: {
    type: {
      type: String,
      enum: ['free', 'shared', 'fixed'],
      default: 'free'
    },
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'RUB'
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'transfer', 'app'],
      default: 'cash'
    }
  },
  safety: {
    driverVerified: {
      type: Boolean,
      default: false
    },
    vehicleInspected: {
      type: Boolean,
      default: false
    },
    insuranceValid: {
      type: Boolean,
      default: false
    },
    backgroundCheck: {
      type: Boolean,
      default: false
    }
  },
  stats: {
    totalTrips: {
      type: Number,
      default: 0
    },
    totalDistance: {
      type: Number,
      default: 0
    },
    totalCo2Saved: {
      type: Number,
      default: 0
    },
    totalMoneySaved: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    breakdown: {
      safety: { type: Number, default: 0 },
      punctuality: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      comfort: { type: Number, default: 0 }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  inviteCode: {
    type: String,
    unique: true,
    sparse: true
  },
  tags: [String],
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
groupSchema.index({ school: 1 });
groupSchema.index({ creator: 1 });
groupSchema.index({ driver: 1 });
groupSchema.index({ 'members.user': 1 });
groupSchema.index({ status: 1 });
groupSchema.index({ isActive: 1 });
groupSchema.index({ 'route.origin.location': '2dsphere' });
groupSchema.index({ 'route.destination.location': '2dsphere' });
groupSchema.index({ inviteCode: 1 });

// Виртуальные поля
groupSchema.virtual('isFull').get(function() {
  return this.capacity.available <= 0;
});

groupSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

groupSchema.virtual('activeDays').get(function() {
  const days = [];
  Object.keys(this.schedule).forEach(day => {
    if (this.schedule[day].active) {
      days.push(day);
    }
  });
  return days;
});

// Middleware
groupSchema.pre('save', function(next) {
  if (this.isModified('updatedAt')) {
    this.updatedAt = new Date();
  }
  
  // Обновляем доступные места
  const activeMembers = this.members.filter(m => m.status === 'active');
  this.capacity.available = Math.max(0, this.capacity.total - activeMembers.length);
  
  // Обновляем статус
  if (this.capacity.available <= 0) {
    this.status = 'full';
  } else if (this.status === 'full' && this.capacity.available > 0) {
    this.status = 'active';
  }
  
  next();
});

// Методы
groupSchema.methods.addMember = function(userId, role = 'parent') {
  // Проверяем, не является ли пользователь уже участником
  const existingMember = this.members.find(m => m.user.toString() === userId.toString());
  if (existingMember) {
    existingMember.status = 'active';
    existingMember.role = role;
  } else {
    this.members.push({
      user: userId,
      role: role,
      joinedAt: new Date(),
      status: 'active'
    });
  }
  return this.save();
};

groupSchema.methods.removeMember = function(userId) {
  const memberIndex = this.members.findIndex(m => m.user.toString() === userId.toString());
  if (memberIndex !== -1) {
    this.members.splice(memberIndex, 1);
  }
  return this.save();
};

groupSchema.methods.updateRating = function(newRating, breakdown = {}) {
  const currentTotal = this.rating.average * this.rating.count;
  this.rating.count += 1;
  this.rating.average = (currentTotal + newRating) / this.rating.count;
  
  // Обновляем детальную оценку
  if (Object.keys(breakdown).length > 0) {
    Object.keys(breakdown).forEach(key => {
      if (this.rating.breakdown[key] !== undefined) {
        this.rating.breakdown[key] = (this.rating.breakdown[key] * (this.rating.count - 1) + breakdown[key]) / this.rating.count;
      }
    });
  }
  
  return this.save();
};

groupSchema.methods.isMember = function(userId) {
  return this.members.some(m => m.user.toString() === userId.toString() && m.status === 'active');
};

groupSchema.methods.getMemberRole = function(userId) {
  const member = this.members.find(m => m.user.toString() === userId.toString());
  return member ? member.role : null;
};

groupSchema.methods.generateInviteCode = function() {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  this.inviteCode = code;
  return this.save();
};

// Статические методы
groupSchema.statics.findBySchool = function(school) {
  return this.find({
    school: school,
    isActive: true,
    status: 'active'
  }).populate('creator driver members.user');
};

groupSchema.statics.findNearby = function(coordinates, maxDistance = 10000) {
  return this.find({
    isActive: true,
    isPublic: true,
    status: 'active',
    $or: [
      { 'route.origin.location': { $near: { $geometry: { type: 'Point', coordinates: coordinates }, $maxDistance: maxDistance } } },
      { 'route.destination.location': { $near: { $geometry: { type: 'Point', coordinates: coordinates }, $maxDistance: maxDistance } } }
    ]
  }).populate('creator driver members.user');
};

groupSchema.statics.search = function(filters) {
  const query = {
    isActive: true,
    isPublic: true,
    status: 'active'
  };
  
  if (filters.school) {
    query.school = new RegExp(filters.school, 'i');
  }
  
  if (filters.type) {
    query.type = filters.type;
  }
  
  if (filters.minAge || filters.maxAge) {
    query['requirements.minAge'] = { $lte: filters.maxAge || 18 };
    query['requirements.maxAge'] = { $gte: filters.minAge || 0 };
  }
  
  return this.find(query).populate('creator driver members.user');
};

module.exports = mongoose.model('Group', groupSchema);
