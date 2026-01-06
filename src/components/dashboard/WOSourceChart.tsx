import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { mockDashboardStats } from '@/data/mockData';

const data = [
  { name: 'TBM', value: mockDashboardStats.tbmCount, color: 'hsl(200, 85%, 55%)' },
  { name: 'CBM', value: mockDashboardStats.cbmCount, color: 'hsl(175, 80%, 50%)' },
  { name: 'Manual', value: mockDashboardStats.manualCount, color: 'hsl(35, 95%, 55%)' },
];

export function WOSourceChart() {
  return (
    <div className="glass-card rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-4">Work Orders by Source</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(220, 18%, 13%)',
                border: '1px solid hsl(220, 15%, 22%)',
                borderRadius: '8px',
                color: 'hsl(210, 20%, 95%)',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {data.map((item) => (
          <div key={item.name} className="text-center p-2 rounded-lg bg-muted/30">
            <p className="text-2xl font-bold" style={{ color: item.color }}>
              {item.value}
            </p>
            <p className="text-xs text-muted-foreground">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
