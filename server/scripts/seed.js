const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Импорт моделей
const User = require('../models/User');
const Group = require('../models/Group');
const Trip = require('../models/Trip');
const Message = require('../models/Message');

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/biroad', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Тестовые данные
const users = [
  {
    name: 'Анна Петрова',
    phone: '+7 (916) 123-45-67',
    email: 'anna.petrova@example.com',
    role: 'driver',
    school: 'Школа №123',
    grade: '5 класс',
    district: 'Центральный',
    vehicle: {
      make: 'Toyota',
      model: 'Camry',
      color: 'Серебристый',
      licensePlate: 'А123ВС777',
      capacity: 4
    },
    verification: {
      isVerified: true,
      verifiedAt: new Date()
    },
    location: {
      type: 'Point',
      coordinates: [37.6173, 55.7558]
    }
  },
  {
    name: 'Иван Сидоров',
    phone: '+7 (916) 234-56-78',
    email: 'ivan.sidorov@example.com',
    role: 'parent',
    school: 'Школа №123',
    grade: '5 класс',
    district: 'Центральный',
    verification: {
      isVerified: true,
      verifiedAt: new Date()
    },
    location: {
      type: 'Point',
      coordinates: [37.6273, 55.7658]
    }
  },
  {
    name: 'Мария Иванова',
    phone: '+7 (916) 345-67-89',
    email: 'maria.ivanova@example.com',
    role: 'parent',
    school: 'Школа №123',
    grade: '3 класс',
    district: 'Центральный',
    verification: {
      isVerified: true,
      verifiedAt: new Date()
    },
    location: {
      type: 'Point',
      coordinates: [37.6073, 55.7458]
    }
  },
  {
    name: 'Дмитрий Кузнецов',
    phone: '+7 (916) 456-78-90',
    email: 'dmitry.kuznetsov@example.com',
    role: 'driver',
    school: 'Лицей №15',
    grade: '10 класс',
    district: 'Северный',
    vehicle: {
      make: 'Volkswagen',
      model: 'Polo',
      color: 'Синий',
      licensePlate: 'Б456АС777',
      capacity: 4
    },
    verification: {
      isVerified: true,
      verifiedAt: new Date()
    },
    location: {
      type: 'Point',
      coordinates: [37.6373, 55.7758]
    }
  },
  {
    name: 'Елена Смирнова',
    phone: '+7 (916) 567-89-01',
    email: 'elena.smirnova@example.com',
    role: 'parent',
    school: 'Лицей №15',
    grade: '10 класс',
    district: 'Северный',
    verification: {
      isVerified: true,
      verifiedAt: new Date()
    },
    location: {
      type: 'Point',
      coordinates: [37.6473, 55.7858]
    }
  }
];

