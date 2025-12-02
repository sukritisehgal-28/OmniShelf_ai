import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

export function AlertFilters() {
  const [type, setType] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [search, setSearch] = useState("");

  return (
    <div className="flex items-center gap-4 mb-5">
      {/* Type Filter */}
      <div className="w-[180px]">
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="h-9 text-[13px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="low">Low Stock</SelectItem>
            <SelectItem value="out">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Severity Filter */}
      <div className="w-[180px]">
        <Select value={severity} onValueChange={setSeverity}>
          <SelectTrigger className="h-9 text-[13px]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
        <Input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 pl-10 text-[13px] border-[#e5e7eb]"
        />
      </div>
    </div>
  );
}
