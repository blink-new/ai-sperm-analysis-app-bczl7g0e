import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MovementPattern } from '../../types/analysis';

interface MovementPatternChartProps {
  data: MovementPattern;
}

export function MovementPatternChart({ data }: MovementPatternChartProps) {
  const chartData = [
    {
      name: 'تقدمية',
      nameEn: 'Progressive',
      value: data.progressif,
      color: '#22c55e'
    },
    {
      name: 'غير تقدمية',
      nameEn: 'Non-Progressive',
      value: data['non-progressif'],
      color: '#f59e0b'
    },
    {
      name: 'ثابتة',
      nameEn: 'Immotile',
      value: data.immobile,
      color: '#ef4444'
    }
  ];

  const CustomTooltip = ({ active, payload }: {
    active?: boolean;
    payload?: Array<{
      value: number;
      payload: {
        name: string;
        nameEn: string;
        value: number;
        color: string;
      };
    }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm text-gray-600">{data.nameEn}</p>
          <p className="text-blue-600 font-bold">{data.value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            interval={0}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            label={{ value: 'النسبة %', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            fill={(entry) => entry.color}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}