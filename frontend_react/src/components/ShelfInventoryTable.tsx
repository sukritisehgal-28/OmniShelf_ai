import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { fetchStockSummary } from "../services/api";

interface InventoryItem {
  product: string;
  category: string;
  shelf: string;
  count: number;
  price: number;
  value: number;
  stockLevel: "HIGH" | "MEDIUM" | "LOW" | "OUT";
}

export function ShelfInventoryTable() {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const products = await fetchStockSummary();

        // Transform backend data to inventory format
        const inventory: InventoryItem[] = products.map(p => {
          let stockLevel: "HIGH" | "MEDIUM" | "LOW" | "OUT";
          if (p.total_count === 0) stockLevel = "OUT";
          else if (p.total_count >= 10) stockLevel = "HIGH";
          else if (p.total_count >= 6) stockLevel = "MEDIUM";
          else stockLevel = "LOW";

          return {
            product: p.display_name,
            category: p.category,
            shelf: p.shelf_id,
            count: p.total_count,
            price: p.price,
            value: p.inventory_value,
            stockLevel
          };
        });

        setInventoryData(inventory);
      } catch (error) {
        console.error("Failed to load shelf inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getStockLevelBadge = (level: string) => {
    const styles = {
      HIGH: "bg-green-100 text-green-700 border-green-300",
      MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-300",
      LOW: "bg-orange-100 text-orange-700 border-orange-300",
      OUT: "bg-red-100 text-red-700 border-red-300",
    };

    return (
      <Badge 
        variant="outline" 
        className={`${styles[level as keyof typeof styles]} text-[11px] px-2 py-1`}
        style={{ fontWeight: 600 }}
      >
        {level}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-[24px] text-[#1f2933]" style={{ fontWeight: 700 }}>
          Shelf Inventory Table
        </h2>
        <div className="bg-white rounded-xl p-8 text-center border border-[#e5e7eb]">
          <p className="text-[#6b7280]">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-[24px] text-[#1f2933]" style={{ fontWeight: 700 }}>
        Shelf Inventory Table
      </h2>

      <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#2c3e50]">
                <th className="text-left px-6 py-4 text-[13px] text-white" style={{ fontWeight: 600 }}>
                  Product
                </th>
                <th className="text-left px-6 py-4 text-[13px] text-white" style={{ fontWeight: 600 }}>
                  Category
                </th>
                <th className="text-left px-6 py-4 text-[13px] text-white" style={{ fontWeight: 600 }}>
                  Shelf
                </th>
                <th className="text-right px-6 py-4 text-[13px] text-white" style={{ fontWeight: 600 }}>
                  Count
                </th>
                <th className="text-right px-6 py-4 text-[13px] text-white" style={{ fontWeight: 600 }}>
                  Price
                </th>
                <th className="text-right px-6 py-4 text-[13px] text-white" style={{ fontWeight: 600 }}>
                  Value
                </th>
                <th className="text-center px-6 py-4 text-[13px] text-white" style={{ fontWeight: 600 }}>
                  Stock Level
                </th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item, index) => (
                <tr 
                  key={index}
                  className={`
                    border-b border-[#e5e7eb] transition-colors
                    ${index % 2 === 0 ? 'bg-white' : 'bg-[#f8f9fa]'}
                    hover:bg-[#f1f5f9]
                  `}
                >
                  <td className="px-6 py-4 text-[13px] text-[#1f2933]">
                    {item.product}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#6b7280]">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#6b7280]">
                    {item.shelf}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#1f2933] text-right" style={{ fontWeight: 600 }}>
                    {item.count}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#1f2933] text-right">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#1f2933] text-right" style={{ fontWeight: 600 }}>
                    ${item.value.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStockLevelBadge(item.stockLevel)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
