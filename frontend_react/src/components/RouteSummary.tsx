import { MapPin } from "lucide-react";

interface RouteSummaryProps {
  hasSearched: boolean;
}

export function RouteSummary({ hasSearched }: RouteSummaryProps) {
  if (!hasSearched) {
    return null;
  }

  const route = [
    { aisle: 3, section: "Drinks" },
    { aisle: 5, section: "Pasta & Sauces" },
    { aisle: 7, section: "Spreads & Condiments" },
    { aisle: 2, section: "Dairy & Eggs" },
  ];

  return (
    <div className="max-w-[1000px] mx-auto mt-6">
      <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-[#3498db]" />
          <h3 className="text-[18px] text-[#111827]" style={{ fontWeight: 700 }}>
            Suggested route
          </h3>
        </div>

        <ol className="space-y-3">
          {route.map((stop, index) => (
            <li key={index} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#eff6ff] flex items-center justify-center flex-shrink-0">
                <span className="text-[14px] text-[#3498db]" style={{ fontWeight: 700 }}>
                  {index + 1}
                </span>
              </div>
              <div>
                <p className="text-[14px] text-[#111827]">
                  <span style={{ fontWeight: 600 }}>Aisle {stop.aisle}</span> – {stop.section}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-5 pt-5 border-t border-[#e5e7eb]">
          <p className="text-[13px] text-[#6b7280]">
            Follow this route for the most efficient shopping experience. Ask a store associate if you need help!
          </p>
        </div>
      </div>
    </div>
  );
}
