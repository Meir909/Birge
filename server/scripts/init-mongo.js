// Инициализация MongoDB при первом запуске
db = db.getSiblingDB('biroad');

// Создаем пользователя приложения
db.createUser({
  user: 'biroad_user',
  pwd: 'biroad_password',
  roles: [
    {
      role: 'readWrite',
      db: 'biroad'
    }
  ]
});

// Создаем индексы для коллекций
db.users.createIndex({ "phone": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true, sparse: true });
db.users.createIndex({ "school": 1 });
db.users.createIndex({ "location": "2dsphere" });
db.users.createIndex({ "verification.isVerified": 1 });

db.groups.createIndex({ "school": 1 });
db.groups.createIndex({ "creator": 1 });
db.groups.createIndex({ "driver": 1 });
db.groups.createIndex({ "members.user": 1 });
db.groups.createIndex({ "status": 1 });
db.groups.createIndex({ "isActive": 1 });
db.groups.createIndex({ "route.origin.location": "2dsphere" });
db.groups.createIndex({ "route.destination.location": "2dsphere" });

db.trips.createIndex({ "group": 1 });
db.trips.createIndex({ "driver": 1 });
db.trips.createIndex({ "passengers.user": 1 });
db.trips.createIndex({ "status": 1 });
db.trips.createIndex({ "schedule.date": 1 });
db.trips.createIndex({ "route.origin.location": "2dsphere" });
db.trips.createIndex({ "route.destination.location": "2dsphere" });
db.trips.createIndex({ "progress.currentLocation": "2dsphere" });

db.messages.createIndex({ "group": 1, "createdAt": -1 });
db.messages.createIndex({ "sender": 1 });
db.messages.createIndex({ "recipients.user": 1 });
db.messages.createIndex({ "type": 1 });
db.messages.createIndex({ "priority": 1 });
db.messages.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

print('MongoDB initialized successfully');
