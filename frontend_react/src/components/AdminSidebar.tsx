import { Package, LayoutDashboard, BarChart3, Bell, ShoppingCart, User } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface AdminSidebarProps {
  activePage?: string;
  onNavigate?: (page: string) => void;
}

export function AdminSidebar({ activePage = "overview", onNavigate }: AdminSidebarProps) {
  const navItems = [
    { id: "overview", label: "Store Overview & Alerts", icon: LayoutDashboard },
    { id: "dashboard", label: "Store Dashboard", icon: BarChart3 },
    { id: "analytics", label: "Analytics Dashboard", icon: BarChart3 },
    { id: "alerts", label: "Alerts & Notifications", icon: Bell },
    { id: "smartcart", label: "SmartCart Assistant", icon: ShoppingCart },
  ];

  return (
    <aside className="w-[280px] h-screen bg-[#2c3e50] flex flex-col sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-[#34495e]">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate?.("home")}>
          <Package className="w-7 h-7 text-white" />
          <span className="text-[20px] text-white" style={{ fontWeight: 700 }}>
            OmniShelf AI
          </span>
        </div>
      </div>

      {/* Admin Profile */}
      <div className="p-6 border-b border-[#34495e]">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-[#3498db] text-white">
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-[11px] text-[#95a5a6]" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Admin
            </span>
            <span className="text-[14px] text-white" style={{ fontWeight: 600 }}>
              Store Manager
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate?.(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-[#3498db] text-white'
                      : 'text-[#bdc3c7] hover:bg-[#34495e] hover:text-white'
                    }
                  `}
                  style={{ fontWeight: isActive ? 600 : 400 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[14px]">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Bottom section */}
      <div className="p-6 border-t border-[#34495e]">
        <p className="text-[11px] text-[#7f8c8d]">
          OmniShelf AI v2.1.0
        </p>
      </div>
    </aside>
  );
}
