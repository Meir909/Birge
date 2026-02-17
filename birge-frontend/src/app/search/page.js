"use client";

import React, { useState } from 'react';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import BottomNav from '@/components/layout/BottomNav';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { AIBadge, EfficiencyScore } from '@/components/ai/AIElements';
import {
    Search as SearchIcon,
    Map as MapIcon,
    List,
    Filter,
    Star,
    Clock,
    MapPin,
    Users,
    TrendingUp,
    RotateCcw,
    Sparkles
} from 'lucide-react';

export default function SearchPage() {
    const [view, setView] = useState('list'); // 'map' or 'list'

    const results = [
        {
            id: 1,
            name: 'Иван Петров',
            rating: 4.8,
            school: 'Школа №5',
            class: '3Б',
            time: '08:00',
            dist: '1.2 км',
            seats: '2 из 3',
            isAI: true,
            efficiency: 92
        },
        {
            id: 2,
            name: 'Анна Смирнова',
            rating: 4.9,
            school: 'Школа №5',
            class: '2А',
            time: '08:15',
            dist: '0.8 км',
            seats: '1 из 4',
            isAI: false
        },
    ];

    return (
        <div className="min-h-screen bg-light-gray flex flex-col lg:flex-row">
            <DashboardSidebar />
            <BottomNav />

            {/* Main Content */}
            <main className="flex-1 lg:ml-60 flex flex-col lg:flex-row h-screen overflow-hidden">

                {/* Sidebar Filters */}
                <div className="w-full lg:w-80 bg-white border-r border-gray-100 flex flex-col h-full shrink-0">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="font-bold">Фильтры поиска</h3>
                        <button className="text-gray-400 hover:text-primary transition-colors">
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="p-6 flex-1 overflow-y-auto space-y-8 scrollbar-hide">
                        <Button variant="primary" className="w-full bg-gradient-to-r from-accent to-[#FBBF24] border-none shadow-md py-4 h-auto flex flex-col gap-1 items-center">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 fill-current" />
                                <span className="font-bold">Умный подбор от AI</span>
                            </div>
                            <span className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Найдем лучшие варианты для вас</span>
                        </Button>

                        <div className="space-y-6">
                            <Input label="Школа" placeholder="Найдите вашу школу" icon={SearchIcon} defaultValue="Школа №5" />

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-dark">Дни недели</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
                                        <button key={day} className="w-10 h-10 rounded-button border border-gray-200 text-xs font-bold hover:border-primary hover:text-primary transition-all">
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-dark">Время выезда</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <Input type="time" defaultValue="07:00" />
                                    <Input type="time" defaultValue="09:00" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm font-bold">
                                    <span>Радиус поиска</span>
                                    <span className="text-primary font-bold">3 км</span>
                                </div>
                                <input type="range" className="w-full h-1.5 bg-gray-100 rounded-full accent-primary appearance-none cursor-pointer" min="1" max="10" step="1" />
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-50">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="w-5 h-5 rounded border-2 border-gray-300 group-hover:border-primary transition-colors" />
                                    <span className="text-sm font-medium">Только высокий рейтинг (4.5+)</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="w-5 h-5 rounded border-2 border-gray-300 group-hover:border-primary transition-colors" />
                                    <span className="text-sm font-medium">Верифицированные водители</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-100">
                        <Button variant="primary" className="w-full">Применить фильтры</Button>
                    </div>
                </div>

                {/* Results Area */}
                <div className="flex-1 flex flex-col bg-light-gray overflow-hidden">
                    {/* Top Bar */}
                    <div className="bg-white px-8 h-20 flex items-center justify-between border-b border-gray-100 shrink-0">
                        <div className="flex bg-gray-100 p-1 rounded-button">
                            <button
                                className={`flex items-center gap-2 px-4 py-2 rounded-button text-sm font-bold transition-all ${view === 'map' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-primary'}`}
                                onClick={() => setView('map')}
                            >
                                <MapIcon className="w-4 h-4" /> На карте
                            </button>
                            <button
                                className={`flex items-center gap-2 px-4 py-2 rounded-button text-sm font-bold transition-all ${view === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-primary'}`}
                                onClick={() => setView('list')}
                            >
                                <List className="w-4 h-4" /> Списком
                            </button>
                        </div>

                        <div className="hidden md:flex items-center gap-4">
                            <span className="text-sm text-gray-500 font-medium">Сортировка:</span>
                            <select className="bg-transparent text-sm font-bold text-dark outline-none cursor-pointer border-none p-0 focus:ring-0">
                                <option>По релевантности</option>
                                <option>По времени</option>
                                <option>По рейтингу</option>
                            </select>
                        </div>
                    </div>

                    {/* List/Map View */}
                    <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                        {view === 'list' ? (
                            <div className="max-w-4xl mx-auto space-y-6">
                                {results.map((item) => (
                                    <Card key={item.id} className={`p-0 overflow-hidden border-l-4 ${item.isAI ? 'border-accent' : 'border-primary'}`}>
                                        <div className="p-6 flex flex-col md:flex-row gap-8">
                                            {/* Driver Side */}
                                            <div className="flex flex-col items-center shrink-0 w-32 border-r border-gray-50 pr-8">
                                                <div className="w-16 h-16 rounded-full bg-gray-200 mb-3 relative overflow-hidden">
                                                    <User className="w-full h-full p-2 text-gray-400" />
                                                </div>
                                                <span className="text-sm font-bold text-dark text-center leading-tight mb-2 truncate w-full">{item.name}</span>
                                                <div className="flex items-center gap-1 text-xs font-bold text-accent">
                                                    <Star className="w-3 h-3 fill-current" /> {item.rating}
                                                </div>
                                            </div>

                                            {/* Main Info */}
                                            <div className="flex-1 flex flex-col gap-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="text-lg font-bold mb-1">{item.school}, {item.class} класс</h4>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                                                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {item.time}</span>
                                                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {item.dist} от вас</span>
                                                        </div>
                                                    </div>
                                                    {item.isAI && <AIBadge>Рекомендовано AI</AIBadge>}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {['Пн', 'Ср', 'Пт'].map(day => (
                                                        <span key={day} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold uppercase">{day}</span>
                                                    ))}
                                                </div>

                                                <div className="flex items-center gap-6 pt-4 mt-auto">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Users className="w-4 h-4 text-gray-400" />
                                                        <span className="font-medium text-gray-500">Свободно: <span className="text-primary font-bold">{item.seats}</span></span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <TrendingUp className="w-4 h-4 text-secondary" />
                                                        <span className="font-medium text-gray-500">Экономия: <span className="text-secondary font-bold">150 ₸</span></span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* AI Efficiency Column (Optional if isAI) */}
                                            {item.isAI && (
                                                <div className="w-full md:w-48 bg-accent bg-opacity-5 rounded-xl p-4 flex flex-col gap-3 justify-center">
                                                    <EfficiencyScore score={item.efficiency} />
                                                    <p className="text-[10px] text-accent font-medium leading-tight">
                                                        AI оценил этот маршрут как оптимальный на 92%
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex flex-col gap-3 justify-center">
                                                <Button variant="primary">Подать заявку</Button>
                                                <Button variant="ghost">Подробнее</Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="w-full h-full bg-gray-200 rounded-card flex items-center justify-center relative overflow-hidden">
                                <p className="text-gray-400 font-bold text-xl relative z-10 select-none">Интерактивная карта</p>
                                {/* Mock Markers */}
                                <div className="absolute top-1/4 left-1/3 w-10 h-10 bg-primary rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
                                    <User className="w-5 h-5" />
                                </div>
                                <div className="absolute top-1/2 right-1/4 w-10 h-10 bg-accent rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-all group">
                                    <Star className="w-5 h-5 fill-current" />
                                    <div className="absolute bottom-full mb-2 bg-white text-dark p-2 rounded shadow text-xs font-bold opacity-0 group-hover:opacity-100 whitespace-nowrap">
                                        Рекомендовано AI
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
