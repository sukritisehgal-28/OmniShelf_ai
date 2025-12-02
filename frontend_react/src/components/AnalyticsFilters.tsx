import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Calendar, MapPin } from "lucide-react";

export function AnalyticsFilters() {
  const [dateRange, setDateRange] = useState("7days");
  const [store, setStore] = useState("all");

  const handleApply = () => {
    // Apply filters logic
    console.log("Applying filters:", { dateRange, store });
  };

  const handleReset = () => {
    setDateRange("7days");
    setStore("all");
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-[#e5e7eb]">
      <div className="flex items-center gap-4">
        {/* Date Range Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#6b7280]" />
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="h-9 w-[160px] text-[13px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="14days">Last 14 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Store Selector */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#6b7280]" />
          <Select value={store} onValueChange={setStore}>
            <SelectTrigger className="h-9 w-[160px] text-[13px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              <SelectItem value="main">Main Street</SelectItem>
              <SelectItem value="downtown">Downtown</SelectItem>
              <SelectItem value="north">North Branch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="outline"
            onClick={handleReset}
            className="h-9 px-4 text-[13px] border-[#e5e7eb] hover:bg-[#f8f9fa]"
          >
            Reset
          </Button>
          <Button
            onClick={handleApply}
            className="h-9 px-5 text-[13px] bg-[#3498db] hover:bg-[#2980b9] text-white"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
