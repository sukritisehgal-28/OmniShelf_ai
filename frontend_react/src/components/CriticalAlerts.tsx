import { useEffect, useState } from "react";
import { XOctagon, CheckCircle } from "lucide-react";
import { fetchStockSummary } from "../services/api";

interface ProductAlert {
  name: string;
  shelf: string;
  price: string;
}

export function CriticalAlerts() {
  const [outOfStockProducts, setOutOfStockProducts] = useState<ProductAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const products = await fetchStockSummary();

        // Filter out of stock products (excluding Unknown Product)
        const outOfStock = products
          .filter(p => p.total_count === 0 && p.display_name !== "Unknown Product")
          .map(p => ({
            name: p.display_name,
            shelf: p.shelf_id,
            price: `$${p.price.toFixed(2)}`
          }));

        setOutOfStockProducts(outOfStock);
      } catch (error) {
        console.error("Failed to load critical alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-[#6b7280]">Loading alerts...</div>;
  }

  // Show message if no out of stock alerts
  if (outOfStockProducts.length === 0) {
    return (
      <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-[15px] text-green-700" style={{ fontWeight: 600 }}>
            All products are in stock! No critical alerts at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Out of Stock Section */}
      <div className="bg-[#fee2e2] border-l-4 border-red-500 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <XOctagon className="w-5 h-5 text-red-600" />
          <p className="text-[15px] text-red-700" style={{ fontWeight: 600 }}>
            {outOfStockProducts.length} products OUT OF STOCK – immediate action required!
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {outOfStockProducts.map((product, index) => (
          <div 
            key={index}
            className="bg-[#fef2f2] border-l-4 border-red-500 rounded-xl p-5 shadow-sm"
          >
            <div className="space-y-2">
              <h3 className="text-[16px] text-[#1f2933]" style={{ fontWeight: 700 }}>
                {product.name}
              </h3>
              <div className="space-y-1">
                <p className="text-[13px] text-[#6b7280]">
                  Shelf: <span className="text-[#1f2933]" style={{ fontWeight: 600 }}>{product.shelf}</span>
                </p>
                <p className="text-[13px] text-[#6b7280]">
                  Price: <span className="text-[#1f2933]" style={{ fontWeight: 600 }}>{product.price}</span>
                </p>
              </div>
              <div className="pt-2">
                <span className="inline-block bg-red-600 text-white text-[11px] px-3 py-1 rounded-full" style={{ fontWeight: 600 }}>
                  OUT OF STOCK
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