const groups = [
  {
    name: 'Утренняя группа Школа №123',
    description: 'Ежедневные поездки в Школу №123 утром',
    school: 'Школа №123',
    type: 'morning',
    capacity: {
      total: 4,
      available: 2
    },
    schedule: {
      monday: { active: true, departureTime: '08:00', returnTime: '16:30' },
      tuesday: { active: true, departureTime: '08:00', returnTime: '16:30' },
      wednesday: { active: true, departureTime: '08:00', returnTime: '16:30' },
      thursday: { active: true, departureTime: '08:00', returnTime: '16:30' },
      friday: { active: true, departureTime: '08:00', returnTime: '16:30' }
    },
    route: {
      origin: {
        name: 'Остановка "Парк Горького"',
        address: 'ул. Крымский Вал, 9',
        location: { type: 'Point', coordinates: [37.6034, 55.7439] }
      },
      destination: {
        name: 'Школа №123',
        address: 'ул. Ленина, 123',
        location: { type: 'Point', coordinates: [37.6173, 55.7558] }
      },
      estimatedDistance: 2500,
      estimatedDuration: 15
    },
    requirements: {
      minAge: 6,
      maxAge: 12,
      gradeRange: { from: '1', to: '5' }
    },
    pricing: {
      type: 'shared',
      amount: 100,
      currency: 'RUB'
    },
    safety: {
      driverVerified: true,
      vehicleInspected: true,
      insuranceValid: true
    }
  },
  {
    name: 'Вечерняя группа Лицей №15',
    description: 'Вечерние поездки из Лицея №15',
    school: 'Лицей №15',
    type: 'evening',
    capacity: {
      total: 4,
      available: 3
    },
    schedule: {
      monday: { active: true, departureTime: '17:30' },
      tuesday: { active: true, departureTime: '17:30' },
      wednesday: { active: true, departureTime: '17:30' },
      thursday: { active: true, departureTime: '17:30' },
      friday: { active: true, departureTime: '17:30' }
    },
    route: {
      origin: {
        name: 'Лицей №15',
        address: 'пр. Мира, 45',
        location: { type: 'Point', coordinates: [37.6373, 55.7758] }
      },
      destination: {
        name: 'Метро "Проспект Ветеранов"',
        address: 'пр. Ветеранов, 85',
        location: { type: 'Point', coordinates: [37.6473, 55.7858] }
      },
      estimatedDistance: 3000,
      estimatedDuration: 20
    },
    requirements: {
      minAge: 14,
      maxAge: 17,
      gradeRange: { from: '9', to: '11' }
    },
    pricing: {
      type: 'free'
    },
    safety: {
      driverVerified: true,
      vehicleInspected: true,
      insuranceValid: true
    }
  }
];

const messages = [
  {
    type: 'system',
    content: 'Добро пожаловать в группу!',
    metadata: {
      systemAction: 'user_joined'
    }
  },
  {
    type: 'text',
    content: 'Привет! Я буду водителем в этой группе.',
    metadata: {}
  },
  {
    type: 'text',
    content: 'Отлично! Во сколько отправляемся завтра?',
    metadata: {}
  },
  {
    type: 'broadcast',
    content: 'Завтра будет дождь, одевайтесь тепло!',
    metadata: {
      alertLevel: 'warning'
    }
  }
];

// Функция для очистки базы данных
async function clearDatabase() {
  console.log('Очистка базы данных...');
  await User.deleteMany({});
  await Group.deleteMany({});
  await Trip.deleteMany({});
  await Message.deleteMany({});
  console.log('База данных очищена');
}

// Функция для создания пользователей
async function createUsers() {
  console.log('Создание пользователей...');
  const createdUsers = [];
  
  for (const userData of users) {
    const user = new User(userData);
    await user.save();
    createdUsers.push(user);
    console.log(`Создан пользователь: ${user.name}`);
  }
  
  return createdUsers;
}

// Функция для создания групп
async function createGroups(userList) {
  console.log('Создание групп...');
  const createdGroups = [];
  
  for (let i = 0; i < groups.length; i++) {
    const groupData = groups[i];
    
    // Назначаем создателя и водителя
    if (i === 0) {
      groupData.creator = userList[0]._id; // Анна Петрова (водитель)
      groupData.driver = userList[0]._id;
      
      // Добавляем участников
      groupData.members = [
        { user: userList[0]._id, role: 'driver' },
        { user: userList[1]._id, role: 'parent' },
        { user: userList[2]._id, role: 'parent' }
      ];
    } else {
      groupData.creator = userList[3]._id; // Дмитрий Кузнецов (водитель)
      groupData.driver = userList[3]._id;
      
      // Добавляем участников
      groupData.members = [
        { user: userList[3]._id, role: 'driver' },
        { user: userList[4]._id, role: 'parent' }
      ];
    }
    
    const group = new Group(groupData);
    await group.save();
    createdGroups.push(group);
    console.log(`Создана группа: ${group.name}`);
  }
  
  return createdGroups;
}

