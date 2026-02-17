"use client";

import React from 'react';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import BottomNav from '@/components/layout/BottomNav';
import Card from '@/components/ui/Card';
import { AIBadge, EfficiencyScore } from '@/components/ai/AIElements';
import {
    Search,
    PlusSquare,
    Clock,
    MapPin,
    Car,
    TrendingUp,
    Leaf,
    Bell,
    MessageSquare,
    ChevronRight,
    User,
    Star,
    Map as MapIcon,
    Bot
} from 'lucide-react';

export default function DashboardPage() {
    const recommendations = [
        { id: 1, name: 'Анна С.', rating: 4.9, school: 'Школа №5', time: '08:00', match: 95 },
        { id: 2, name: 'Олег И.', rating: 4.7, school: 'Школа №5', time: '08:15', match: 88 },
        { id: 3, name: 'Мария П.', rating: 4.8, school: 'Школа №5', time: '07:45', match: 82 },
    ];

    const notifications = [
        { id: 1, type: 'request', text: 'Новая заявка от Азамата', time: '5 мин назад', unread: true },
        { id: 2, type: 'cancel', text: 'Поездка на завтра отменена', time: '1 час назад', unread: false },
        { id: 3, type: 'reminder', text: 'Выезд через 30 минут', time: '2 часа назад', unread: false },
    ];

    return (
        <div className="min-h-screen bg-light-gray flex flex-col lg:flex-row">
            <DashboardSidebar />
            <BottomNav />

            {/* Main Content */}
            <main className="flex-1 lg:ml-60 p-4 lg:p-8 flex flex-col gap-8 pb-20 lg:pb-8">
                {/* Header */}
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-dark">Доброе утро, Иван! 👋</h1>
                        <p className="text-gray-500 font-medium">Вторник, 17 февраля 2026</p>
                    </div>
                    <button className="relative p-2 bg-white rounded-full shadow-sm lg:hidden">
                        <Bell className="w-6 h-6 text-dark" />
                        <div className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
                    </button>
                </header>

                {/* AI Recommendations */}
                <Card className="bg-gradient-to-r from-accent to-[#FBBF24] p-6 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Bot className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 fill-current" />
                            <h2 className="text-xl font-bold">Рекомендации от AI</h2>
                        </div>
                        <p className="max-w-md font-medium">Найдено 3 подходящих варианта для вас на сегодня.</p>

                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {recommendations.map((rec) => (
                                <Card key={rec.id} className="min-w-[240px] bg-white/10 backdrop-blur-md border border-white/20 p-4 text-white hover:scale-105" hover={false}>
                                    <div className="flex gap-3 items-center mb-4">
                                        <div className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center font-bold">
                                            {rec.name[0]}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold">{rec.name}</div>
                                            <div className="text-[10px] flex items-center gap-1 opacity-80">
                                                <Star className="w-2 h-2 fill-current" /> {rec.rating}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 mb-4">
                                        <div className="text-[10px] uppercase opacity-60 tracking-wider">Школа</div>
                                        <div className="text-sm font-medium">{rec.school}</div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="opacity-60">Выезд:</span>
                                            <span className="font-bold">{rec.time}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex justify-between text-[10px] font-bold">
                                            <span>СОВМЕСТИМОСТЬ</span>
                                            <span>{rec.match}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                                            <div className="h-full bg-white" style={{ width: `${rec.match}%` }} />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                        <button className="flex items-center gap-2 text-sm font-bold mt-2 hover:translate-x-1 transition-transform">
                            Посмотреть все рекомендации <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Active Trip */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <h3 className="text-xl font-bold">Активные поездки</h3>
                        <Card className="p-6 relative">
                            <div className="absolute top-6 right-6 px-3 py-1 bg-accent bg-opacity-10 text-accent text-xs font-bold rounded-full">
                                Через 2 часа
                            </div>
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white">
                                            <Car className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">08:00 - 08:30</p>
                                            <h4 className="text-lg font-bold">Вы - водитель</h4>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-dark font-medium">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span>ул. Пушкина → Школа №5</span>
                                    </div>
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                                                <User className="w-4 h-4" />
                                            </div>
                                        ))}
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                            +2
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 justify-end">
                                    <Button variant="secondary" icon={MapIcon} className="w-full md:w-auto">Карта</Button>
                                    <Button variant="primary" className="w-full md:w-auto">Начать поездку</Button>
                                </div>
                            </div>
                        </Card>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="hover:border-primary border border-transparent p-6 flex flex-col gap-4 cursor-pointer group">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Search className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold">Найти поездку</h4>
                                    <p className="text-xs text-gray-500">Найти подходящую группу</p>
                                </div>
                            </Card>
                            <Card className="hover:border-primary border border-transparent p-6 flex flex-col gap-4 cursor-pointer group">
                                <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                                    <PlusSquare className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold">Создать поездку</h4>
                                    <p className="text-xs text-gray-500">Стать водителем</p>
                                </div>
                            </Card>
                            <Card className="hover:border-primary border border-transparent p-6 flex flex-col gap-4 cursor-pointer group">
                                <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center group-hover:bg-dark group-hover:text-white transition-colors">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold">История</h4>
                                    <p className="text-xs text-gray-500">Прошлые поездки</p>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Sidebar Area: Stats & Notifications */}
                    <div className="flex flex-col gap-8">
                        {/* Stats */}
                        <div className="grid grid-cols-1 gap-4">
                            <Card className="p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                    <Car className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">24</div>
                                    <div className="text-xs text-gray-400 font-medium uppercase">Поездок в этом месяце</div>
                                </div>
                            </Card>
                            <Card className="p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">3,450 ₸</div>
                                    <div className="text-xs text-gray-400 font-medium uppercase">Сэкономлено</div>
                                </div>
                            </Card>
                            <Card className="p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                                    <Leaf className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">45.2 кг</div>
                                    <div className="text-xs text-gray-400 font-medium uppercase">CO₂ Экономия</div>
                                </div>
                            </Card>
                        </div>

                        {/* Notifications Panel */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold">Уведомления</h3>
                                <button className="text-xs text-primary font-bold">Все</button>
                            </div>
                            <div className="flex flex-col gap-3">
                                {notifications.map((notif) => (
                                    <Card key={notif.id} className={`p-4 ${notif.unread ? 'bg-primary bg-opacity-5' : ''}`} hover={false}>
                                        <div className="flex gap-3">
                                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${notif.unread ? 'bg-primary' : 'bg-transparent'}`} />
                                            <div className="flex flex-col gap-1">
                                                <p className={`text-sm ${notif.unread ? 'font-bold' : 'font-medium'} text-dark leading-tight`}>
                                                    {notif.text}
                                                </p>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase">{notif.time}</span>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Floating AI Button */}
            <div className="fixed bottom-20 lg:bottom-8 right-8 z-50">
                <button className="w-16 h-16 bg-accent text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group">
                    <Bot className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                        2
                    </div>
                </button>
            </div>
        </div>
    );
}
