import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

interface VelocityItem {
  product: string;
  change: number;
  changePercent: number;
  trend: "up" | "down" | "stable";
}

export function StockVelocityTable() {
  const velocityData: VelocityItem[] = [
    { product: "Organic Trail Mix", change: 8, changePercent: 200.0, trend: "up" },
    { product: "Dark Chocolate Bar", change: 4, changePercent: 66.7, trend: "up" },
    { product: "Cage-Free Eggs", change: 2, changePercent: 40.0, trend: "up" },
    { product: "Organic Strawberries", change: 0, changePercent: 0, trend: "stable" },
    { product: "Greek Yogurt 32oz", change: -2, changePercent: -40.0, trend: "down" },
    { product: "Grass-Fed Butter", change: -3, changePercent: -60.0, trend: "down" },
    { product: "Organic Whole Milk", change: -5, changePercent: -100.0, trend: "down" },
    { product: "Fresh Blueberries", change: -6, changePercent: -100.0, trend: "down" },
    { product: "Artisan Sourdough Bread", change: -8, changePercent: -100.0, trend: "down" },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <ArrowRight className="w-4 h-4 text-[#6b7280]" />;
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-[#6b7280]";
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e5e7eb]">
      <h3 className="text-[20px] text-[#1f2933] mb-6" style={{ fontWeight: 700 }}>
        Stock Velocity
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e5e7eb]">
              <th className="text-left px-4 py-3 text-[13px] text-[#6b7280]" style={{ fontWeight: 600 }}>
                Product
              </th>
              <th className="text-right px-4 py-3 text-[13px] text-[#6b7280]" style={{ fontWeight: 600 }}>
                Change (units)
              </th>
              <th className="text-right px-4 py-3 text-[13px] text-[#6b7280]" style={{ fontWeight: 600 }}>
                Change %
              </th>
              <th className="text-center px-4 py-3 text-[13px] text-[#6b7280]" style={{ fontWeight: 600 }}>
                Trend
              </th>
            </tr>
          </thead>
          <tbody>
            {velocityData.map((item, index) => (
              <tr 
                key={index}
                className="border-b border-[#e5e7eb] hover:bg-[#f8f9fa] transition-colors"
              >
                <td className="px-4 py-3 text-[13px] text-[#1f2933]">
                  {item.product}
                </td>
                <td className={`px-4 py-3 text-[13px] text-right ${getChangeColor(item.change)}`} style={{ fontWeight: 600 }}>
                  {item.change > 0 ? `+${item.change}` : item.change}
                </td>
                <td className={`px-4 py-3 text-[13px] text-right ${getChangeColor(item.change)}`} style={{ fontWeight: 600 }}>
                  {item.changePercent > 0 ? `+${item.changePercent.toFixed(1)}%` : `${item.changePercent.toFixed(1)}%`}
                </td>
                <td className="px-4 py-3 text-center">
                  {getTrendIcon(item.trend)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
