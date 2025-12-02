import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

export function CategoryBreakdown() {
  const countData = [
    { category: "Dairy", count: 4 },
    { category: "Produce", count: 2 },
    { category: "Bakery", count: 1 },
    { category: "Snacks", count: 2 },
  ];

  const valueData = [
    { category: "Dairy", value: 130.44 },
    { category: "Produce", value: 55.96 },
    { category: "Bakery", value: 39.96 },
    { category: "Snacks", value: 29.55 },
  ];

  const colors = ["#3498db", "#22c55e", "#f59e0b", "#ef4444"];

  return (
    <div className="space-y-4">
      <h2 className="text-[24px] text-[#1f2933]" style={{ fontWeight: 700 }}>
        Inventory by Category
      </h2>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Count by Category */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e5e7eb]">
          <h3 className="text-[16px] text-[#1f2933] mb-4" style={{ fontWeight: 600 }}>
            Count by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={countData}
              margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="category" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                label={{ value: 'Product Count', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontSize: 12 } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '13px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '13px' }} />
              <Bar 
                dataKey="count" 
                name="Products"
                radius={[8, 8, 0, 0]}
              >
                {countData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Value by Category */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e5e7eb]">
          <h3 className="text-[16px] text-[#1f2933] mb-4" style={{ fontWeight: 600 }}>
            Value by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={valueData}
              margin={{ top: 10, right: 10, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="category" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                label={{ value: 'Value ($)', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontSize: 12 } }}
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
              <Legend wrapperStyle={{ fontSize: '13px' }} />
              <Bar 
                dataKey="value" 
                name="Value ($)"
                radius={[8, 8, 0, 0]}
              >
                {valueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
