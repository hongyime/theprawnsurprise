import React from 'react';

export function NeoCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`neo-card ${className}`}>{children}</div>;
}
