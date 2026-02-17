import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { AIBadge } from '@/components/ai/AIElements';
import {
    Shield,
    Wallet,
    Leaf,
    User,
    School,
    Star,
    CheckCircle,
    Car
} from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="pt-20">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] py-24 lg:py-32 overflow-hidden">
                    <div className="container-custom relative z-10 flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 text-center lg:text-left">
                            <h1 className="text-white text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Школьный Carpooling <br />
                                <span className="text-accent underline decoration-white/20">нового поколения</span>
                            </h1>
                            <p className="text-white/90 text-xl lg:text-2xl mb-10 max-w-2xl mx-auto lg:mx-0">
                                Безопасные совместные поездки с умным алгоритмом подбора для родителей и их детей.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Button variant="primary" className="bg-white text-primary hover:bg-white/90 px-10 py-4 text-lg">
                                    Начать бесплатно
                                </Button>
                                <Button variant="secondary" className="border-white text-white hover:bg-white/10 px-10 py-4 text-lg">
                                    Посмотреть демо
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 relative hidden lg:block">
                            <div className="w-[500px] h-[400px] bg-white/10 backdrop-blur-md rounded-card border border-white/20 p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="flex flex-col gap-6">
                                    {/* Mock map UI */}
                                    <div className="h-48 bg-gray-200/20 rounded-lg relative overflow-hidden">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary p-2 rounded-full cursor-pointer animate-pulse">
                                            <Car className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-4 w-3/4 bg-white/20 rounded" />
                                        <div className="h-4 w-1/2 bg-white/20 rounded" />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent rounded-full opacity-20 blur-2xl" />
                            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-secondary rounded-full opacity-10 blur-3xl" />
                        </div>
                    </div>
                </section>

                {/* Advantages */}
                <section className="py-24 container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="flex flex-col items-center text-center p-10">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                                <Shield className="w-8 h-8" />
                            </div>
                            <h3 className="mb-4">100% Безопасность</h3>
                            <p className="text-gray-500">Верификация родителей, рейтинги и SOS-кнопка для спокойствия каждого родителя.</p>
                        </Card>

                        <Card className="flex flex-col items-center text-center p-10">
                            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                                <Wallet className="w-8 h-8" />
                            </div>
                            <h3 className="mb-4">Экономия до 60%</h3>
                            <p className="text-gray-500">Делите расходы на бензин и экономьте время, объединяясь с родителями-соседями.</p>
                        </Card>

                        <Card className="flex flex-col items-center text-center p-10">
                            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                                <Leaf className="w-8 h-8" />
                            </div>
                            <h3 className="mb-4">Забота об экологии</h3>
                            <p className="text-gray-500">Меньше машин в школьной зоне — чище воздух для наших детей и меньше пробок.</p>
                        </Card>
                    </div>
                </section>

                {/* AI Helper block */}
                <section className="bg-gradient-to-r from-accent/10 to-[#FBBF24]/5 py-24">
                    <div className="container-custom flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1">
                            <AIBadge className="mb-6">Powered by Gemini AI</AIBadge>
                            <h2 className="text-4xl font-bold mb-6">Умный алгоритм подбора</h2>
                            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                                Наш AI автоматически анализирует маршруты, школьное расписание и местоположение родителей, чтобы предложить вам идеальную группу. Вам больше не нужно искать — AI найдет за вас.
                            </p>
                            <ul className="space-y-4">
                                {['Оптимизация маршрутов в реальном времени', 'Учет временных окон каждого ребенка', 'Адаптация под пробки и задержки'].map((text) => (
                                    <li key={text} className="flex items-center gap-3 font-medium">
                                        <CheckCircle className="w-5 h-5 text-accent" />
                                        <span>{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1 w-full max-w-lg">
                            <Card className="border-2 border-accent/20 bg-white/50 backdrop-blur-sm p-8 shadow-2xl relative">
                                <div className="absolute -top-4 -right-4">
                                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                                        <Star className="w-6 h-6 fill-current" />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gray-200" />
                                        <div>
                                            <div className="h-3 w-32 bg-gray-200 rounded mb-2" />
                                            <div className="h-2 w-20 bg-gray-100 rounded" />
                                        </div>
                                    </div>
                                    <div className="bg-accent/5 p-4 rounded-lg italic text-dark/80 text-sm">
                                        "AI подобрал для вас Олега и Марию. Сегодня ваш путь займет на 5 минут меньше!"
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section className="py-24 container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Как это работает</h2>
                        <p className="text-gray-500">Всего 4 шага до первой поездки</p>
                    </div>

                    <div className="relative flex flex-col md:flex-row justify-between gap-8">
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -translate-y-1/2 z-0" />

                        {[
                            { id: 1, name: 'Регистрация', icon: User, desc: 'Создайте аккаунт и верифицируйте данные' },
                            { id: 2, name: 'Укажите школу', icon: School, desc: 'Выберите школу вашего ребенка' },
                            { id: 3, name: 'AI подберет группу', icon: Star, desc: 'Алгоритм найдет попутчиков' },
                            { id: 4, name: 'Начните экономить', icon: CheckCircle, desc: 'Договоритесь и выезжайте' },
                        ].map((step) => (
                            <div key={step.id} className="relative z-10 flex-1 flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-white border-2 border-primary flex items-center justify-center text-primary font-bold text-xl mb-6 shadow-sm">
                                    <step.icon className="w-8 h-8" />
                                </div>
                                <h4 className="mb-2">{step.name}</h4>
                                <p className="text-sm text-gray-500 max-w-[200px]">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Stats */}
                <section className="py-24 bg-primary">
                    <div className="container-custom grid grid-cols-2 lg:grid-cols-4 gap-12 text-center text-white">
                        <div>
                            <div className="text-4xl font-bold mb-2">1,247</div>
                            <div className="text-white/70">Родителей</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">89</div>
                            <div className="text-white/70">Школ</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">3,891</div>
                            <div className="text-white/70">Поездок</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">12,450 кг</div>
                            <div className="text-white/70">CO₂ сэкономлено</div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
