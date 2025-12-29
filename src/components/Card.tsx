import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ children, className = '', onClick, hoverable = false }: CardProps) {
  const hoverStyles = hoverable ? 'hover:shadow-lg cursor-pointer transition-shadow duration-200' : '';
  
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border border-[var(--color-slate-lighter)] shadow-sm p-6 ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
}
