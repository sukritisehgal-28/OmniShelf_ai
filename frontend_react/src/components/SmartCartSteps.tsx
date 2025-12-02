import { ClipboardList, Database, MapPin } from "lucide-react";

export function SmartCartSteps() {
  const steps = [
    {
      icon: ClipboardList,
      text: "Paste your list"
    },
    {
      icon: Database,
      text: "We check live stock"
    },
    {
      icon: MapPin,
      text: "Follow your route"
    }
  ];

  return (
    <div className="flex items-center justify-center gap-12 mb-10">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={index} className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#eff6ff] flex items-center justify-center">
              <Icon className="w-6 h-6 text-[#3498db]" />
            </div>
            <p className="text-[14px] text-[#6b7280]">
              {step.text}
            </p>
            {index < steps.length - 1 && (
              <div className="w-8 h-[2px] bg-[#e5e7eb] ml-3"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
