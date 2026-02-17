import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Search,
    PlusCircle,
    Car,
    User
} from 'lucide-react';

const BottomNav = () => {
    const pathname = usePathname();

    const items = [
        { name: 'Главная', icon: Home, href: '/dashboard' },
        { name: 'Поиск', icon: Search, href: '/search' },
        { name: 'Создать', icon: PlusCircle, href: '/trip/create', standout: true },
        { name: 'Поездки', icon: Car, href: '/my-trips' },
        { name: 'Профиль', icon: User, href: '/profile' },
    ];

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 flex items-center justify-around px-2 z-50">
            {items.map((item) => {
                const isActive = pathname === item.href;

                if (item.standout) {
                    return (
                        <Link key={item.href} href={item.href} className="relative -top-3">
                            <div className={`
                w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95
                ${isActive ? 'bg-primary text-white' : 'bg-primary text-white'}
              `}>
                                <item.icon className="w-8 h-8" />
                            </div>
                        </Link>
                    );
                }

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="text-[10px] font-medium">{item.name}</span>
                    </Link>
                );
            })}
        </div>
    );
};

export default BottomNav;
