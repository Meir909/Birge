const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  passengers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pickupLocation: {
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
      pickupTime: String,
      status: {
        type: String,
        enum: ['pending', 'picked_up', 'dropped_off', 'no_show'],
        default: 'pending'
      }
    },
    dropoffLocation: {
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
      dropoffTime: String
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
      },
      departureTime: Date
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
      },
      arrivalTime: Date
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
      estimatedArrival: Date,
      actualArrival: Date,
      order: Number
    }],
    actualPath: {
      type: mongoose.Schema.Types.Mixed, // фактический путь GPS
      coordinates: [[Number]],
      timestamps: [Date]
    }
  },
  schedule: {
    date: {
      type: Date,
      required: true
    },
    dayOfWeek: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    departureTime: {
      type: String,
      required: true
    },
    estimatedArrivalTime: String,
    returnTime: String
  },
  status: {
    type: String,
    enum: ['scheduled', 'preparing', 'in_progress', 'completed', 'cancelled', 'no_show'],
    default: 'scheduled'
  },
  progress: {
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    },
    lastUpdate: Date,
    nextStop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    estimatedArrival: Date
  },
  timing: {
    actualDepartureTime: Date,
    actualArrivalTime: Date,
    totalDuration: Number, // в минутах
    delays: [{
      reason: String,
      duration: Number, // в минутах
      timestamp: Date
    }]
  },
  metrics: {
    distance: {
      planned: Number, // в метрах
      actual: Number // в метрах
    },
    duration: {
      planned: Number, // в минутах
      actual: Number // в минутах
    },
    fuel: {
      estimated: Number, // в литрах
      actual: Number // в литрах
    },
    co2: {
      saved: Number // в кг CO2
    },
    cost: {
      total: Number, // общая стоимость
      perPassenger: Number // стоимость на пассажира
    }
  },
  safety: {
    incidents: [{
      type: {
        type: String,
        enum: ['traffic', 'weather', 'mechanical', 'other']
      },
      description: String,
      severity: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      timestamp: Date,
      resolved: Boolean
    }],
    checks: {
      vehicleInspection: {
        completed: Boolean,
        timestamp: Date,
        issues: [String]
      },
      driverStatus: {
        rested: Boolean,
        sober: Boolean,
        timestamp: Date
      }
    }
  },
  communication: {
    messagesSent: {
      type: Number,
      default: 0
    },
    lastNotification: Date,
    emergencyContacts: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      notified: Boolean,
      timestamp: Date
    }]
  },
  feedback: {
    driverRating: {
      type: Number,
      min: 0,
      max: 5
    },
    passengerRatings: [{
      passenger: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        min: 0,
        max: 5
      },
      punctuality: {
        type: Number,
        min: 0,
        max: 5
      },
      safety: {
        type: Number,
        min: 0,
        max: 5
      },
      communication: {
        type: Number,
        min: 0,
        max: 5
      },
      comment: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    issues: [{
      reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      type: {
        type: String,
        enum: ['late', 'no_show', 'route_change', 'behavior', 'safety', 'other']
      },
      description: String,
      severity: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      resolved: {
        type: Boolean,
        default: false
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  },
  weather: {
    conditions: {
      temperature: Number,
      humidity: Number,
      precipitation: Number,
      windSpeed: Number,
      visibility: Number
    },
    forecast: String,
    impact: {
      type: String,
      enum: ['none', 'minor', 'moderate', 'severe']
    }
  },
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
tripSchema.index({ group: 1 });
tripSchema.index({ driver: 1 });
tripSchema.index({ 'passengers.user': 1 });
tripSchema.index({ status: 1 });
tripSchema.index({ 'schedule.date': 1 });
tripSchema.index({ 'schedule.dayOfWeek': 1 });
tripSchema.index({ 'route.origin.location': '2dsphere' });
tripSchema.index({ 'route.destination.location': '2dsphere' });
tripSchema.index({ 'progress.currentLocation': '2dsphere' });

// Виртуальные поля
tripSchema.virtual('isCompleted').get(function() {
  return this.status === 'completed';
});

tripSchema.virtual('isInProgress').get(function() {
  return this.status === 'in_progress';
});

tripSchema.virtual('passengerCount').get(function() {
  return this.passengers.length;
});

tripSchema.virtual('pickedUpCount').get(function() {
  return this.passengers.filter(p => p.pickupLocation.status === 'picked_up').length;
});

tripSchema.virtual('droppedOffCount').get(function() {
  return this.passengers.filter(p => p.pickupLocation.status === 'dropped_off').length;
});

// Middleware
tripSchema.pre('save', function(next) {
  if (this.isModified('updatedAt')) {
    this.updatedAt = new Date();
  }
  
  // Обновляем прогресс на основе текущего местоположения
  if (this.progress.currentLocation && this.route.actualPath && this.route.actualPath.coordinates.length > 0) {
    // Простая логика расчета прогресса
    const totalPoints = this.route.actualPath.coordinates.length;
    const currentIndex = this.route.actualPath.coordinates.findIndex(point => 
      Math.abs(point[0] - this.progress.currentLocation.coordinates[0]) < 0.001 &&
      Math.abs(point[1] - this.progress.currentLocation.coordinates[1]) < 0.001
    );
    
    if (currentIndex !== -1) {
      this.progress.percentage = Math.round((currentIndex / totalPoints) * 100);
    }
  }
  
  next();
});

// Методы
tripSchema.methods.startTrip = function() {
  this.status = 'in_progress';
  this.timing.actualDepartureTime = new Date();
  this.progress.lastUpdate = new Date();
  return this.save();
};

tripSchema.methods.completeTrip = function() {
  this.status = 'completed';
  this.timing.actualArrivalTime = new Date();
  this.progress.percentage = 100;
  
  if (this.timing.actualDepartureTime) {
    this.timing.totalDuration = Math.round((this.timing.actualArrivalTime - this.timing.actualDepartureTime) / 60000); // в минутах
  }
  
  return this.save();
};

tripSchema.methods.cancelTrip = function(reason) {
  this.status = 'cancelled';
  if (reason) {
    this.feedback.issues.push({
      type: 'other',
      description: reason,
      severity: 'medium'
    });
  }
  return this.save();
};

tripSchema.methods.updateLocation = function(coordinates, timestamp) {
  this.progress.currentLocation = {
    type: 'Point',
    coordinates: coordinates
  };
  this.progress.lastUpdate = timestamp || new Date();
  
  // Добавляем точку в фактический путь
  if (!this.route.actualPath) {
    this.route.actualPath = { coordinates: [], timestamps: [] };
  }
  this.route.actualPath.coordinates.push(coordinates);
  this.route.actualPath.timestamps.push(timestamp || new Date());
  
  return this.save();
};

tripSchema.methods.pickupPassenger = function(passengerId) {
  const passenger = this.passengers.find(p => p.user.toString() === passengerId.toString());
  if (passenger) {
    passenger.pickupLocation.status = 'picked_up';
    passenger.pickupLocation.pickupTime = new Date();
  }
  return this.save();
};

tripSchema.methods.dropoffPassenger = function(passengerId) {
  const passenger = this.passengers.find(p => p.user.toString() === passengerId.toString());
  if (passenger) {
    passenger.pickupLocation.status = 'dropped_off';
    passenger.dropoffLocation.dropoffTime = new Date();
  }
  return this.save();
};

tripSchema.methods.addPassenger = function(userId, pickupLocation, dropoffLocation) {
  // Проверяем, не является ли пользователь уже пассажиром
  const existingPassenger = this.passengers.find(p => p.user.toString() === userId.toString());
  if (existingPassenger) {
    return this;
  }
  
  this.passengers.push({
    user: userId,
    pickupLocation: {
      ...pickupLocation,
      status: 'pending'
    },
    dropoffLocation: dropoffLocation || {}
  });
  
  return this.save();
};

tripSchema.methods.removePassenger = function(userId) {
  this.passengers = this.passengers.filter(p => p.user.toString() !== userId.toString());
  return this.save();
};

tripSchema.methods.addFeedback = function(passengerId, rating, breakdown = {}, comment = '') {
  this.feedback.passengerRatings.push({
    passenger: passengerId,
    rating: rating,
    punctuality: breakdown.punctuality || 5,
    safety: breakdown.safety || 5,
    communication: breakdown.communication || 5,
    comment: comment
  });
  
  // Рассчитываем средний рейтинг
  const ratings = this.feedback.passengerRatings.map(r => r.rating);
  this.feedback.driverRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  
  return this.save();
};

tripSchema.methods.addIncident = function(type, description, severity = 'medium') {
  this.safety.incidents.push({
    type: type,
    description: description,
    severity: severity,
    timestamp: new Date(),
    resolved: false
  });
  return this.save();
};

tripSchema.methods.resolveIncident = function(incidentIndex) {
  if (this.safety.incidents[incidentIndex]) {
    this.safety.incidents[incidentIndex].resolved = true;
  }
  return this.save();
};

// Статические методы
tripSchema.statics.findScheduled = function(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return this.find({
    'schedule.date': {
      $gte: startOfDay,
      $lte: endOfDay
    },
    status: { $in: ['scheduled', 'preparing'] }
  }).populate('driver passengers.user group');
};

tripSchema.statics.findActive = function() {
  return this.find({
    status: 'in_progress'
  }).populate('driver passengers.user group');
};

tripSchema.statics.findByDriver = function(driverId, startDate, endDate) {
  const query = {
    driver: driverId
  };
  
  if (startDate && endDate) {
    query['schedule.date'] = {
      $gte: startDate,
      $lte: endDate
    };
  }
  
  return this.find(query).populate('passengers.user group').sort({ 'schedule.date': -1 });
};

tripSchema.statics.findByPassenger = function(passengerId, startDate, endDate) {
  const query = {
    'passengers.user': passengerId
  };
  
  if (startDate && endDate) {
    query['schedule.date'] = {
      $gte: startDate,
      $lte: endDate
    };
  }
  
  return this.find(query).populate('driver passengers.user group').sort({ 'schedule.date': -1 });
};

tripSchema.statics.getStats = function(driverId, period = 'month') {
  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
  
  return this.aggregate([
    {
      $match: {
        driver: new mongoose.Types.ObjectId(driverId),
        'schedule.date': { $gte: startDate },
        status: 'completed'
      }
    },
    {
      $group: {
        _id: null,
        totalTrips: { $sum: 1 },
        totalDistance: { $sum: '$metrics.distance.actual' },
        totalDuration: { $sum: '$timing.totalDuration' },
        totalCo2Saved: { $sum: '$metrics.co2.saved' },
        averageRating: { $avg: '$feedback.driverRating' },
        totalPassengers: { $sum: { $size: '$passengers' } }
      }
    }
  ]);
};

module.exports = mongoose.model('Trip', tripSchema);
