import React from 'react';

const Input = ({
    label,
    error,
    className = '',
    icon: Icon,
    ...props
}) => {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-dark">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <input
                    className={`
            w-full h-11 px-4 py-3 rounded-button border 
            transition-all duration-200 outline-none
            ${Icon ? 'pl-10' : ''}
            ${error
                            ? 'border-error ring-1 ring-error'
                            : 'border-[#E5E7EB] focus:border-primary focus:ring-1 focus:ring-primary focus:shadow-sm'}
          `}
                    {...props}
                />
            </div>
            {error && (
                <span className="text-xs text-error font-medium">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Input;
