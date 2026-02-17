"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    PlusSquare,
    MapPin,
    Clock,
    Car,
    Calendar,
    Sparkles,
    ChevronRight,
    ChevronLeft,
    X,
    CheckCircle,
    Lightbulb,
    Leaf,
    Navigation,
    School
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function CreateTripPage() {
    const [step, setStep] = useState(1);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);

    const steps = [
        { id: 1, name: 'Основное' },
        { id: 2, name: 'Маршрут' },
        { id: 3, name: 'Условия' },
    ];

    const handleNext = () => step < 3 ? setStep(step + 1) : setShowSuccess(true);
    const handleBack = () => step > 1 && setStep(step - 1);

    const runOptimization = () => {
        setIsOptimizing(true);
        setTimeout(() => setIsOptimizing(false), 2000);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-accent bg-opacity-10 p-4 rounded-card border border-accent/20 flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white shrink-0">
                                <Lightbulb className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-dark text-sm mb-1">Совет от AI</h4>
                                <p className="text-xs text-dark/70 leading-relaxed">
                                    Основываясь на данных о пробках в вашем районе, идеальное время выезда для школы №5 — <span className="font-bold">07:45</span>.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Школа" defaultValue="Школа №5" icon={School} disabled />
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-dark">Класс ребенка</label>
                                <select className="w-full h-11 px-4 py-3 rounded-button border border-[#E5E7EB] outline-none focus:border-primary text-sm font-medium">
                                    <option>3Б</option>
                                    <option>2А</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-dark">Дни недели</label>
                            <div className="flex gap-2">
                                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт'].map((day) => (
                                    <button key={day} className={`w-12 h-12 rounded-full border-2 transition-all font-bold text-sm ${['Пн', 'Ср', 'Пт'].includes(day) ? 'bg-primary border-primary text-white' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}>
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-medium text-dark">Тип поездки</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['Только утром', 'Только вечером', 'Туда и обратно'].map((type, i) => (
                                    <label key={i} className={`flex items-center justify-center p-4 rounded-card border-2 transition-all cursor-pointer font-bold text-sm ${i === 0 ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}>
                                        {type}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <Input label="Время выезда" type="time" defaultValue="07:45" icon={Clock} />
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-dark">Свободных мест</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4].map(n => (
                                        <button key={n} className={`flex-1 h-11 rounded-button border-2 transition-all font-bold ${n === 3 ? 'border-primary text-primary bg-primary/5' : 'border-gray-100 text-gray-400'}`}>
                                            {n}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold flex items-center gap-2">
                                <Navigation className="w-5 h-5 text-primary" /> Маршрут на карте
                            </h4>
                            <button
                                className={`text-sm font-bold flex items-center gap-2 transition-colors ${isOptimizing ? 'text-accent' : 'text-primary hover:text-accent'}`}
                                onClick={runOptimization}
                            >
                                <Sparkles className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
                                {isOptimizing ? 'AI Оптимизирует...' : 'Получить рекомендации AI'}
                            </button>
                        </div>

                        <div className="h-80 bg-gray-100 rounded-card border-2 border-gray-100 relative overflow-hidden flex items-center justify-center">
                            <p className="text-gray-400 font-bold select-none italic">Интерактивная карта маршрута</p>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-0.5 bg-primary/20">
                                <div className="w-1/2 h-full bg-primary relative">
                                    <div className="absolute -left-2 -top-1.5 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-sm" />
                                    <div className="absolute left-1/2 -left-2 -top-1.5 w-4 h-4 bg-secondary rounded-full border-2 border-white shadow-sm" />
                                    <div className="absolute -right-2 -top-1.5 w-4 h-4 bg-error rounded-full border-2 border-white shadow-sm" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Input label="Точка отправления" defaultValue="ул. Ленина, 15" icon={MapPin} />
                            <div className="flex flex-col gap-3">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Точки посадки (опционально)</p>
                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-card border border-dashed border-gray-200">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                                    <div className="flex-1 text-sm font-medium text-gray-400 italic">Нажмите, чтобы добавить точку на карте</div>
                                    <PlusSquare className="w-5 h-5 text-gray-300" />
                                </div>
                            </div>
                        </div>

                        {!isOptimizing && (
                            <div className="bg-secondary bg-opacity-5 p-4 rounded-card border border-secondary/20 animate-in zoom-in-95">
                                <div className="flex gap-4 items-center">
                                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white shrink-0">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-dark text-sm mb-1">Маршрут оптимизирован</h4>
                                        <p className="text-xs text-dark/70 leading-relaxed">
                                            AI перестроил остановки. Экономия времени: <span className="font-bold text-secondary">7 минут</span>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-dark">Описание поездки (опционально)</label>
                            <textarea
                                className="w-full h-32 px-4 py-3 rounded-button border border-[#E5E7EB] outline-none focus:border-primary text-sm font-medium resize-none"
                                placeholder="Например: Еду очень аккуратно, в машине есть детское кресло."
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-medium text-dark">Предпочтения</label>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="w-5 h-5 rounded border-2 border-primary bg-primary flex items-center justify-center text-white">
                                        <CheckCircle className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium">Только родители из моего класса</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="w-5 h-5 rounded border-2 border-gray-300 group-hover:border-primary transition-colors" />
                                    <span className="text-sm font-medium">Автоматически принимать заявки (Beta)</span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-medium text-dark">Стоимость</label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="flex flex-col items-center gap-2 p-6 rounded-card border-2 border-primary bg-primary/5 cursor-pointer">
                                    <Leaf className="w-6 h-6 text-secondary" />
                                    <span className="font-bold text-xs text-center leading-tight">БЕСПЛАТНО<br /><span className="text-[10px] font-medium text-gray-400">делим расходы на бензин</span></span>
                                </label>
                                <label className="flex flex-col items-center gap-2 p-6 rounded-card border-2 border-gray-100 hover:border-gray-200 cursor-pointer">
                                    <div className="font-bold text-lg text-dark">₸</div>
                                    <span className="font-bold text-xs text-center leading-tight">ФИКСИРОВАННАЯ<br /><span className="text-[10px] font-medium text-gray-400">укажите сумму за поездку</span></span>
                                </label>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-primary to-[#7C3AED] p-6 rounded-card text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Leaf className="w-24 h-24" />
                            </div>
                            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 fill-current text-accent" /> AI Инсайт
                            </h4>
                            <p className="text-sm text-white/80 mb-6">Создавая эту поездку, вы вносите огромный вклад:</p>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                    <div className="text-xl font-bold">~15 кг</div>
                                    <div className="text-[10px] opacity-60 uppercase font-bold">CO₂</div>
                                </div>
                                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                    <div className="text-xl font-bold">~2</div>
                                    <div className="text-[10px] opacity-60 uppercase font-bold">Машины</div>
                                </div>
                                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                    <div className="text-xl font-bold">~500 ₸</div>
                                    <div className="text-[10px] opacity-60 uppercase font-bold">Экономии</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-light-gray flex flex-col">
            <header className="fixed top-0 left-0 right-0 h-20 bg-white border-b border-gray-100 z-50 flex items-center">
                <div className="container-custom flex justify-between items-center">
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all">
                            <ChevronLeft className="w-6 h-6" />
                        </div>
                        <span className="font-bold hidden sm:block">Вернуться в дашборд</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                            <PlusSquare className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold">Создание поездки</h2>
                    </div>
                    <div className="w-10 h-10 lg:w-40" /> {/* Spacer */}
                </div>
            </header>

            <main className="flex-1 pt-32 pb-20 container-custom">
                <div className="max-w-[800px] mx-auto">
                    {/* Progress Steps */}
                    <div className="flex justify-between items-start mb-12 relative">
                        <div className="absolute top-5 left-8 right-8 h-0.5 bg-gray-100 -z-0" />
                        {steps.map((s) => (
                            <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                                <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all duration-300 font-bold ${s.id === step ? 'bg-primary border-primary/20 text-white' : s.id < step ? 'bg-white border-primary text-primary' : 'bg-white border-gray-100 text-gray-300'}`}>
                                    {s.id < step ? <CheckCircle className="w-5 h-5" /> : s.id}
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-wider ${s.id === step ? 'text-primary' : 'text-gray-400'}`}>
                                    {s.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    <Card className="p-8 md:p-12 mb-8">
                        {renderStep()}
                    </Card>

                    <div className="flex justify-between items-center">
                        {step > 1 ? (
                            <button
                                className="flex items-center gap-2 text-gray-400 font-bold hover:text-dark transition-colors"
                                onClick={handleBack}
                            >
                                <ChevronLeft className="w-5 h-5" /> Назад
                            </button>
                        ) : <div />}

                        <Button className="px-10 h-14 text-lg min-w-[200px]" onClick={handleNext}>
                            {step === 3 ? 'Создать поездку' : s => <>Далее <ChevronRight className="w-5 h-5 ml-2" /></>}
                            {step < 3 && <div className="flex items-center gap-2">Далее <ChevronRight className="w-5 h-5" /></div>}
                        </Button>
                    </div>
                </div>
            </main>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <Card className="max-w-md w-full p-10 text-center animate-in zoom-in-95 fade-in">
                        <div className="w-24 h-24 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                            <CheckCircle className="w-12 h-12" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Поездка создана!</h2>
                        <p className="text-gray-500 mb-10 leading-relaxed">
                            Мы уведомим вас, когда появятся подходящие попутчики. Ваш маршрут уже в базе AI-подбора.
                        </p>
                        <div className="flex flex-col gap-4">
                            <Link href="/dashboard">
                                <Button className="w-full h-14">Перейти к поездке</Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button variant="ghost" className="w-full">Вернуться на главную</Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