// Функция для создания поездок
async function createTrips(groupList, userList) {
  console.log('Создание поездок...');
  const createdTrips = [];
  
  // Создаем поездки на ближайшую неделю
  const today = new Date();
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  
  for (const group of groupList) {
    for (let i = 0; i < 5; i++) {
      const tripDate = new Date(today);
      tripDate.setDate(today.getDate() + i);
      
      const dayOfWeek = days[tripDate.getDay() - 1] || 'monday';
      const schedule = group.schedule[dayOfWeek];
      
      if (schedule && schedule.active) {
        const departureTime = new Date(tripDate);
        const [hours, minutes] = schedule.departureTime.split(':');
        departureTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        const tripData = {
          group: group._id,
          driver: group.driver,
          schedule: {
            date: tripDate,
            dayOfWeek: dayOfWeek,
            departureTime: schedule.departureTime,
            estimatedArrivalTime: '08:15'
          },
          route: {
            origin: group.route.origin,
            destination: group.route.destination,
            waypoints: []
          },
          status: i === 0 ? 'in_progress' : 'scheduled',
          metrics: {
            distance: {
              planned: group.route.estimatedDistance
            },
            duration: {
              planned: group.route.estimatedDuration
            },
            co2: {
              saved: 2.5
            },
            cost: {
              total: group.pricing.amount || 0,
              perPassenger: (group.pricing.amount || 0) / group.members.length
            }
          }
        };
        
        // Добавляем пассажиров
        const passengers = group.members.filter(m => m.role === 'parent');
        tripData.passengers = passengers.map(p => ({
          user: p.user,
          pickupLocation: {
            name: 'Дом',
            address: 'Адрес пассажира',
            location: userList.find(u => u._id.toString() === p.user.toString())?.location?.coordinates || [37.6173, 55.7558]
          },
          dropoffLocation: {
            name: 'Школа',
            address: group.route.destination.address,
            location: group.route.destination.location.coordinates
          }
        }));
        
        const trip = new Trip(tripData);
        await trip.save();
        createdTrips.push(trip);
        console.log(`Создана поездка для группы ${group.name} на ${tripDate.toLocaleDateString()}`);
      }
    }
  }
  
  return createdTrips;
}

// Функция для создания сообщений
async function createMessages(groupList, userList) {
  console.log('Создание сообщений...');
  
  for (const group of groupList) {
    for (let i = 0; i < messages.length; i++) {
      const messageData = messages[i];
      
      if (messageData.type === 'system' || messageData.type === 'broadcast') {
        messageData.group = group._id;
        messageData.sender = null;
      } else {
        messageData.group = group._id;
        messageData.sender = group.driver; // Водитель отправляет сообщение
      }
      
      // Добавляем получателей
      messageData.recipients = group.members.map(m => ({
        user: m.user,
        read: Math.random() > 0.5 // Случайно помечаем некоторые как прочитанные
      }));
      
      const message = new Message(messageData);
      await message.save();
      console.log(`Создано сообщение для группы ${group.name}`);
    }
  }
}

// Основная функция
async function seedDatabase() {
  try {
    console.log('Начало наполнения базы данных...');
    
    // Очищаем базу данных
    await clearDatabase();
    
    // Создаем данные
    const users = await createUsers();
    const groups = await createGroups(users);
    const trips = await createTrips(groups, users);
    await createMessages(groups, users);
    
    console.log('\n✅ База данных успешно наполнена тестовыми данными!');
    console.log(`👥 Создано пользователей: ${users.length}`);
    console.log(`🚗 Создано групп: ${groups.length}`);
    console.log(`🛣️ Создано поездок: ${trips.length}`);
    console.log(`💬 Создано сообщений: ${groups.length * messages.length}`);
    
    console.log('\n📋 Данные для входа:');
    console.log('Водитель 1: +7 (916) 123-45-67');
    console.log('Родитель 1: +7 (916) 234-56-78');
    console.log('SMS код для входа: 123456');
    
  } catch (error) {
    console.error('❌ Ошибка при наполнении базы данных:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Запуск
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
