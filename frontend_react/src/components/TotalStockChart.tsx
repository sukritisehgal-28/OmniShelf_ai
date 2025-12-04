import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

export function TotalStockChart() {
  const data = [
    { date: "Mon", stock: 28 },
    { date: "Tue", stock: 32 },
    { date: "Wed", stock: 26 },
    { date: "Thu", stock: 29 },
    { date: "Fri", stock: 34 },
    { date: "Sat", stock: 31 },
    { date: "Sun", stock: 32 },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e5e7eb]">
      <h3 className="text-[20px] text-[#1f2933] mb-6" style={{ fontWeight: 700 }}>
        Total Stock Over Time
      </h3>
      
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart 
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3498db" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3498db" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
            label={{ 
              value: 'Total Stock Units', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: '#6b7280', fontSize: 13 }
            }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '13px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            labelStyle={{ color: '#1f2933', fontWeight: 600 }}
          />
          <Area 
            type="monotone" 
            dataKey="stock" 
            stroke="#3498db" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorStock)"
            dot={{ fill: '#3498db', r: 5, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 7, strokeWidth: 2, stroke: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
