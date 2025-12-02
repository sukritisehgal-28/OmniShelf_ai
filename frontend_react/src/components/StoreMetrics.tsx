import { useEffect, useState } from "react";
import { Package, DollarSign, TrendingDown, CheckCircle } from "lucide-react";
import { fetchStockSummary } from "../services/api";

export function StoreMetrics() {
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const products = await fetchStockSummary();
        setTotalProducts(products.length);
        setTotalValue(products.reduce((sum, p) => sum + (p.inventory_value || 0), 0));
        setLowStockCount(products.filter(p => p.stock_level === "LOW").length);
        setOutOfStockCount(products.filter(p => p.total_count === 0).length);
      } catch (error) {
        console.error("Failed to load store metrics:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const metrics = [
    {
      label: "Total Products",
      value: loading ? "..." : totalProducts.toString(),
      icon: <Package className="w-6 h-6 text-[#3498db]" />,
      bgColor: "bg-blue-50",
    },
    {
      label: "Total Inventory Value",
      value: loading ? "..." : `$${totalValue.toFixed(2)}`,
      icon: <DollarSign className="w-6 h-6 text-[#22c55e]" />,
      bgColor: "bg-green-50",
    },
    {
      label: "Low Stock Items",
      value: loading ? "..." : lowStockCount.toString(),
      icon: <TrendingDown className="w-6 h-6 text-red-500" />,
      bgColor: "bg-red-50",
      indicator: lowStockCount > 0 ? "down" : undefined,
    },
    {
      label: "Out of Stock",
      value: loading ? "..." : outOfStockCount.toString(),
      icon: <CheckCircle className="w-6 h-6 text-red-600" />,
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-[24px] text-[#1f2933]" style={{ fontWeight: 700 }}>
        Store Performance
      </h2>
      
      <div className="grid grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-[#e5e7eb]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${metric.bgColor} rounded-lg p-3`}>
                {metric.icon}
              </div>
              {metric.indicator === "down" && (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-[13px] text-[#6b7280]">
                {metric.label}
              </p>
              <p className="text-[32px] text-[#1f2933]" style={{ fontWeight: 700, lineHeight: '1.2' }}>
                {metric.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
