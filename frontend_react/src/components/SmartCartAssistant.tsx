import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SmartCartSteps } from "./SmartCartSteps";
import { ShoppingListInput } from "./ShoppingListInput";
import { SmartCartResults } from "./SmartCartResults";
import { ShoppingCart } from "lucide-react";
import { searchShoppingList, ShoppingListResult } from "../services/api";

interface SmartCartAssistantProps {
  onNavigate: (page: string) => void;
}

export function SmartCartAssistant({ onNavigate }: SmartCartAssistantProps) {
  const navigate = useNavigate();
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ShoppingListResult[]>([]);

  const handleSearch = async (list: string, inStockOnly: boolean) => {
    const items = list
      .split(/[\r\n,]/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (!items.length) {
      setError("No items written! Please enter your list/item.");
      setHasSearched(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await searchShoppingList(items);
      const filtered = inStockOnly
        ? data.filter((r) => r.found && (r.stock_count ?? 0) > 0)
        : data;
      setResults(filtered);
      setHasSearched(true);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch SmartCart results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-8 py-12">
        {/* Header Area */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3498db] to-[#2980b9] flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-[40px] text-[#111827]" style={{ fontWeight: 700 }}>
              SmartCart Assistant
            </h1>
          </div>
          <p className="text-[16px] text-[#6b7280] max-w-[600px] mx-auto">
            Paste your shopping list and we'll show you where to find everything in the store.
          </p>
        </div>

        {/* Step-by-Step Helper */}
        <SmartCartSteps />

        {error && (
          <div className="max-w-[800px] mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 text-[14px] rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Shopping List Input */}
        <div className="mb-8">
          <ShoppingListInput
            onSearch={handleSearch}
            onEmpty={() => {
              setError("No items written! Please enter your list/item.");
              setHasSearched(false);
            }}
          />
        </div>

        {/* Results Area */}
        <SmartCartResults
          hasSearched={hasSearched}
          loading={loading}
          error={error}
          results={results}
        />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-[#e5e7eb] text-center">
          <p className="text-[13px] text-[#6b7280]">
            Need help? Ask a store associate.{" "}
            <button 
              onClick={() => {
                onNavigate("home");
                navigate("/");
              }} 
              className="text-[#3498db] hover:text-[#2980b9] transition-colors underline"
            >
              Back to Main
            </button>
          </p>
        </footer>
      </main>
    </div>
  );
}
