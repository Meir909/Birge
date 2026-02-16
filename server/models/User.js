const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Имя обязательно'],
    trim: true,
    maxlength: [50, 'Имя не может быть длиннее 50 символов']
  },
  phone: {
    type: String,
    required: [true, 'Телефон обязателен'],
    unique: true,
    match: [/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Неверный формат телефона']
  },
  email: {
    type: String,
    sparse: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Неверный формат email']
  },
  role: {
    type: String,
    enum: ['driver', 'parent', 'both'],
    default: 'parent'
  },
  school: {
    type: String,
    required: [true, 'Школа обязательна'],
    trim: true
  },
  grade: {
    type: String,
    trim: true
  },
  district: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: function() {
      return `https://picsum.photos/seed/${this.phone}/100/100`;
    }
  },
  vehicle: {
    make: String,
    model: String,
    color: String,
    licensePlate: String,
    capacity: {
      type: Number,
      default: 4
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [37.6173, 55.7558] // Москва по умолчанию
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
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    documents: [{
      type: String, // URL к документу
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    verifiedAt: Date
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
    co2Saved: {
      type: Number,
      default: 0
    },
    moneySaved: {
      type: Number,
      default: 0
    }
  },
  settings: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    },
    privacy: {
      showPhone: {
        type: Boolean,
        default: false
      },
      showEmail: {
        type: Boolean,
        default: false
      },
      showLocation: {
        type: Boolean,
        default: true
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
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
userSchema.index({ phone: 1 });
userSchema.index({ email: 1 });
userSchema.index({ school: 1 });
userSchema.index({ location: '2dsphere' });
userSchema.index({ 'verification.isVerified': 1 });

// Виртуальные поля
userSchema.virtual('fullAddress').get(function() {
  return `${this.district ? this.district + ', ' : ''}${this.school}`;
});

// Middleware
userSchema.pre('save', async function(next) {
  if (this.isModified('updatedAt')) {
    this.updatedAt = new Date();
  }
  next();
});

// Методы
userSchema.methods.comparePhone = function(phone) {
  return this.phone === phone;
};

userSchema.methods.updateRating = function(newRating) {
  const currentTotal = this.rating.average * this.rating.count;
  this.rating.count += 1;
  this.rating.average = (currentTotal + newRating) / this.rating.count;
  return this.save();
};

userSchema.methods.updateStats = function(tripData) {
  this.stats.totalTrips += 1;
  this.stats.totalDistance += tripData.distance || 0;
  this.stats.co2Saved += tripData.co2Saved || 0;
  this.stats.moneySaved += tripData.moneySaved || 0;
  return this.save();
};

userSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  if (!obj.settings.privacy.showPhone) {
    delete obj.phone;
  }
  if (!obj.settings.privacy.showEmail) {
    delete obj.email;
  }
  if (!obj.settings.privacy.showLocation) {
    delete obj.location;
  }
  return obj;
};

// Статические методы
userSchema.statics.findByLocation = function(coordinates, maxDistance = 10000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance
      }
    }
  });
};

userSchema.statics.findDrivers = function(school) {
  return this.find({
    school: school,
    role: { $in: ['driver', 'both'] },
    'verification.isVerified': true,
    isActive: true
  });
};

module.exports = mongoose.model('User', userSchema);
