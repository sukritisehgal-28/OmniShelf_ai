import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { BarChart3 } from "lucide-react";

export function DashboardSummary() {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl p-6 shadow-sm border border-[#e5e7eb]">
      <div className="flex items-center gap-3">
        <Badge 
          variant="outline" 
          className="bg-blue-50 text-[#3498db] border-[#3498db] px-3 py-1.5 text-[13px]"
        >
          9 products tracked
        </Badge>
        <Badge 
          variant="outline" 
          className="bg-orange-50 text-orange-600 border-orange-300 px-3 py-1.5 text-[13px]"
        >
          5 low-stock
        </Badge>
        <Badge 
          variant="outline" 
          className="bg-red-50 text-red-600 border-red-300 px-3 py-1.5 text-[13px]"
        >
          3 out-of-stock
        </Badge>
      </div>
      
      <Button 
        variant="outline" 
        className="border-[#3498db] text-[#3498db] hover:bg-[#3498db] hover:text-white h-10 px-5 rounded-lg transition-colors"
      >
        <BarChart3 className="w-4 h-4 mr-2" />
        Go to Analytics Dashboard
      </Button>
    </div>
  );
}
