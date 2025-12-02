import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { MapPin, Calendar } from "lucide-react";

export function DashboardFilters() {
  const [timeRange, setTimeRange] = useState("today");
  const [location, setLocation] = useState("all");

  return (
    <div className="flex justify-end gap-3">
      <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-[#e5e7eb] shadow-sm">
        <MapPin className="w-4 h-4 text-[#6b7280]" />
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="h-8 border-0 bg-transparent text-[13px] w-[140px]">
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
      
      <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-[#e5e7eb] shadow-sm">
        <Calendar className="w-4 h-4 text-[#6b7280]" />
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="h-8 border-0 bg-transparent text-[13px] w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
