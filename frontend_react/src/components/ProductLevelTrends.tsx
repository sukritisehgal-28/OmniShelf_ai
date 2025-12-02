import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Checkbox } from "./ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";

export function ProductLevelTrends() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([
    "Organic Whole Milk",
    "Greek Yogurt 32oz",
    "Cage-Free Eggs"
  ]);

  const products = [
    "Organic Whole Milk",
    "Greek Yogurt 32oz",
    "Grass-Fed Butter",
    "Cage-Free Eggs",
    "Organic Strawberries",
    "Dark Chocolate Bar"
  ];

  const data = [
    { date: "Mon", "Organic Whole Milk": 5, "Greek Yogurt 32oz": 8, "Grass-Fed Butter": 6, "Cage-Free Eggs": 12, "Organic Strawberries": 10, "Dark Chocolate Bar": 15 },
    { date: "Tue", "Organic Whole Milk": 3, "Greek Yogurt 32oz": 6, "Grass-Fed Butter": 4, "Cage-Free Eggs": 10, "Organic Strawberries": 8, "Dark Chocolate Bar": 13 },
    { date: "Wed", "Organic Whole Milk": 2, "Greek Yogurt 32oz": 5, "Grass-Fed Butter": 3, "Cage-Free Eggs": 8, "Organic Strawberries": 6, "Dark Chocolate Bar": 11 },
    { date: "Thu", "Organic Whole Milk": 1, "Greek Yogurt 32oz": 4, "Grass-Fed Butter": 2, "Cage-Free Eggs": 7, "Organic Strawberries": 5, "Dark Chocolate Bar": 9 },
    { date: "Fri", "Organic Whole Milk": 0, "Greek Yogurt 32oz": 3, "Grass-Fed Butter": 2, "Cage-Free Eggs": 5, "Organic Strawberries": 4, "Dark Chocolate Bar": 7 },
    { date: "Sat", "Organic Whole Milk": 0, "Greek Yogurt 32oz": 3, "Grass-Fed Butter": 2, "Cage-Free Eggs": 5, "Organic Strawberries": 4, "Dark Chocolate Bar": 6 },
    { date: "Sun", "Organic Whole Milk": 0, "Greek Yogurt 32oz": 3, "Grass-Fed Butter": 2, "Cage-Free Eggs": 5, "Organic Strawberries": 4, "Dark Chocolate Bar": 6 },
  ];

  const colors = {
    "Organic Whole Milk": "#3498db",
    "Greek Yogurt 32oz": "#22c55e",
    "Grass-Fed Butter": "#f59e0b",
    "Cage-Free Eggs": "#ef4444",
    "Organic Strawberries": "#8b5cf6",
    "Dark Chocolate Bar": "#ec4899"
  };

  const toggleProduct = (product: string) => {
    setSelectedProducts(prev =>
      prev.includes(product)
        ? prev.filter(p => p !== product)
        : [...prev, product]
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e5e7eb]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[20px] text-[#1f2933]" style={{ fontWeight: 700 }}>
          Product-Level Trends
        </h3>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="h-9 px-4 text-[13px] border-[#e5e7eb]"
            >
              Select Products ({selectedProducts.length})
              <ChevronDown className="w-4 h-4 ml-2 text-[#6b7280]" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="end">
            <div className="space-y-2">
              <p className="text-[12px] text-[#6b7280] mb-2" style={{ fontWeight: 600 }}>
                SELECT PRODUCTS
              </p>
              {products.map((product) => (
                <div key={product} className="flex items-center space-x-2">
                  <Checkbox
                    id={product}
                    checked={selectedProducts.includes(product)}
                    onCheckedChange={() => toggleProduct(product)}
                  />
                  <label
                    htmlFor={product}
                    className="text-[13px] text-[#1f2933] cursor-pointer flex-1"
                  >
                    {product}
                  </label>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[product as keyof typeof colors] }}
                  />
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <ResponsiveContainer width="100%" height={320}>
        <LineChart 
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
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
              value: 'Stock Units', 
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
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
            iconType="circle"
          />
          {selectedProducts.map((product) => (
            <Line
              key={product}
              type="monotone"
              dataKey={product}
              stroke={colors[product as keyof typeof colors]}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      
      <p className="text-[12px] text-[#6b7280] mt-4 italic">
        Compare stock movement for key items.
      </p>
    </div>
  );
}
