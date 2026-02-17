"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, ArrowLeft, Car } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(59);

    useEffect(() => {
        let interval;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-light-gray flex items-center justify-center p-4">
            <Card className="max-w-[400px] w-full p-8">
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                            <Car className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold text-dark tracking-tight">Birge</span>
                    </Link>
                    <h2 className="text-2xl font-bold mb-2">Добро пожаловать</h2>
                    <p className="text-gray-500 text-center">
                        {step === 1 ? 'Войдите, чтобы продолжить' : `Код отправлен на ${phone}`}
                    </p>
                </div>

                {step === 1 ? (
                    <div className="space-y-6">
                        <Input
                            label="Номер телефона"
                            placeholder="+7 (___) ___-__-__"
                            icon={Phone}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <Button
                            className="w-full"
                            onClick={() => setStep(2)}
                            disabled={!phone}
                        >
                            Получить код
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="flex justify-between gap-2">
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    id={`otp-${idx}`}
                                    type="text"
                                    maxLength={1}
                                    className="w-12 h-12 text-center text-xl font-bold border border-gray-200 rounded-button focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Backspace' && !digit && idx > 0) {
                                            document.getElementById(`otp-${idx - 1}`)?.focus();
                                        }
                                    }}
                                />
                            ))}
                        </div>

                        <div className="text-center">
                            {timer > 0 ? (
                                <p className="text-sm text-gray-500">
                                    Отправить повторно через <span className="text-primary font-medium">{formatTime(timer)}</span>
                                </p>
                            ) : (
                                <button className="text-sm text-primary font-bold hover:underline" onClick={() => setTimer(59)}>
                                    Отправить код повторно
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <Button className="w-full">Подтвердить</Button>
                            <button
                                className="w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-dark transition-colors"
                                onClick={() => setStep(1)}
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Изменить номер
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-500">
                        Еще нет аккаунта?{' '}
                        <Link href="/register" className="text-primary font-bold hover:underline">
                            Зарегистрироваться
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
}
