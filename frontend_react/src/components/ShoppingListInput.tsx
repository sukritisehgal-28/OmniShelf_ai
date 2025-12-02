import { useState } from "react";
import { ShoppingCart, X } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";

interface ShoppingListInputProps {
  onSearch: (list: string) => void;
}

export function ShoppingListInput({ onSearch }: ShoppingListInputProps) {
  const [shoppingList, setShoppingList] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  const handleClear = () => {
    setShoppingList("");
  };

  const handleFind = () => {
    if (shoppingList.trim()) {
      onSearch(shoppingList);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto">
      {/* Label */}
      <label className="block text-[14px] text-[#111827] mb-3" style={{ fontWeight: 600 }}>
        Your shopping list
      </label>

      {/* Text Area */}
      <Textarea
        value={shoppingList}
        onChange={(e) => setShoppingList(e.target.value)}
        placeholder={`Example:\n• Coca Cola 2L\n• Nutella Hazelnut Spread\n• Barilla Spaghetti\n• Eggs (dozen)`}
        className="w-full h-[220px] border border-[#e5e7eb] rounded-xl p-5 text-[14px] text-[#111827] placeholder:text-[#9ca3af] resize-none focus:border-[#3498db] focus:ring-2 focus:ring-[#3498db]/20 transition-all"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      />

      {/* Helper Text */}
      <p className="text-[13px] text-[#6b7280] mt-2 mb-4">
        Tip: One item per line works best.
      </p>

      {/* Toggle Option */}
      <div className="flex items-center gap-3 mb-5">
        <Switch checked={inStockOnly} onCheckedChange={setInStockOnly} />
        <label className="text-[13px] text-[#6b7280]">
          Show only in-stock items
        </label>
      </div>

      {/* Primary Action Button */}
      <Button
        onClick={handleFind}
        className="w-full h-14 bg-[#10b981] hover:bg-[#059669] text-white text-[16px] rounded-full shadow-md hover:shadow-lg transition-all gap-2"
        style={{ fontWeight: 600 }}
      >
        <ShoppingCart className="w-5 h-5" />
        Find my items
      </Button>

      {/* Clear Link */}
      <div className="text-center mt-3">
        <button
          onClick={handleClear}
          className="text-[13px] text-[#6b7280] hover:text-[#111827] transition-colors inline-flex items-center gap-1"
        >
          <X className="w-3 h-3" />
          Clear list
        </button>
      </div>
    </div>
  );
}
