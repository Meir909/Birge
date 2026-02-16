import './App.css'
import React, { useState } from 'react';

function App() {
  const [requests, setRequests] = useState([]);

  const neighbors = [
    { id: 1, name: "Арман (папа Алины)", car: "Toyota Camry", seats: 2, dist: "200м от вас", time: "07:45" },
    { id: 2, name: "Елена (мама Марка)", car: "Hyundai Tucson", seats: 3, dist: "450м от вас", time: "08:00" },
    { id: 3, name: "Берик (папа Нурика)", car: "Kia Sportage", seats: 1, dist: "100м от вас", time: "07:50" },
  ];

  const handleJoin = (name) => {
    alert(`Запрос отправлен ${name}!`);
    setRequests([...requests, name]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Segoe UI, sans-serif', background: 'rgb(183, 233, 200)', minHeight: '100vh' , width:'100%' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#456c58' }}>bektemis</h1>
        <p>Объединяйтесь с родителями, экономьте время!</p>
      </header>

      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h3>📍 Родители в вашем дворе:</h3>
        {neighbors.map(parent => (
          <div key={parent.id} style={{
            background: 'white', padding: '15px', borderRadius: '12px', 
            marginBottom: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: requests.includes(parent.name) ? '2px solid #4CAF50' : 'none'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0' }}>{parent.name}</h4>
                <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>🚗 {parent.car} • 💺 Мест: {parent.seats}</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#4A90E2' }}>📍 {parent.dist} • ⏰ Выезд: {parent.time}</p>
              </div>
              <button 
                onClick={() => handleJoin(parent.name)}
                disabled={requests.includes(parent.name)}
                style={{
                  padding: '10px 15px', borderRadius: '8px', border: 'none',
                  background: requests.includes(parent.name) ? '#ccc' : '#4A90E2',
                  color: 'white', cursor: 'pointer'
                }}
              >
                {requests.includes(parent.name) ? 'Ждем ответа' : 'Вместе'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
