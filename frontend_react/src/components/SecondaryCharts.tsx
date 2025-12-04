import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export function SecondaryCharts() {
  const lowStockData = [
    { name: "Grass-Fed Butter", count: 2 },
    { name: "Greek Yogurt 32oz", count: 3 },
    { name: "Organic Strawberries", count: 4 },
    { name: "Cage-Free Eggs", count: 5 },
    { name: "Dark Chocolate Bar", count: 6 },
  ];

  const categoryData = [
    { category: "Dairy", value: 130.44 },
    { category: "Snacks", value: 107.88 },
    { category: "Produce", value: 55.96 },
    { category: "Bakery", value: 39.96 },
  ];

  const categoryColors = ["#3498db", "#22c55e", "#f59e0b", "#ef4444"];

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Top 5 Low-Stock Items */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e5e7eb]">
        <h3 className="text-[18px] text-[#1f2933] mb-6" style={{ fontWeight: 700 }}>
          Top 5 Low-Stock Items
        </h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={lowStockData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              type="number"
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              type="category"
              dataKey="name" 
              tick={{ fill: '#6b7280', fontSize: 11 }}
              width={140}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '13px'
              }}
            />
            <Bar 
              dataKey="count" 
              fill="#f59e0b" 
              name="Stock Count"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Top Categories by Value */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e5e7eb]">
        <h3 className="text-[18px] text-[#1f2933] mb-6" style={{ fontWeight: 700 }}>
          Top Categories by Value
        </h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={categoryData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              type="number"
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              type="category"
              dataKey="category" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              width={80}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '13px'
              }}
              formatter={(value: number) => `$${value.toFixed(2)}`}
            />
            <Bar 
              dataKey="value" 
              name="Value ($)"
              radius={[0, 8, 8, 0]}
            >
              {categoryData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
