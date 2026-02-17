"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import BottomNav from '@/components/layout/BottomNav';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
    Sparkles,
    MapPin,
    Navigation,
    Clock,
    CheckCircle,
    Car,
    TrendingUp,
    Leaf,
    ChevronLeft,
    GripVertical,
    Bot
} from 'lucide-react';

export default function RouteOptimizerPage() {
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const passengers = [
        { id: 1, name: 'Алиса (3Б)', address: 'ул. Абая, 12' },
        { id: 2, name: 'Темирлан (2А)', address: 'пр. Гагарина, 45' },
        { id: 3, name: 'София (4В)', address: 'ул. Достык, 89' },
    ];

    const handleOptimize = () => {
        setIsOptimizing(true);
        setTimeout(() => {
            setIsOptimizing(false);
            setIsDone(true);
        }, 2500);
    };

    return (
        <div className="min-h-screen bg-light-gray flex flex-col lg:flex-row">
            <DashboardSidebar />
            <BottomNav />

            <main className="flex-1 lg:ml-60 p-4 lg:p-8 space-y-8 pb-32">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="lg:hidden p-2 bg-white rounded-lg shadow-sm">
                            <ChevronLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-dark">Оптимизатор маршрута</h1>
                            <p className="text-gray-500 font-medium">AI подскажет кратчайший путь</p>
                        </div>
                    </div>
                    <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-accent bg-opacity-10 text-accent rounded-full font-bold text-xs uppercase tracking-wider">
                        <Bot className="w-4 h-4" /> AI Active
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Controls Column */}
                    <div className="flex flex-col gap-6">
                        <Card className="p-6">
                            <h3 className="font-bold mb-6 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" /> Путевые точки
                            </h3>

                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-4">
                                    <div className="w-4 h-4 rounded-full border-4 border-primary bg-white shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Старт</p>
                                        <p className="text-sm font-bold text-dark">Ваш адрес: ул. Пушкина, 10</p>
                                    </div>
                                </div>

                                <div className="relative space-y-2">
                                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100 border-dashed border-l-2 -z-0" />
                                    {passengers.map((p, i) => (
                                        <div key={p.id} className="relative z-10 p-4 bg-white rounded-xl border border-gray-100 flex items-center gap-4 shadow-sm group hover:border-primary transition-colors cursor-move">
                                            <GripVertical className="w-5 h-5 text-gray-300" />
                                            <div className="flex-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">Пассажир #{i + 1}</p>
                                                <p className="text-sm font-bold text-dark">{p.name}</p>
                                                <p className="text-[10px] font-medium text-gray-400">{p.address}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 bg-primary bg-opacity-5 rounded-xl border border-primary/20 flex items-center gap-4">
                                    <div className="w-4 h-4 rounded-full bg-primary shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-primary opacity-60 uppercase">ФИНИШ</p>
                                        <p className="text-sm font-bold text-dark">Школа №5</p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="w-full h-14 mt-8 bg-gradient-to-r from-accent to-[#FBBF24] border-none shadow-lg text-lg"
                                onClick={handleOptimize}
                                disabled={isOptimizing}
                            >
                                {isOptimizing ? 'AI Анализирует...' : <><Sparkles className="w-5 h-5 mr-2 fill-current" /> Оптимизировать путь</>}
                            </Button>
                        </Card>

                        <Card className="p-6 bg-dark text-white">
                            <h4 className="font-bold flex items-center gap-2 mb-6">
                                <TrendingUp className="w-5 h-5 text-accent" /> Эффективность
                            </h4>
                            <div className="space-y-6">
                                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                    <div>
                                        <p className="text-[10px] text-white/50 font-bold uppercase mb-1">Время в пути</p>
                                        <p className="text-3xl font-bold">45 мин</p>
                                    </div>
                                    {isDone && <span className="text-secondary font-bold text-xs">-12 мин</span>}
                                </div>
                                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                    <div>
                                        <p className="text-[10px] text-white/50 font-bold uppercase mb-1">Расстояние</p>
                                        <p className="text-3xl font-bold">12.4 км</p>
                                    </div>
                                    {isDone && <span className="text-secondary font-bold text-xs">-1.8 км</span>}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Map Column */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <Card className="flex-1 min-h-[500px] p-0 relative overflow-hidden bg-gray-100 flex items-center justify-center">
                            {isOptimizing && (
                                <div className="absolute inset-0 z-20 bg-dark/20 backdrop-blur-sm flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 bg-accent rounded-full animate-ping opacity-20" />
                                            <Bot className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white drop-shadow-lg" />
                                        </div>
                                        <p className="text-white font-bold text-xl uppercase tracking-widest animate-pulse">Оптимизация...</p>
                                    </div>
                                </div>
                            )}

                            <p className="text-gray-400 font-bold italic select-none">Интерактивный маршрут</p>

                            {/* Mock Routes */}
                            <svg className="absolute inset-0 w-full h-full opacity-30">
                                <path d="M100,200 L300,400 L500,300 L700,500" stroke="#4F46E5" strokeWidth="8" fill="none" strokeDasharray="16" />
                            </svg>
                            {isDone && (
                                <svg className="absolute inset-0 w-full h-full animate-in fade-in duration-1000">
                                    <path d="M100,200 L400,250 L550,450 L700,500" stroke="#10B981" strokeWidth="8" fill="none" className="drop-shadow-lg" />
                                </svg>
                            )}

                            {/* Legend */}
                            <div className="absolute bottom-6 left-6 bg-white p-4 rounded-xl shadow-lg flex gap-6 z-10 border border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-1.5 bg-gray-300 rounded-full" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Обычный</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-1.5 bg-secondary rounded-full" />
                                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Оптимальный</span>
                                </div>
                            </div>

                            {isDone && (
                                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-4 z-30 animate-in slide-in-from-top-4">
                                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Результат AI</p>
                                        <p className="text-dark font-bold text-sm">Маршрут оптимизирован! Вы сэкономите <span className="text-secondary underline underline-offset-4 tracking-tight">1,250 ₸</span> в неделю.</p>
                                    </div>
                                </div>
                            )}
                        </Card>

                        <Card className="p-8 border-2 border-primary/10">
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                                <div className="flex-1 flex gap-6 items-center">
                                    <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                                        <Leaf className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">Экономическая выгода</h4>
                                        <p className="text-sm text-gray-500 font-medium">Этот маршрут позволяет уменьшить выбросы CO₂ на 12.4 кг в месяц.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Button variant="secondary">Сохранить</Button>
                                    <Button variant="primary">Поделиться с попутчиками</Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                </div>
            </main>
        </div>
    );
}
