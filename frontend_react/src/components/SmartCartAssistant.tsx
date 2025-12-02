import { useState } from "react";
import { SmartCartNav } from "./SmartCartNav";
import { SmartCartSteps } from "./SmartCartSteps";
import { ShoppingListInput } from "./ShoppingListInput";
import { SmartCartResults } from "./SmartCartResults";
import { RouteSummary } from "./RouteSummary";
import { ShoppingCart } from "lucide-react";

interface SmartCartAssistantProps {
  onNavigate: (page: string) => void;
}

export function SmartCartAssistant({ onNavigate }: SmartCartAssistantProps) {
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (list: string) => {
    console.log("Searching for:", list);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Top Navigation */}
      <SmartCartNav onNavigate={onNavigate} />

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

        {/* Shopping List Input */}
        <div className="mb-8">
          <ShoppingListInput onSearch={handleSearch} />
        </div>

        {/* Results Area */}
        <SmartCartResults hasSearched={hasSearched} />

        {/* Route Summary */}
        <RouteSummary hasSearched={hasSearched} />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-[#e5e7eb] text-center">
          <p className="text-[13px] text-[#6b7280]">
            Need help? Ask a store associate.{" "}
            <button 
              onClick={() => onNavigate("home")} 
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