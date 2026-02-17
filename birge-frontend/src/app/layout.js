import { Inter } from 'next/font/google';
import './globals.css';
import AIAssistant from '@/components/ai/AIAssistant';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata = {
    title: 'Birge - Школьный Carpooling',
    description: 'Современная платформа для совместных школьных поездок.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="ru">
            <body className={inter.className}>
                {children}
                <AIAssistant />
            </body>
        </html>
    );
}
