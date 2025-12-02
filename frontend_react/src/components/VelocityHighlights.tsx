import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

export function VelocityHighlights() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Biggest Increase */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e5e7eb]">
        <div className="flex items-start justify-between mb-3">
          <div className="bg-green-50 rounded-lg p-3">
            <ArrowUpCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
        
        <p className="text-[12px] text-[#6b7280] mb-1" style={{ fontWeight: 600 }}>
          BIGGEST INCREASE
        </p>
        <h4 className="text-[18px] text-[#1f2933] mb-2" style={{ fontWeight: 700 }}>
          Organic Trail Mix
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-[24px] text-green-600" style={{ fontWeight: 700 }}>
            +200%
          </span>
          <ArrowUpCircle className="w-5 h-5 text-green-600" />
        </div>
        <p className="text-[12px] text-[#6b7280] mt-2">
          +8 units over the last 7 days
        </p>
      </div>

      {/* Biggest Decrease */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e5e7eb]">
        <div className="flex items-start justify-between mb-3">
          <div className="bg-red-50 rounded-lg p-3">
            <ArrowDownCircle className="w-6 h-6 text-red-600" />
          </div>
        </div>
        
        <p className="text-[12px] text-[#6b7280] mb-1" style={{ fontWeight: 600 }}>
          BIGGEST DECREASE
        </p>
        <h4 className="text-[18px] text-[#1f2933] mb-2" style={{ fontWeight: 700 }}>
          Artisan Sourdough Bread
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-[24px] text-red-600" style={{ fontWeight: 700 }}>
            -100%
          </span>
          <ArrowDownCircle className="w-5 h-5 text-red-600" />
        </div>
        <p className="text-[12px] text-[#6b7280] mt-2">
          -8 units over the last 7 days
        </p>
      </div>
    </div>
  );
}
