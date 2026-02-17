"use client";

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import {
    Users,
    Target,
    Heart,
    Car,
    ShieldCheck,
    Leaf,
    Mail,
    Phone,
    MapPin
} from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-32 pb-24">
                {/* Mission Section */}
                <section className="container-custom mb-32">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-6">
                                <Target className="w-4 h-4" /> Наша Миссия
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-8 leading-tight">
                                Мы делаем школьные поездки <span className="text-primary underline decoration-primary/20">безопаснее и умнее</span>
                            </h1>
                            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                                Birge — это не просто приложение для поездок. Это сообщество ответственных родителей, которые объединяются ради будущего своих детей. Мы создали платформу, которая решает проблемы пробок у школ, экономит время родителей и заботится об экологии.
                            </p>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-3xl font-bold mb-2">3,891</h4>
                                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Счастливых детей</p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-bold mb-2">12.4t</h4>
                                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">CO₂ сэкономлено</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full aspect-video bg-gray-100 rounded-card overflow-hidden shadow-2xl relative">
                            <div className="absolute inset-0 bg-primary opacity-5" />
                            <div className="flex items-center justify-center h-full">
                                <Car className="w-24 h-24 text-gray-300" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="bg-gray-50 py-32 mb-32">
                    <div className="container-custom">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Для кого мы работаем?</h2>
                            <p className="text-gray-500">Birge приносит пользу всем участникам образовательного процесса</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="p-10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center mb-6 shadow-lg">
                                    <Heart className="w-8 h-8" />
                                </div>
                                <h3 className="mb-4">Для родителей</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">Экономия времени на дорогу, снижение расходов на топливо и знакомство с соседями-единомышленниками.</p>
                            </Card>

                            <Card className="p-10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-secondary text-white flex items-center justify-center mb-6 shadow-lg">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                                <h3 className="mb-4">Для школ</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">Уменьшение пробок у ворот школы в утренние и вечерние часы, повышение безопасности пришкольной зоны.</p>
                            </Card>

                            <Card className="p-10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-accent text-white flex items-center justify-center mb-6 shadow-lg">
                                    <Users className="w-8 h-8" />
                                </div>
                                <h3 className="mb-4">Для города</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">Снижение нагрузки на дорожную сеть и улучшение экологической ситуации в жилых районах.</p>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Team Section Placeholder */}
                <section className="container-custom mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Наша Команда</h2>
                        <p className="text-gray-500">Люди, которые стоят за разработкой Birge</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="text-center">
                                <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center text-gray-300">
                                    <Users className="w-12 h-12" />
                                </div>
                                <h4 className="font-bold">Азамат Хайруллин</h4>
                                <p className="text-xs text-primary font-bold uppercase tracking-widest mt-1">Founder & CEO</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact Section */}
                <section className="container-custom">
                    <Card className="p-12 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 hidden lg:block" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                            <div>
                                <h2 className="text-3xl font-bold mb-8">Остались вопросы?</h2>
                                <div className="space-y-8">
                                    <div className="flex gap-6 items-center">
                                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-primary">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</p>
                                            <p className="font-bold text-dark">support@birge.app</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-center">
                                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-primary">
                                            <Phone className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Телефон</p>
                                            <p className="font-bold text-dark">+7 (707) 123-4567</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-center">
                                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-primary">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Офис</p>
                                            <p className="font-bold text-dark">Алматы, Проспект Аль-Фараби, 77/7</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="font-bold">Напишите нам</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input placeholder="Ваше имя" />
                                    <Input placeholder="Email" />
                                </div>
                                <textarea className="w-full h-32 p-4 bg-gray-50 border border-transparent focus:border-primary rounded-xl outline-none text-sm font-medium transition-all" placeholder="Ваше сообщение..." />
                                <Button variant="primary" className="w-full h-14">Отправить сообщение</Button>
                            </div>
                        </div>
                    </Card>
                </section>
            </main>

            <Footer />
        </div>
    );
}
