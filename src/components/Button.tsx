import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  fullWidth = false
}: ButtonProps) {
  const baseStyles = 'rounded-md transition-all duration-200 cursor-pointer border';
  
  const variantStyles = {
    primary: 'bg-[var(--color-ink-blue)] text-white border-[var(--color-ink-blue)] hover:bg-[var(--color-ink-blue-dark)] disabled:bg-[var(--color-slate-lighter)] disabled:border-[var(--color-slate-lighter)] disabled:cursor-not-allowed',
    secondary: 'bg-white text-[var(--color-ink-blue)] border-[var(--color-ink-blue)] hover:bg-[var(--color-bg)] disabled:opacity-50 disabled:cursor-not-allowed',
    outline: 'bg-transparent text-[var(--color-slate)] border-[var(--color-slate-lighter)] hover:bg-[var(--color-bg)] disabled:opacity-50 disabled:cursor-not-allowed',
    danger: 'bg-red-600 text-white border-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed'
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const widthStyle = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle}`}
    >
      {children}
    </button>
  );
}
