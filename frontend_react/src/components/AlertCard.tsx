import { useState } from "react";
import { ChevronDown, ChevronUp, XCircle, AlertTriangle, TrendingDown } from "lucide-react";
import { Button } from "./ui/button";

interface AlertCardProps {
  alert: {
    id: string;
    type: "out" | "low";
    severity: "critical" | "warning" | "info";
    product: string;
    message: string;
    timestamp: string;
    details: {
      shelf: string;
      price: string;
      currentStock: number;
      trend: string;
    };
  };
}

export function AlertCard({ alert }: AlertCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIcon = () => {
    if (alert.type === "out") {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
    return <AlertTriangle className="w-5 h-5 text-orange-500" />;
  };

  const getSeverityStyle = () => {
    switch (alert.severity) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200";
      case "warning":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
      {/* Main Alert Row */}
      <div 
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-[#f8f9fa] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Icon */}
        <div className="flex-shrink-0">
          {getIcon()}
        </div>

        {/* Product and Message */}
        <div className="flex-1 min-w-0">
          <h4 className="text-[14px] text-[#1f2933] mb-1" style={{ fontWeight: 600 }}>
            {alert.product}
          </h4>
          <p className="text-[13px] text-[#6b7280]">
            {alert.message}
          </p>
        </div>

        {/* Timestamp */}
        <div className="flex-shrink-0 text-[12px] text-[#6b7280]">
          {alert.timestamp}
        </div>

        {/* Severity Pill */}
        <div className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] border ${getSeverityStyle()}`} style={{ fontWeight: 600 }}>
          {alert.severity.toUpperCase()}
        </div>

        {/* Expand/Collapse Icon */}
        <div className="flex-shrink-0">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-[#6b7280]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#6b7280]" />
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-[#e5e7eb] bg-[#f8f9fa] p-5">
          <div className="grid grid-cols-4 gap-4 mb-5">
            {/* Shelf Location */}
            <div>
              <p className="text-[11px] text-[#6b7280] mb-1" style={{ fontWeight: 600 }}>
                SHELF LOCATION
              </p>
              <p className="text-[14px] text-[#1f2933]" style={{ fontWeight: 600 }}>
                {alert.details.shelf}
              </p>
            </div>

            {/* Price */}
            <div>
              <p className="text-[11px] text-[#6b7280] mb-1" style={{ fontWeight: 600 }}>
                PRICE
              </p>
              <p className="text-[14px] text-[#1f2933]" style={{ fontWeight: 600 }}>
                {alert.details.price}
              </p>
            </div>

            {/* Current Stock */}
            <div>
              <p className="text-[11px] text-[#6b7280] mb-1" style={{ fontWeight: 600 }}>
                CURRENT STOCK
              </p>
              <p className="text-[14px] text-[#1f2933]" style={{ fontWeight: 600 }}>
                {alert.details.currentStock} units
              </p>
            </div>

            {/* Stock History Trend */}
            <div>
              <p className="text-[11px] text-[#6b7280] mb-1" style={{ fontWeight: 600 }}>
                TREND (7 DAYS)
              </p>
              <div className="flex items-center gap-1">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <p className="text-[14px] text-red-600" style={{ fontWeight: 600 }}>
                  {alert.details.trend}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button className="bg-[#3498db] hover:bg-[#2980b9] text-white text-[13px] h-9">
              Create Restock Order
            </Button>
            <Button variant="outline" className="border-[#e5e7eb] hover:bg-white text-[13px] h-9">
              Mute this alert
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
