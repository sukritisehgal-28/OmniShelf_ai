import { Button } from "./ui/button";
import { Download } from "lucide-react";

interface HistoryItem {
  time: string;
  type: "LOW STOCK" | "OUT OF STOCK";
  product: string;
  action: string;
}

export function AlertHistory() {
  const history: HistoryItem[] = [
    { time: "2024-12-01 14:23", type: "OUT OF STOCK", product: "Organic Whole Milk", action: "Restock order created" },
    { time: "2024-12-01 14:15", type: "OUT OF STOCK", product: "Fresh Blueberries", action: "Dismissed" },
    { time: "2024-12-01 13:45", type: "LOW STOCK", product: "Greek Yogurt 32oz", action: "Restock order created" },
    { time: "2024-12-01 13:22", type: "LOW STOCK", product: "Grass-Fed Butter", action: "Muted" },
    { time: "2024-12-01 12:58", type: "LOW STOCK", product: "Cage-Free Eggs", action: "Restock order created" },
    { time: "2024-12-01 12:30", type: "OUT OF STOCK", product: "Artisan Sourdough Bread", action: "Restock order created" },
    { time: "2024-12-01 11:45", type: "LOW STOCK", product: "Organic Strawberries", action: "Dismissed" },
    { time: "2024-12-01 11:20", type: "OUT OF STOCK", product: "Dark Chocolate Bar", action: "Restock order created" },
  ];

  const getTypeStyle = (type: string) => {
    if (type === "OUT OF STOCK") {
      return "bg-red-100 text-red-700 border-red-200";
    }
    return "bg-orange-100 text-orange-700 border-orange-200";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-[#e5e7eb]">
        <h3 className="text-[20px] text-[#1f2933]" style={{ fontWeight: 700 }}>
          Alert History
        </h3>
        <Button className="bg-[#3498db] hover:bg-[#2980b9] text-white text-[13px] h-9 gap-2">
          <Download className="w-4 h-4" />
          Download Alert Report
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f8f9fa] border-b border-[#e5e7eb]">
              <th className="text-left px-6 py-3 text-[13px] text-[#6b7280]" style={{ fontWeight: 600 }}>
                Time
              </th>
              <th className="text-left px-6 py-3 text-[13px] text-[#6b7280]" style={{ fontWeight: 600 }}>
                Type
              </th>
              <th className="text-left px-6 py-3 text-[13px] text-[#6b7280]" style={{ fontWeight: 600 }}>
                Product
              </th>
              <th className="text-left px-6 py-3 text-[13px] text-[#6b7280]" style={{ fontWeight: 600 }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr 
                key={index}
                className={`border-b border-[#e5e7eb] hover:bg-[#f8f9fa] transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]'
                }`}
              >
                <td className="px-6 py-3 text-[13px] text-[#6b7280]">
                  {item.time}
                </td>
                <td className="px-6 py-3">
                  <span className={`inline-block px-2 py-1 rounded-full text-[11px] border ${getTypeStyle(item.type)}`} style={{ fontWeight: 600 }}>
                    {item.type}
                  </span>
                </td>
                <td className="px-6 py-3 text-[13px] text-[#1f2933]">
                  {item.product}
                </td>
                <td className="px-6 py-3 text-[13px] text-[#6b7280]">
                  {item.action}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Note */}
      <div className="px-6 py-3 bg-[#f8f9fa] border-t border-[#e5e7eb]">
        <p className="text-[11px] text-[#6b7280]">
          History kept for last 30 days.
        </p>
      </div>
    </div>
  );
}
