import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    icon: Icon,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary text-white hover:bg-opacity-90 shadow-sm rounded-button px-6 py-3',
        secondary: 'border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-button px-6 py-3',
        ghost: 'bg-transparent text-primary hover:bg-primary hover:bg-opacity-10 px-6 py-3',
        icon: 'w-10 h-10 bg-primary text-white hover:bg-opacity-90 rounded-button flex items-center justify-center p-0',
    };

    const sizes = {
        sm: 'text-sm py-2 px-4',
        md: 'text-base',
        lg: 'text-lg py-4 px-8',
    };

    const combinedClasses = `${baseStyles} ${variants[variant]} ${variant !== 'icon' ? sizes[size] : ''} ${className}`;

    return (
        <button className={combinedClasses} {...props}>
            {Icon && <Icon className={`${children ? 'mr-2' : ''} w-5 h-5`} />}
            {children}
        </button>
    );
};

export default Button;
