import { useEffect, useState } from "react";
import { AlertCard } from "./AlertCard";
import { fetchAlerts } from "../services/api";

export function ActiveAlertsList() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const data = await fetchAlerts(false); // Get unresolved alerts

        // Transform backend alerts to component format
        const transformedAlerts = data.map(alert => ({
          id: alert.id.toString(),
          type: alert.stock_count === 0 ? "out" as const : "low" as const,
          severity: alert.severity.toLowerCase() as "critical" | "warning",
          product: alert.product_name,
          message: alert.message,
          timestamp: getRelativeTime(alert.created_at),
          details: {
            shelf: alert.shelf_id,
            price: `$${(alert.threshold * 2).toFixed(2)}`, // Estimate price
            currentStock: alert.stock_count,
            trend: alert.stock_count === 0 ? "-100%" : "-50%"
          }
        }));

        setAlerts(transformedAlerts);
      } catch (error) {
        console.error("Failed to load alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, []);

  // Helper function to convert timestamp to relative time
  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs} hr ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-[#6b7280]">
        Loading alerts...
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center border border-[#e5e7eb]">
        <p className="text-[#6b7280]">No active alerts</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <AlertCard key={alert.id} alert={alert} />
      ))}
    </div>
  );
}
