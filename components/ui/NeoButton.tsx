import React from 'react';

export function NeoButton({
  children,
  className = '',
  type = 'button',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={`neo-btn ${className}`} {...props}>
      {children}
    </button>
  );
}
