import React from 'react';

const Card = ({
    children,
    className = '',
    hover = true,
    padding = 'p-5',
    ...props
}) => {
    return (
        <div
            className={`
        bg-white rounded-card shadow
        transition-shadow duration-200
        ${hover ? 'hover:shadow-md' : ''}
        ${padding}
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
