import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function DetailedDataSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  const detailedData = [
    { date: "2024-12-01", product: "Organic Whole Milk", stock: 0, category: "Dairy" },
    { date: "2024-12-01", product: "Greek Yogurt 32oz", stock: 3, category: "Dairy" },
    { date: "2024-12-01", product: "Grass-Fed Butter", stock: 2, category: "Dairy" },
    { date: "2024-12-01", product: "Cage-Free Eggs", stock: 5, category: "Dairy" },
    { date: "2024-12-01", product: "Organic Strawberries", stock: 4, category: "Produce" },
    { date: "2024-12-01", product: "Fresh Blueberries", stock: 0, category: "Produce" },
    { date: "2024-12-01", product: "Artisan Sourdough Bread", stock: 0, category: "Bakery" },
    { date: "2024-12-01", product: "Dark Chocolate Bar", stock: 6, category: "Snacks" },
    { date: "2024-12-01", product: "Organic Trail Mix", stock: 12, category: "Snacks" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] overflow-hidden">
      {/* Header Row */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#f8f9fa] transition-colors"
      >
        <h3 className="text-[18px] text-[#1f2933]" style={{ fontWeight: 700 }}>
          View Detailed Data
        </h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-[#6b7280]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#6b7280]" />
        )}
      </button>

      {/* Expanded Table */}
      {isExpanded && (
        <div className="border-t border-[#e5e7eb]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f8f9fa] border-b border-[#e5e7eb]">
                  <th className="text-left px-6 py-3 text-[13px] text-[#6b7280]" style={{ fontWeight: 600 }}>
                    Date
                  </th>
                  <th className="text-left px-6 py-3 text-[13px] text-[#6b7280]" style={{ fontWeight: 600 }}>
                    Product
                  </th>
                  <th className="text-right px-6 py-3 text-[13px] text-[#6b7280]" style={{ fontWeight: 600 }}>
                    Stock
                  </th>
                  <th className="text-left px-6 py-3 text-[13px] text-[#6b7280]" style={{ fontWeight: 600 }}>
                    Category
                  </th>
                </tr>
              </thead>
              <tbody>
                {detailedData.map((item, index) => (
                  <tr 
                    key={index}
                    className="border-b border-[#e5e7eb] hover:bg-[#f8f9fa] transition-colors"
                  >
                    <td className="px-6 py-3 text-[13px] text-[#6b7280]">
                      {item.date}
                    </td>
                    <td className="px-6 py-3 text-[13px] text-[#1f2933]">
                      {item.product}
                    </td>
                    <td className="px-6 py-3 text-[13px] text-[#1f2933] text-right" style={{ fontWeight: 600 }}>
                      {item.stock}
                    </td>
                    <td className="px-6 py-3 text-[13px] text-[#6b7280]">
                      {item.category}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
