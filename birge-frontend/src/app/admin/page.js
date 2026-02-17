"use client";

import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
    Users,
    Map as MapIcon,
    Car,
    BarChart2,
    ShieldAlert,
    Bell,
    Search,
    School,
    ArrowUpRight,
    MoreVertical,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

export default function AdminPage() {
    const stats = [
        { label: 'Всего пользователей', val: '1,247', growth: '+12%', icon: Users, color: 'primary' },
        { label: 'Активных поездок', val: '84', growth: '+5%', icon: Car, color: 'secondary' },
        { label: 'Подключено школ', val: '12', growth: '0%', icon: School, color: 'accent' },
        { label: 'Выручка (сервис)', val: '124,500 ₸', growth: '+18%', icon: BarChart2, color: 'dark' },
    ];

    const recentTrips = [
        { id: 'TR-9021', driver: 'Иван П.', path: 'Абая → Школа №5', status: 'В пути', efficiency: 95 },
        { id: 'TR-9022', driver: 'Анна С.', path: 'Достык → Школа №5', status: 'Ожидание', efficiency: 88 },
        { id: 'TR-9023', driver: 'Олег И.', path: 'Ленина → Школа №2', status: 'Завершена', efficiency: 92 },
    ];

    return (
        <div className="min-h-screen bg-light-gray flex">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-dark text-white hidden lg:flex flex-col p-6 h-screen sticky top-0">
                <div className="flex items-center gap-2 mb-12">
                    <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white">
                        <Car className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Birge Admin</span>
                </div>

                <nav className="flex-col gap-2 flex-1">
                    {[
                        { name: 'Обзор', icon: BarChart2, active: true },
                        { name: 'Пользователи', icon: Users },
                        { name: 'Поездки', icon: Car },
                        { name: 'Школы', icon: School },
                        { name: 'Безопасность', icon: ShieldAlert },
                    ].map(item => (
                        <button key={item.name} className={`w-full flex items-center gap-3 px-4 py-3 rounded-button text-sm font-bold transition-all ${item.active ? 'bg-primary text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}>
                            <item.icon className="w-4 h-4" /> {item.name}
                        </button>
                    ))}
                </nav>

                <button className="flex items-center gap-3 px-4 py-3 text-white/50 hover:text-error transition-colors mt-auto font-bold text-sm">
                    Выйти
                </button>
            </aside>

            {/* Admin Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-2xl font-bold text-dark">Статистика платформы</h1>
                        <p className="text-gray-500 font-medium text-sm">Обзор активности за последние 24 часа</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input className="pl-10 pr-4 py-2 bg-white rounded-full text-sm outline-none w-64 border border-transparent focus:border-primary shadow-sm" placeholder="Поиск (ID, Имя, Номер)..." />
                        </div>
                        <button className="p-2 bg-white rounded-full shadow-sm text-dark relative">
                            <Bell className="w-5 h-5" />
                            <div className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full animate-pulse" />
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map(s => (
                        <Card key={s.label} className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg bg-${s.color === 'primary' ? 'primary' : s.color === 'secondary' ? 'secondary' : s.color === 'accent' ? 'accent' : 'dark'}`}>
                                    <s.icon className="w-6 h-6" />
                                </div>
                                <div className="flex items-center gap-1 text-secondary font-bold text-xs">
                                    {s.growth} <ArrowUpRight className="w-3 h-3" />
                                </div>
                            </div>
                            <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{s.label}</h4>
                            <p className="text-2xl font-bold text-dark tracking-tight">{s.val}</p>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Monitor Map */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold flex items-center gap-2"><MapIcon className="w-5 h-5 text-primary" /> Мониторинг перемещений</h3>
                            <span className="px-3 py-1 bg-secondary bg-opacity-10 text-secondary text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-2">
                                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" /> Live
                            </span>
                        </div>
                        <Card className="flex-1 min-h-[400px] bg-gray-200 p-0 relative overflow-hidden flex items-center justify-center">
                            <p className="text-gray-400 font-bold italic select-none">Общая карта поездок города</p>
                            {/* Mock Dots */}
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className={`absolute w-3 h-3 rounded-full bg-primary border-2 border-white shadow-sm animate-pulse`} style={{ top: `${20 + i * 10}%`, left: `${30 + i * 8}%` }} />
                            ))}
                            <div className="absolute top-1/2 right-1/4 w-3 h-3 rounded-full bg-error border-2 border-white shadow-sm animate-bounce" />
                        </Card>

                        {/* Transactions Table */}
                        <Card className="p-0 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                                <h4 className="font-bold">Последние поездки</h4>
                                <Button variant="ghost" className="text-xs h-8">Экспорт</Button>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Водитель</th>
                                        <th className="px-6 py-4">Маршрут</th>
                                        <th className="px-6 py-4">Статус</th>
                                        <th className="px-6 py-4">AI Score</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {recentTrips.map(t => (
                                        <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-400">{t.id}</td>
                                            <td className="px-6 py-4 font-bold">{t.driver}</td>
                                            <td className="px-6 py-4 text-gray-500 font-medium">{t.path}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${t.status === 'В пути' ? 'bg-primary bg-opacity-10 text-primary' : t.status === 'Ожидание' ? 'bg-accent bg-opacity-10 text-accent' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-primary">{t.efficiency}%</td>
                                            <td className="px-6 py-4">
                                                <button className="p-1 hover:bg-gray-100 rounded">
                                                    <MoreVertical className="w-4 h-4 text-gray-400" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    </div>

                    {/* Alerts Column */}
                    <div className="flex flex-col gap-6">
                        <h3 className="font-bold flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-error" /> Безопасность</h3>
                        <Card className="p-6 border-l-4 border-error">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 bg-error bg-opacity-10 text-error rounded-full flex items-center justify-center shrink-0">
                                    <AlertCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-sm">Подозрительная активность</h5>
                                    <p className="text-xs text-gray-500 font-medium mt-1">Пользователь (ID: 5521) отклонился от маршрута на 1.5 км без предупреждения.</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button className="flex-1 h-10 text-xs bg-error hover:bg-error/90 border-none">Блокировка</Button>
                                <Button variant="secondary" className="flex-1 h-10 text-xs">Игнорировать</Button>
                            </div>
                        </Card>

                        <Card className="p-0 overflow-hidden">
                            <div className="p-6 border-b border-gray-50">
                                <h4 className="font-bold">Лог действий</h4>
                            </div>
                            <div className="p-6 space-y-6">
                                {[
                                    { time: '12:45', action: 'Новая школа', desc: 'Добавлена Гимназия №1' },
                                    { time: '12:30', action: 'Верификация', desc: 'Ильнур К. верифицировал авто' },
                                    { time: '12:15', action: 'Регистрация', desc: '5 новых пользователей за час' },
                                ].map((log, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase leading-none">{log.time}</div>
                                        <div className="flex-1">
                                            <h6 className="text-xs font-bold text-dark leading-none mb-1">{log.action}</h6>
                                            <p className="text-[10px] text-gray-500 font-medium leading-tight">{log.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-gray-50 text-center">
                                <button className="text-xs font-bold text-primary hover:underline">Смотреть все логи</button>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
