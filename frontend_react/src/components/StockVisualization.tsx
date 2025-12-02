import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export function StockVisualization() {
  const data = [
    { name: "Organic Whole Milk", stock: 0 },
    { name: "Greek Yogurt 32oz", stock: 3 },
    { name: "Grass-Fed Butter", stock: 2 },
    { name: "Cage-Free Eggs", stock: 5 },
    { name: "Organic Strawberries", stock: 4 },
    { name: "Fresh Blueberries", stock: 0 },
    { name: "Artisan Sourdough", stock: 0 },
    { name: "Dark Chocolate Bar", stock: 6 },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-[24px] text-[#1f2933]" style={{ fontWeight: 700 }}>
        Per-Product Stock Counts
      </h2>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e5e7eb]">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart 
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              label={{ value: 'Stock Count', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontSize: 13 } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '13px'
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '13px' }}
            />
            <Bar 
              dataKey="stock" 
              fill="#3498db" 
              name="Stock Units"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
