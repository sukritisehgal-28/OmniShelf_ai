import { CheckCircle, AlertCircle } from "lucide-react";

interface ResultItem {
  item: string;
  shelf: string;
  availability: "in-stock" | "low-stock" | "out-of-stock";
  notes: string;
}

interface SmartCartResultsProps {
  hasSearched: boolean;
}

export function SmartCartResults({ hasSearched }: SmartCartResultsProps) {
  // Mock data for demonstration
  const results: ResultItem[] = [
    { item: "Coca Cola 2L", shelf: "A3", availability: "in-stock", notes: "Near dairy section" },
    { item: "Nutella Hazelnut Spread", shelf: "B7", availability: "in-stock", notes: "Spreads & condiments" },
    { item: "Barilla Spaghetti", shelf: "A5", availability: "low-stock", notes: "Only 3 units left" },
    { item: "Eggs (dozen)", shelf: "D2", availability: "in-stock", notes: "Refrigerated section" },
    { item: "Organic Whole Milk", shelf: "D1", availability: "out-of-stock", notes: "Expected restock: Today 3 PM" },
    { item: "Greek Yogurt", shelf: "D3", availability: "in-stock", notes: "End cap display" },
    { item: "Fresh Blueberries", shelf: "C2", availability: "out-of-stock", notes: "Check back tomorrow" },
  ];

  const inStockCount = results.filter(r => r.availability === "in-stock" || r.availability === "low-stock").length;
  const outOfStockItems = results.filter(r => r.availability === "out-of-stock");

  const getAvailabilityStyle = (availability: string) => {
    switch (availability) {
      case "in-stock":
        return "bg-green-100 text-green-700 border-green-200";
      case "low-stock":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "out-of-stock":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "";
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case "in-stock":
        return "In stock";
      case "low-stock":
        return "Low stock";
      case "out-of-stock":
        return "Out of stock";
      default:
        return "";
    }
  };

  if (!hasSearched) {
    return (
      <div className="max-w-[1000px] mx-auto mt-12">
        <h2 className="text-[22px] text-[#111827] mb-4" style={{ fontWeight: 700 }}>
          Your items in this store
        </h2>
        <div className="bg-white rounded-2xl border border-[#e5e7eb] p-12 text-center">
          <p className="text-[15px] text-[#6b7280]">
            We'll show your results here once you paste a list and tap 'Find my items'.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto mt-12">
      <h2 className="text-[22px] text-[#111827] mb-5" style={{ fontWeight: 700 }}>
        Your items in this store
      </h2>

      {/* Success Banner */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-3 flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <p className="text-[15px] text-green-800" style={{ fontWeight: 600 }}>
          We found {inStockCount} of {results.length} items in stock.
        </p>
      </div>

      {/* Out of Stock Banner */}
      {outOfStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <p className="text-[15px] text-red-800" style={{ fontWeight: 600 }}>
              Out of stock: {outOfStockItems.map(item => item.item).join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f9fafb] border-b border-[#e5e7eb]">
              <th className="text-left px-6 py-4 text-[13px] text-[#6b7280]" style={{ fontWeight: 700 }}>
                Item
              </th>
              <th className="text-left px-6 py-4 text-[13px] text-[#6b7280]" style={{ fontWeight: 700 }}>
                Shelf
              </th>
              <th className="text-left px-6 py-4 text-[13px] text-[#6b7280]" style={{ fontWeight: 700 }}>
                Availability
              </th>
              <th className="text-left px-6 py-4 text-[13px] text-[#6b7280]" style={{ fontWeight: 700 }}>
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr
                key={index}
                className={`border-b border-[#e5e7eb] hover:bg-[#f9fafb] transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]'
                }`}
              >
                <td className="px-6 py-5 text-[14px] text-[#111827]" style={{ fontWeight: 600 }}>
                  {result.item}
                </td>
                <td className="px-6 py-5 text-[14px] text-[#3498db]" style={{ fontWeight: 600 }}>
                  {result.shelf}
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-block px-3 py-1 rounded-full text-[12px] border ${getAvailabilityStyle(result.availability)}`} style={{ fontWeight: 600 }}>
                    {getAvailabilityText(result.availability)}
                  </span>
                </td>
                <td className="px-6 py-5 text-[14px] text-[#6b7280]">
                  {result.notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
