"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
    Bot,
    X,
    Send,
    Minus,
    MapPin,
    Calendar,
    Settings,
    Search,
    PlusSquare,
    HelpCircle,
    MessageCircle,
    Star,
    ChevronRight
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, type: 'ai', text: 'Привет! Я ваш AI-помощник 👋' },
        { id: 2, type: 'ai', text: 'Я помогу вам найти идеальную поездку или ответить на вопросы.' },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        setMessages([...messages, { id: Date.now(), type: 'user', text: input }]);
        setInput('');
        setIsTyping(true);

        // Mock AI Response
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now(),
                type: 'ai',
                text: 'Анализирую ваши данные... Я нашел несколько подходящих вариантов. Показать подробности?'
            }]);
        }, 1500);
    };

    if (!isOpen) {
        return (
            <button
                className="fixed bottom-20 lg:bottom-8 right-8 z-50 w-16 h-16 bg-accent text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group overflow-hidden"
                onClick={() => setIsOpen(true)}
            >
                <div className="absolute inset-0 bg-white/20 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                <Bot className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-[10px] flex items-center justify-center rounded-full font-bold border-2 border-white">
                    1
                </div>
            </button>
        );
    }

    return (
        <div className={`
      fixed bottom-0 right-0 lg:bottom-24 lg:right-8 z-50 
      w-full lg:w-[400px] h-full lg:h-[600px] 
      bg-white shadow-2xl flex flex-col transition-all duration-300
      ${isMinimized ? 'h-16 overflow-hidden' : 'rounded-t-2xl lg:rounded-2xl'}
    `}>
            {/* Header */}
            <div className="h-16 bg-gradient-to-r from-accent to-[#FBBF24] px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 text-white">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">AI-помощник Birge</h3>
                        <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Powered by Gemini</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-white">
                    <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-white/10 rounded transition-colors">
                        <Minus className="w-5 h-5" />
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            {!isMinimized && (
                <>
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth scrollbar-hide">
                        {messages.map((m) => (
                            <div key={m.id} className={`flex ${m.type === 'ai' ? 'justify-start' : 'justify-end'}`}>
                                <div className={`
                  max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed
                  ${m.type === 'ai'
                                        ? 'bg-accent/10 text-dark rounded-tl-none border border-accent/10'
                                        : 'bg-primary text-white rounded-tr-none shadow-md'}
                `}>
                                    {m.text}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-accent/5 p-4 rounded-2xl rounded-tl-none flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" />
                                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        )}

                        {/* Quick Actions (Welcome Screen style) */}
                        {messages.length < 4 && !isTyping && (
                            <div className="grid grid-cols-2 gap-2 mt-4 animate-in fade-in zoom-in-95">
                                {[
                                    { name: 'Найти поездку', icon: Search },
                                    { name: 'Создать поездку', icon: PlusSquare },
                                    { name: 'Частые вопросы', icon: HelpCircle },
                                    { name: 'Задать вопрос', icon: MessageCircle },
                                ].map((act) => (
                                    <button key={act.name} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-accent hover:bg-accent/5 transition-all text-xs font-bold text-dark">
                                        <act.icon className="w-5 h-5 text-accent" />
                                        {act.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Special AI Message: Recommendation */}
                        {!isTyping && messages.length > 2 && (
                            <div className="animate-in slide-in-from-bottom-4">
                                <Card className="p-4 border border-accent/20 bg-accent bg-opacity-5">
                                    <div className="flex gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-primary shadow-sm">
                                            ИП
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs font-bold text-dark">Иван Петров</div>
                                            <div className="flex items-center gap-1 text-[10px] text-accent font-bold">
                                                <Star className="w-2.5 h-2.5 fill-current" /> 4.9 (45 отзывов)
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full h-fit">
                                            95% Match
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="text-xs font-medium text-gray-500">Школа №5 • 08:00</div>
                                        <button className="text-xs font-bold text-accent flex items-center">
                                            Подробнее <ChevronRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <Button className="w-full text-xs h-10">Подать заявку</Button>
                                </Card>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                        <div className="flex gap-2 mb-3 px-2">
                            <button className="p-1.5 text-gray-400 hover:text-accent transition-colors"><MapPin className="w-4 h-4" /></button>
                            <button className="p-1.5 text-gray-400 hover:text-accent transition-colors"><Calendar className="w-4 h-4" /></button>
                            <button className="p-1.5 text-gray-400 hover:text-accent transition-colors ml-auto"><Settings className="w-4 h-4" /></button>
                        </div>
                        <div className="relative">
                            <textarea
                                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-accent focus:bg-white text-sm font-medium resize-none max-h-32 transition-all"
                                placeholder="Спросите меня о чем-нибудь..."
                                rows={1}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                            />
                            <button
                                className={`absolute right-2 bottom-2 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${input.trim() ? 'bg-accent text-white shadow-lg' : 'bg-gray-200 text-gray-400'}`}
                                onClick={handleSend}
                                disabled={!input.trim()}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AIAssistant;
