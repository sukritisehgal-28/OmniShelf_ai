import { NavLink } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface TabItem {
  label: string;
  to: string;
  icon: LucideIcon;
  variant: "admin" | "user";
}

interface TabBarProps {
  tabs: TabItem[];
}

export function TabBar({ tabs }: TabBarProps) {
  return (
    <div className="w-full flex justify-center">
      <div className="flex gap-2 overflow-x-auto px-4 py-3">
        {tabs.map(({ label, to, icon: Icon, variant }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border",
                isActive
                  ? variant === "admin"
                    ? "bg-gradient-to-r from-[#2563eb] to-[#4f46e5] text-white shadow-lg border-transparent"
                    : "bg-gradient-to-r from-[#16a34a] to-[#22c55e] text-white shadow-lg border-transparent"
                  : "bg-white/60 border-slate-200 text-slate-500 hover:text-slate-700",
              ].join(" ")
            }
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
