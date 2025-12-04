import { CheckCircle, AlertCircle } from "lucide-react";
import { ShoppingListResult } from "../services/api";

interface SmartCartResultsProps {
  hasSearched: boolean;
  loading: boolean;
  error: string | null;
  results: ShoppingListResult[];
}

export function SmartCartResults({ hasSearched, loading, error, results }: SmartCartResultsProps) {
  const inStockResults = results.filter((r) => r.found && (r.stock_count ?? 0) > 0);
  const outOfStock = results.filter((r) => r.found && (r.stock_count ?? 0) === 0);
  const notFound = results.filter((r) => !r.found);

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

  if (loading) {
    return (
      <div className="max-w-[1000px] mx-auto mt-12 bg-white rounded-2xl border border-[#e5e7eb] p-10 text-center text-[15px] text-[#6b7280]">
        Searching your items...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1000px] mx-auto mt-12 bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 text-[14px]">
        {error}
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
          Found {inStockResults.length} of {results.length} items with stock.
        </p>
      </div>

      {/* Out of Stock Banner */}
      {outOfStock.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <p className="text-[15px] text-red-800" style={{ fontWeight: 600 }}>
              Out of stock: {outOfStock.map(item => item.item).join(", ")}
            </p>
          </div>
        </div>
      )}

      {notFound.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 text-[14px] text-[#92400e]">
          Not found: {notFound.map((n) => n.item).join(", ")}
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
                Quantity
              </th>
              <th className="text-left px-6 py-4 text-[13px] text-[#6b7280]" style={{ fontWeight: 700 }}>
                Price
              </th>
              <th className="text-left px-6 py-4 text-[13px] text-[#6b7280]" style={{ fontWeight: 700 }}>
                Shelf
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
                  {result.display_name || result.item || result.product_name || "—"}
                </td>
                <td className="px-6 py-5 text-[14px] text-[#111827]">
                  {result.stock_count !== undefined ? result.stock_count : "—"}
                </td>
                <td className="px-6 py-5 text-[14px] text-[#111827]">
                  {typeof result.price === "number" ? `$${result.price.toFixed(2)}` : "—"}
                </td>
                <td className="px-6 py-5 text-[14px] text-[#3498db]" style={{ fontWeight: 600 }}>
                  {result.shelf_id || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
