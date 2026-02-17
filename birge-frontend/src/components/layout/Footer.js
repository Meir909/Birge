import React from 'react';
import Link from 'next/link';
import { Car, Github, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                    {/* Logo & Description */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white">
                                <Car className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold text-dark">Birge</span>
                        </Link>
                        <p className="text-gray-500 max-w-sm mb-6 text-sm leading-relaxed">
                            Современная платформа для совместных школьных поездок. Безопасность, экономия и забота об экологии в одном приложении.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-sm font-bold text-dark uppercase tracking-wider mb-6">Продукт</h4>
                        <ul className="flex flex-col gap-4">
                            <li><Link href="/how-it-works" className="text-gray-500 hover:text-primary text-sm transition-colors">Как это работает</Link></li>
                            <li><Link href="/ai-match" className="text-gray-500 hover:text-primary text-sm transition-colors">AI Подбор</Link></li>
                            <li><Link href="/pricing" className="text-gray-500 hover:text-primary text-sm transition-colors">Безопасность</Link></li>
                            <li><Link href="/schools" className="text-gray-500 hover:text-primary text-sm transition-colors">Для школ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-dark uppercase tracking-wider mb-6">Компания</h4>
                        <ul className="flex flex-col gap-4">
                            <li><Link href="/about" className="text-gray-500 hover:text-primary text-sm transition-colors">О нас</Link></li>
                            <li><Link href="/careers" className="text-gray-500 hover:text-primary text-sm transition-colors">Карьера</Link></li>
                            <li><Link href="/blog" className="text-gray-500 hover:text-primary text-sm transition-colors">Блог</Link></li>
                            <li><Link href="/contacts" className="text-gray-500 hover:text-primary text-sm transition-colors">Контакты</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-dark uppercase tracking-wider mb-6">Поддержка</h4>
                        <ul className="flex flex-col gap-4">
                            <li><Link href="/faq" className="text-gray-500 hover:text-primary text-sm transition-colors">FAQ</Link></li>
                            <li><Link href="/terms" className="text-gray-500 hover:text-primary text-sm transition-colors">Условия использования</Link></li>
                            <li><Link href="/privacy" className="text-gray-500 hover:text-primary text-sm transition-colors">Приватность</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-xs">
                        © 2026 Birge Carpooling Platform. Все права защищены.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="text-gray-400 hover:text-gray-600 text-xs">Privacy Policy</Link>
                        <Link href="/terms" className="text-gray-400 hover:text-gray-600 text-xs">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
