import { useState } from "react";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Mail, MessageSquare, Bell } from "lucide-react";

export function AlertSettings() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [lowStockThreshold, setLowStockThreshold] = useState([40]);
  const [criticalStockUnits, setCriticalStockUnits] = useState("5");
  const [storeHoursOnly, setStoreHoursOnly] = useState(false);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e5e7eb]">
      <h3 className="text-[20px] text-[#1f2933] mb-6" style={{ fontWeight: 700 }}>
        Alert Settings
      </h3>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Column: Notification Channels */}
        <div>
          <h4 className="text-[14px] text-[#1f2933] mb-4" style={{ fontWeight: 600 }}>
            Notification Channels
          </h4>
          
          <div className="space-y-4">
            {/* Email Alerts */}
            <div className="flex items-center justify-between py-3 border-b border-[#e5e7eb]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#3498db]" />
                </div>
                <div>
                  <p className="text-[14px] text-[#1f2933]" style={{ fontWeight: 600 }}>
                    Email Alerts
                  </p>
                  <p className="text-[12px] text-[#6b7280]">
                    Receive alerts via email
                  </p>
                </div>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </div>

            {/* SMS Alerts */}
            <div className="flex items-center justify-between py-3 border-b border-[#e5e7eb]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-[14px] text-[#1f2933]" style={{ fontWeight: 600 }}>
                    SMS Alerts
                  </p>
                  <p className="text-[12px] text-[#6b7280]">
                    Receive alerts via text message
                  </p>
                </div>
              </div>
              <Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} />
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-[14px] text-[#1f2933]" style={{ fontWeight: 600 }}>
                    Push Notifications
                  </p>
                  <p className="text-[12px] text-[#6b7280]">
                    Receive browser push notifications
                  </p>
                </div>
              </div>
              <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
            </div>
          </div>
        </div>

        {/* Right Column: Thresholds */}
        <div>
          <h4 className="text-[14px] text-[#1f2933] mb-4" style={{ fontWeight: 600 }}>
            Alert Thresholds
          </h4>
          
          <div className="space-y-6">
            {/* Low Stock Threshold */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[13px] text-[#1f2933]" style={{ fontWeight: 600 }}>
                  Low Stock Threshold (%)
                </label>
                <span className="text-[14px] text-[#3498db]" style={{ fontWeight: 700 }}>
                  {lowStockThreshold[0]}%
                </span>
              </div>
              <Slider
                value={lowStockThreshold}
                onValueChange={setLowStockThreshold}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-[11px] text-[#6b7280] mt-2">
                Alert when stock falls below this percentage of capacity
              </p>
            </div>

            {/* Critical Stock Threshold */}
            <div>
              <label className="text-[13px] text-[#1f2933] mb-2 block" style={{ fontWeight: 600 }}>
                Critical Stock Threshold (units)
              </label>
              <Input
                type="number"
                value={criticalStockUnits}
                onChange={(e) => setCriticalStockUnits(e.target.value)}
                className="h-10 text-[13px] border-[#e5e7eb]"
                placeholder="Enter number of units"
              />
              <p className="text-[11px] text-[#6b7280] mt-2">
                Trigger critical alert when stock reaches this number
              </p>
            </div>

            {/* Store Hours Only */}
            <div className="flex items-start space-x-3 pt-2">
              <Checkbox
                id="storeHours"
                checked={storeHoursOnly}
                onCheckedChange={(checked) => setStoreHoursOnly(checked as boolean)}
              />
              <div className="flex-1">
                <label
                  htmlFor="storeHours"
                  className="text-[13px] text-[#1f2933] cursor-pointer block"
                  style={{ fontWeight: 600 }}
                >
                  Only alert during store hours
                </label>
                <p className="text-[11px] text-[#6b7280] mt-1">
                  Suppress non-critical alerts outside of business hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
