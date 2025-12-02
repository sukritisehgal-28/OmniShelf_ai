import { useEffect, useState } from "react";
import { Package, DollarSign, AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import { fetchStockSummary } from "../services/api";

export function DashboardMetrics() {
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const products = await fetchStockSummary();

        // Calculate metrics from real data
        setTotalProducts(products.length);

        const value = products.reduce((sum, p) => sum + (p.inventory_value || 0), 0);
        setTotalValue(value);

        const lowStock = products.filter(p => p.stock_level === "LOW").length;
        setLowStockCount(lowStock);

        const outOfStock = products.filter(p => p.total_count === 0).length;
        setOutOfStockCount(outOfStock);
      } catch (error) {
        console.error("Failed to load dashboard metrics:", error);
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
      icon: <AlertTriangle className="w-6 h-6 text-orange-500" />,
      bgColor: "bg-orange-50",
      indicator: lowStockCount > 0 ? "warning" : undefined,
    },
    {
      label: "Out of Stock",
      value: loading ? "..." : outOfStockCount.toString(),
      icon: outOfStockCount > 0
        ? <XCircle className="w-6 h-6 text-red-600" />
        : <CheckCircle className="w-6 h-6 text-[#22c55e]" />,
      bgColor: outOfStockCount > 0 ? "bg-red-50" : "bg-green-50",
    },
  ];

  return (
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
            {metric.indicator === "warning" && (
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
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
  );
}
