import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

export default function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants: Record<Variant, string> = {
    primary: 'bg-blue-800 text-white hover:bg-blue-900 focus:ring-blue-800 shadow-md shadow-blue-900/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-900/30',
    secondary:
      'bg-white text-slate-800 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 focus:ring-slate-300 shadow-sm hover:shadow-md hover:-translate-y-0.5',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-200 shadow-none',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md hover:-translate-y-0.5',
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

