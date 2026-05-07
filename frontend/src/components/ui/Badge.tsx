export default function Badge({
  tone = 'slate',
  className = '',
  children,
}: {
  tone?: 'slate' | 'gray' | 'blue' | 'green' | 'yellow' | 'red';
  className?: string;
  children: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-700 border border-slate-200/60',
    gray: 'bg-slate-100 text-slate-700 border border-slate-200/60',
    blue: 'bg-blue-50 text-blue-700 border border-blue-200/60',
    green: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    yellow: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    red: 'bg-red-50 text-red-700 border border-red-200/60',
  };

  const selectedTone = tones[tone] || tones.slate;

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${selectedTone} ${className}`}>{children}</span>;
}

