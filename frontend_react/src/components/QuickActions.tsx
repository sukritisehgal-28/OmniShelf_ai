import { Download, Package, BarChart3 } from "lucide-react";
import { Button } from "./ui/button";

export function QuickActions() {
  return (
    <div className="space-y-4">
      <h2 className="text-[24px] text-[#1f2933]" style={{ fontWeight: 700 }}>
        Quick Actions
      </h2>
      
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          className="border-[#3498db] text-[#3498db] hover:bg-[#3498db] hover:text-white h-12 px-6 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Inventory Report (CSV)
        </Button>
        
        <Button 
          variant="outline" 
          className="border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white h-12 px-6 rounded-lg transition-colors"
        >
          <Package className="w-4 h-4 mr-2" />
          Generate Restock Orders
        </Button>
        
        <Button 
          variant="outline" 
          className="border-[#6b7280] text-[#6b7280] hover:bg-[#6b7280] hover:text-white h-12 px-6 rounded-lg transition-colors"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          View Analytics
        </Button>
      </div>
    </div>
  );
}
