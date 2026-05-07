import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/Card';

type ChartProps = {
  data: Array<{ name: string; revenue: number }>;
};

export default function RevenueChart({ data }: ChartProps) {
  const { t } = useTranslation();

  if (!data || data.length === 0) return null;

  return (
    <Card className="border-0 shadow-card bg-white dark:bg-slate-800 p-6 rounded-3xl col-span-full">
      <div className="mb-6">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('revenueTrends', 'Revenue Trends')}</h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{t('lastSixMonths', 'Last 6 Months')}</p>
      </div>
      
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
              tickFormatter={(value) => `${value} DH`}
              width={80}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                padding: '12px 16px',
                fontWeight: 'bold',
                color: '#0f172a'
              }}
              formatter={(value: number) => [`${value} MAD`, t('revenue', 'Revenue')]}
              labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '13px' }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3b82f6" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              activeDot={{ r: 8, strokeWidth: 0, fill: '#2563eb' }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
