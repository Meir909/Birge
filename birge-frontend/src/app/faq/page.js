"use client";

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import {
    Search,
    ChevronDown,
    HelpCircle,
    Shield,
    Car,
    Users,
    Sparkles,
    Bot
} from 'lucide-react';

export default function FAQPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [search, setSearch] = useState('');

    const categories = [
        { id: 'general', name: 'Общие вопросы', icon: HelpCircle },
        { id: 'drivers', name: 'Для водителей', icon: Car },
        { id: 'parents', name: 'Для пассажиров', icon: Users },
        { id: 'security', name: 'Безопасность', icon: Shield },
    ];

    const faqs = [
        {
            cat: 'general',
            q: 'Что такое Birge?',
            a: 'Birge — это платформа школьного карпулинга, объединяющая родителей для совместных поездок детей в школу.'
        },
        {
            cat: 'security',
            q: 'Как вы проверяете водителей?',
            a: 'Все водители проходят обязательную верификацию документов (ВУ, документы на авто) и подтверждение личности.'
        },
        {
            cat: 'drivers',
            q: 'Нужно ли мне платить налоги?',
            a: 'Birge не является коммерческим такси. Водители лишь делят расходы на бензин с попутчиками.'
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-32 pb-24">
                {/* Search Header */}
                <section className="bg-primary py-20 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-20 opacity-10">
                        <Sparkles className="w-64 h-64" />
                    </div>
                    <div className="container-custom relative z-10 flex flex-col items-center text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Чем мы можем помочь?</h1>
                        <div className="max-w-2xl w-full relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                            <input
                                className="w-full h-18 pl-16 pr-6 bg-white rounded-2xl text-dark text-lg font-medium outline-none shadow-2xl border-none focus:ring-4 focus:ring-white/20 transition-all py-5"
                                placeholder="Задайте свой вопрос здесь..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <Button className="h-10 text-xs px-4 bg-accent hover:bg-black/90 text-white font-bold tracking-widest uppercase">Поиск AI</Button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="container-custom mt-20">
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Sidebar */}
                        <div className="w-full lg:w-72 shrink-0">
                            <div className="flex flex-col gap-2 sticky top-32">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveTab(cat.id)}
                                        className={`
                          flex items-center gap-4 px-6 py-4 rounded-xl font-bold transition-all
                          ${activeTab === cat.id ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}
                        `}
                                    >
                                        <cat.icon className="w-5 h-5" /> {cat.name}
                                    </button>
                                ))}

                                <div className="mt-8 p-6 bg-accent bg-opacity-5 rounded-2xl border border-accent/10">
                                    <Bot className="w-10 h-10 text-accent mb-4" />
                                    <h4 className="font-bold text-dark text-sm mb-2">Не нашли ответ?</h4>
                                    <p className="text-xs text-gray-500 mb-6">Спросите нашего AI-ассистента прямо сейчас.</p>
                                    <Button className="w-full h-10 text-xs bg-accent hover:bg-accent/90 border-none">Спросить AI</Button>
                                </div>
                            </div>
                        </div>

                        {/* FAQ List */}
                        <div className="flex-1 space-y-4">
                            {faqs.filter(f => search ? f.q.toLowerCase().includes(search.toLowerCase()) : f.cat === activeTab).map((faq, i) => (
                                <Card key={i} className="p-0 overflow-hidden group">
                                    <details className="w-full">
                                        <summary className="flex items-center justify-between p-6 cursor-pointer list-none focus:outline-none">
                                            <h4 className="font-bold text-dark group-hover:text-primary transition-colors">{faq.q}</h4>
                                            <ChevronDown className="w-5 h-5 text-gray-400 group-active:rotate-180 transition-transform" />
                                        </summary>
                                        <div className="px-6 pb-6 pt-2 border-t border-gray-50">
                                            <p className="text-gray-500 font-medium leading-relaxed">{faq.a}</p>
                                        </div>
                                    </details>
                                </Card>
                            ))}

                            {faqs.filter(f => search ? f.q.toLowerCase().includes(search.toLowerCase()) : f.cat === activeTab).length === 0 && (
                                <div className="text-center py-20 text-gray-300 font-bold text-xl uppercase tracking-widest opacity-50">
                                    Ничего не найдено
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
