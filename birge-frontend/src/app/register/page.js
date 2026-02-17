"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Phone,
    User,
    MapPin,
    School,
    Car as CarIcon,
    Camera,
    CheckCircle,
    ArrowRight,
    ArrowLeft
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [hasCar, setHasCar] = useState(null); // 'yes' or 'no'

    const steps = [
        { id: 1, name: 'Телефон' },
        { id: 2, name: 'Код' },
        { id: 3, name: 'Профиль' },
        { id: 4, name: 'Авто' },
        { id: 5, name: 'Финиш' },
    ];

    const handleNext = () => setStep((prev) => Math.min(prev + 1, 5));
    const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h3 className="text-2xl font-bold">Номер телефона</h3>
                        <p className="text-gray-500">Мы отправим SMS с кодом подтверждения</p>
                        <Input label="Номер телефона" placeholder="+7 (___) ___-__-__" icon={Phone} />
                        <Button className="w-full h-12" onClick={handleNext}>Получить код</Button>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 text-center">
                        <h3 className="text-2xl font-bold">Введите код</h3>
                        <p className="text-gray-500">Код отправлен на ваш номер</p>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <input key={i} type="text" className="w-12 h-12 text-center text-xl font-bold border border-gray-200 rounded-button outline-none focus:border-primary" maxLength={1} />
                            ))}
                        </div>
                        <Button className="w-full h-12" onClick={handleNext}>Подтвердить</Button>
                        <button className="text-sm text-primary font-bold" onClick={handleBack}>Изменить номер</button>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-2xl font-bold">Основная информация</h3>
                            <span className="text-primary font-bold">3/5</span>
                        </div>

                        <div className="flex flex-col items-center gap-4 mb-8">
                            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 relative cursor-pointer hover:bg-gray-50 transition-colors">
                                <Camera className="w-8 h-8" />
                                <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-lg">
                                    <PlusCircle className="w-4 h-4" />
                                </div>
                            </div>
                            <span className="text-sm font-medium text-gray-500">Загрузить фото профиля</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Имя" placeholder="Иван" />
                            <Input label="Фамилия" placeholder="Петров" />
                        </div>
                        <Input label="Школа ребенка" placeholder="Начните вводить название" icon={School} />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Класс" placeholder="3Б" />
                            <Input label="Район" placeholder="Улица, дом" icon={MapPin} />
                        </div>
                        <Button className="w-full h-12" onClick={handleNext}>Далее</Button>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-2xl font-bold">Ваш автомобиль</h3>
                            <span className="text-primary font-bold">4/5</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <label
                                className={`flex flex-col items-center gap-4 p-6 rounded-card border-2 transition-all cursor-pointer ${hasCar === 'yes' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                                onClick={() => setHasCar('yes')}
                            >
                                <CarIcon className={`w-8 h-8 ${hasCar === 'yes' ? 'text-primary' : 'text-gray-400'}`} />
                                <span className="font-bold text-sm">Есть машина</span>
                            </label>
                            <label
                                className={`flex flex-col items-center gap-4 p-6 rounded-card border-2 transition-all cursor-pointer ${hasCar === 'no' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                                onClick={() => setHasCar('no')}
                            >
                                <User className={`w-8 h-8 ${hasCar === 'no' ? 'text-primary' : 'text-gray-400'}`} />
                                <span className="font-bold text-sm">Нет машины</span>
                            </label>
                        </div>

                        {hasCar === 'yes' && (
                            <div className="space-y-4 pt-4 border-t border-gray-100 animate-in fade-in zoom-in-95">
                                <Input label="Марка / Модель" placeholder="Toyota Camry" />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Гос. номер" placeholder="001 AAA 01" />
                                    <Input label="Мест" placeholder="3" type="number" />
                                </div>
                            </div>
                        )}

                        <Button className="w-full h-12" onClick={handleNext}>Продолжить</Button>
                        <button className="w-full text-gray-400 hover:text-dark font-medium flex items-center justify-center gap-2" onClick={handleBack}>
                            <ArrowLeft className="w-4 h-4" /> Назад
                        </button>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-12 h-12" />
                            </div>
                            <h3 className="text-2xl font-bold">Почти готово!</h3>
                            <p className="text-gray-500">Осталось принять согласия и можно начинать</p>
                        </div>

                        <div className="space-y-4 bg-gray-50 p-6 rounded-card">
                            {[
                                'Я согласен с условиями использования',
                                'Я согласен на обработку персональных данных',
                                'Хочу получать уведомления о новых группах'
                            ].map((text, i) => (
                                <label key={i} className="flex gap-3 cursor-pointer group">
                                    <div className="w-5 h-5 rounded border-2 border-gray-300 group-hover:border-primary flex-shrink-0" />
                                    <span className="text-sm text-dark leading-tight">{text}</span>
                                </label>
                            ))}
                        </div>

                        <Link href="/dashboard">
                            <Button className="w-full h-14 text-lg">Создать аккаунт</Button>
                        </Link>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row">
            {/* Left: Form Column */}
            <div className="flex-1 flex flex-col p-6 lg:p-20 overflow-y-auto">
                <div className="max-w-[480px] w-full mx-auto flex-1 flex flex-col">
                    <Link href="/" className="flex items-center gap-2 mb-12">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                            <CarIcon className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold text-dark tracking-tight">Birge</span>
                    </Link>

                    <div className="mb-12">
                        <h2 className="text-3xl font-bold mb-4">Создайте аккаунт</h2>
                        <p className="text-gray-500">Присоединяйтесь к 1,000+ родителей, которые экономят время.</p>
                    </div>

                    {/* Progress Mini */}
                    <div className="flex gap-2 mb-10">
                        {steps.map((s) => (
                            <div
                                key={s.id}
                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${s.id <= step ? 'bg-primary' : 'bg-gray-100'}`}
                            />
                        ))}
                    </div>

                    <div className="flex-1">
                        {renderStep()}
                    </div>
                </div>
            </div>

            {/* Right: Benefits Column (Desktop only) */}
            <div className="hidden lg:flex flex-1 bg-primary p-20 items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent opacity-10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

                <div className="relative z-10 text-white max-w-lg">
                    <h2 className="text-5xl font-bold mb-12 leading-tight">Поездки в школу <br /> стали проще.</h2>
                    <div className="space-y-8">
                        {[
                            { title: 'Проверенные родители', desc: 'Строгая верификация каждого участника системы.' },
                            { title: 'Безопасные поездки', desc: 'Отслеживание поездок в реальном времени и SOS-кнопка.' },
                            { title: 'Экономия времени', desc: 'AI найдет лучшую группу за считанные секунды.' }
                        ].map((b, i) => (
                            <div key={i} className="flex gap-6 items-start">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                                    <CheckCircle className="w-6 h-6 text-accent" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2">{b.title}</h4>
                                    <p className="text-white/70 leading-relaxed">{b.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 bg-white/10 p-8 rounded-card backdrop-blur-sm border border-white/10">
                        <div className="flex gap-4 items-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white">
                                <Star className="w-6 h-6 fill-current" />
                            </div>
                            <span className="font-bold text-lg">Рекомендация AI</span>
                        </div>
                        <p className="text-white/80 italic leading-relaxed">
                            "Основываясь на вашем местоположении, мы сможем предложить вам более 15 активных групп поблизости."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const PlusCircle = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8M8 12h8" />
    </svg>
);
