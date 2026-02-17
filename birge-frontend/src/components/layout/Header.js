import React, { useState } from 'react';
import Link from 'next/link';
import { Car, Menu, X } from 'lucide-react';
import Button from '../ui/Button';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: 'О проекте', href: '/about' },
        { name: 'Как работает', href: '/how-it-works' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Контакты', href: '/contacts' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
            <div className="container-custom h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                        <Car className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold text-dark tracking-tight">Birge</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-dark hover:text-primary font-medium transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Auth Buttons */}
                <div className="hidden lg:flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost">Войти</Button>
                    </Link>
                    <Link href="/register">
                        <Button variant="primary">Начать</Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden p-2 text-dark"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-20 left-0 right-0 bg-white border-t border-gray-100 shadow-xl px-4 py-8 flex flex-col gap-6 animate-in fade-in slide-in-from-top-4">
                    <nav className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-lg font-medium text-dark py-2 border-b border-gray-50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="flex flex-col gap-4">
                        <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                            <Button variant="ghost" className="w-full">Войти</Button>
                        </Link>
                        <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                            <Button variant="primary" className="w-full">Начать</Button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
