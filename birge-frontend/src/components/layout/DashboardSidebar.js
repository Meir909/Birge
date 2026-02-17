import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Search,
    PlusSquare,
    Car,
    BarChart2,
    User,
    Settings,
    LogOut,
    Car as CarIcon
} from 'lucide-react';

const DashboardSidebar = ({ user = { name: 'Иван Петров', role: 'Водитель', avatar: null } }) => {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Главная', icon: Home, href: '/dashboard' },
        { name: 'Поиск поездки', icon: Search, href: '/search' },
        { name: 'Создать поездку', icon: PlusSquare, href: '/trip/create', driverOnly: true },
        { name: 'Мои поездки', icon: Car, href: '/my-trips' },
        { name: 'Аналитика', icon: BarChart2, href: '/analytics' },
        { name: 'Профиль', icon: User, href: '/profile' },
        { name: 'Настройки', icon: Settings, href: '/settings' },
    ];

    return (
        <div className="hidden lg:flex flex-col w-60 h-screen fixed left-0 top-0 bg-white border-r border-gray-100 p-6">
            {/* Brand & User */}
            <div className="flex flex-col gap-6 mb-10">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white">
                        <CarIcon className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold text-dark tracking-tight">Birge</span>
                </Link>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-card">
                    <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center text-primary font-bold overflow-hidden">
                        {user.avatar ? <img src={user.avatar} alt="" /> : user.name[0]}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-dark truncate w-24">{user.name}</span>
                        <span className="text-[10px] font-medium bg-primary bg-opacity-10 text-primary px-1.5 py-0.5 rounded-full w-fit uppercase tracking-wider">
                            {user.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* Nav List */}
            <nav className="flex-1 flex flex-col gap-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-3 py-3 rounded-button transition-all duration-200
                ${isActive
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-primary'}
              `}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <button className="flex items-center gap-3 px-3 py-3 text-error hover:bg-error hover:bg-opacity-10 rounded-button transition-all duration-200 mt-auto">
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Выйти</span>
            </button>
        </div>
    );
};

export default DashboardSidebar;
