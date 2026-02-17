"use client";

import React, { useState, useEffect } from 'react';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import BottomNav from '@/components/layout/BottomNav';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { AIBadge, EfficiencyScore } from '@/components/ai/AIElements';
import {
    Sparkles,
    Settings,
    Search,
    Map as MapIcon,
    CheckCircle,
    Clock,
    TrendingUp,
    Leaf,
    User,
    Star,
    ChevronDown,
    Info
} from 'lucide-react';

export default function AIMatchPage() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentStage, setCurrentStage] = useState(0);
    const [results, setResults] = useState(null);

    const stages = [
        { name: 'Поиск доступных групп', desc: 'Найдено: 23 группы' },
        { name: 'Расчет расстояний', desc: 'Формула: Haversine distance' },
        { name: 'Кластеризация', desc: 'K-means алгоритм' },
        { name: 'Оптимизация маршрутов', desc: 'Greedy heuristic' },
    ];

    const startAnalysis = () => {
        setIsAnalyzing(true);
        setProgress(0);
        setCurrentStage(0);
        setResults(null);

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsAnalyzing(false);
                    setResults(mockResults);
                    return 100;
                }
                const next = prev + 1;
                if (next % 25 === 0) setCurrentStage((s) => s + 1);
                return next;
            });
        }, 40);
    };

    const mockResults = [
        {
            id: 1,
            name: 'Иван Петров',
            match: 95,
            school: 'Школа №5',
            class: '3Б',
            time: '08:00',
            reasons: [
                'Водитель живет в 300 метрах от вас',
                'Отклонение маршрута всего 2 минуты',
                'Высокий рейтинг безопасности (4.9)'
            ],
            metrics: { time: '+2 мин', dist: '500 м', save: '150 ₸', eco: '2.3 кг' }
        },
        { id: 2, name: 'Анна С.', match: 88, school: 'Школа №5', class: '3Б', time: '08:15', reasons: ['Удобное время'], metrics: { time: '+5 мин', dist: '1.2 км', save: '120 ₸', eco: '1.8 кг' } },
    ];

    return (
        <div className="min-h-screen bg-light-gray flex flex-col lg:flex-row">
            <DashboardSidebar />
            <BottomNav />

            <main className="flex-1 lg:ml-60 p-4 lg:p-8 space-y-8 pb-32">
                <header>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Sparkles className="w-6 h-6 fill-current" />
                        </div>
                        <h1 className="text-3xl font-bold font-inter text-dark">Умный подбор группы</h1>
                    </div>
                    <p className="text-gray-500 font-medium">AI найдет идеальных попутчиков за секунды</p>
                </header>

                {/* Preferences Section */}
                <Card className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h3 className="font-bold border-b border-gray-100 pb-4">Ваши предпочтения</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Школа</label>
                                    <Input placeholder="Школа №5" disabled />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Класс</label>
                                    <select className="w-full h-11 px-4 py-3 rounded-button border border-[#E5E7EB] outline-none text-sm font-medium">
                                        <option>3Б</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Радиус поиска</label>
                                <div className="flex justify-between items-center text-sm font-bold">
                                    <span className="text-primary tracking-tight">3 км</span>
                                </div>
                                <input type="range" className="w-full h-1.5 bg-gray-100 rounded-full accent-primary appearance-none cursor-pointer" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="font-bold border-b border-gray-100 pb-4">Приоритеты AI</h3>
                            {[
                                { name: 'Минимальное время в пути', val: 40 },
                                { name: 'Минимальное отклонение', val: 30 },
                                { name: 'Максимальная безопасность', val: 30 },
                            ].map((p) => (
                                <div key={p.name} className="space-y-3">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-dark/70">
                                        <span>{p.name}</span>
                                        <span>{p.val}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: `${p.val}%` }} />
                                    </div>
                                </div>
                            ))}
                            <div className="bg-primary bg-opacity-5 p-3 rounded-lg flex gap-3 items-center">
                                <Info className="w-4 h-4 text-primary" />
                                <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Сумма должна быть 100%</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-center">
                        <Button
                            className="w-full lg:w-96 h-14 text-lg bg-gradient-to-r from-primary to-[#7C3AED] shadow-xl hover:scale-105 active:scale-95 transition-all"
                            onClick={startAnalysis}
                            disabled={isAnalyzing}
                        >
                            {isAnalyzing ? `Анализирую (${progress}%)` : '🚀 Запустить AI-подбор'}
                        </Button>
                    </div>
                </Card>

                {/* Process Visualization */}
                {isAnalyzing && (
                    <Card className="p-8 animate-in fade-in zoom-in-95">
                        <div className="flex flex-col lg:flex-row gap-12 items-center">
                            <div className="flex-1 w-full space-y-8">
                                {stages.map((s, i) => (
                                    <div key={s.name} className="flex gap-6 items-center">
                                        <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-all duration-500
                      ${i < currentStage ? 'bg-secondary text-white' : i === currentStage ? 'bg-primary text-white scale-125 ring-8 ring-primary/10' : 'bg-gray-100 text-gray-300'}
                    `}>
                                            {i < currentStage ? <CheckCircle className="w-6 h-6" /> : i + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`font-bold transition-colors ${i <= currentStage ? 'text-dark' : 'text-gray-300'}`}>{s.name}</h4>
                                            <p className={`text-xs transition-colors ${i <= currentStage ? 'text-gray-500' : 'text-gray-200'}`}>{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex-1 w-full relative aspect-square max-w-[400px] bg-gray-50 rounded-card border-2 border-gray-100 flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                <p className="text-gray-400 font-bold italic select-none">Визуализация алгоритма</p>
                                <div className={`absolute w-full h-full p-10 transition-opacity duration-1000 ${currentStage >= 1 ? 'opacity-100' : 'opacity-10'}`}>
                                    {[1, 2, 3, 4, 5, 6].map(j => (
                                        <div key={j} className="absolute w-4 h-4 rounded-full bg-primary/20" style={{ top: `${Math.random() * 80}%`, left: `${Math.random() * 80}%` }} />
                                    ))}
                                    {currentStage >= 2 && <div className="absolute inset-0 flex items-center justify-center"><div className="w-1/2 h-1/2 border-2 border-primary/20 rounded-full animate-ping" /></div>}
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Results */}
                {results && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
                        <h3 className="text-2xl font-bold flex items-center gap-2"> Топ вариантов <Star className="w-5 h-5 fill-current text-accent" /></h3>
                        <div className="grid grid-cols-1 gap-6">
                            {results.map((res, idx) => (
                                <Card key={res.id} className="p-0 overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all">
                                    <div className="flex flex-col lg:flex-row">
                                        {/* Header Info */}
                                        <div className="lg:w-80 bg-gray-50 p-8 border-r border-gray-100 flex flex-col items-center justify-center">
                                            <div className="text-[10px] font-bold text-accent uppercase tracking-widest mb-4">#{idx + 1} Лучший вариант</div>
                                            <div className="text-5xl font-bold text-primary mb-2">{res.match}%</div>
                                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Совместимость</div>
                                            <EfficiencyScore score={res.match} showLabel={false} className="w-full mt-6" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 p-8 flex flex-col md:flex-row gap-12">
                                            <div className="flex-1 space-y-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <User className="w-8 h-8 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-bold">{res.name}</h4>
                                                        <div className="text-sm font-bold text-accent flex items-center gap-1">⭐ 4.9 (45)</div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-500">
                                                    <span className="flex items-center gap-2"><School className="w-4 h-4" /> {res.school}</span>
                                                    <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {res.time}</span>
                                                </div>

                                                <div className="bg-accent bg-opacity-5 p-6 rounded-card border border-accent/10">
                                                    <h5 className="text-xs font-bold text-accent uppercase tracking-widest mb-4">Почему это отличный выбор:</h5>
                                                    <ul className="space-y-3">
                                                        {res.reasons.map(reason => (
                                                            <li key={reason} className="flex gap-2 text-sm font-medium text-dark leading-snug">
                                                                <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" /> {reason}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="w-full md:w-64 space-y-6 flex flex-col justify-between">
                                                <div className="grid grid-cols-2 gap-4">
                                                    {[
                                                        { icon: Clock, val: res.metrics.time, label: 'Время' },
                                                        { icon: MapIcon, val: res.metrics.dist, label: 'Отклон' },
                                                        { icon: TrendingUp, val: res.metrics.save, label: 'Эко-я' },
                                                        { icon: Leaf, val: res.metrics.eco, label: 'CO₂' },
                                                    ].map(m => (
                                                        <div key={m.label} className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
                                                            <m.icon className="w-4 h-4 text-gray-400 mb-1" />
                                                            <span className="text-xs font-bold text-dark">{m.val}</span>
                                                            <span className="text-[10px] text-gray-400 font-bold uppercase">{m.label}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex flex-col gap-3">
                                                    <Button className="w-full">Подать заявку</Button>
                                                    <Button variant="ghost" className="w-full">Детали</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="bg-dark p-8 rounded-card text-white flex flex-col lg:flex-row items-center justify-between gap-8">
                            <div className="flex-1">
                                <h4 className="text-2xl font-bold mb-2">Не нашли подходящий вариант?</h4>
                                <p className="text-white/60">AI может автоматически сформировать группу из лучших кандидатов специально для вас.</p>
                            </div>
                            <Button variant="primary" className="bg-accent hover:bg-accent/90 border-none shadow-lg h-14 px-10">
                                ✨ Создать оптимальную группу
                            </Button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
