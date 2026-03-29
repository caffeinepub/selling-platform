import { Badge } from "@/components/ui/badge";

type OrderStatusType = "pending" | "fulfilled" | "cancelled";

export function OrderStatusBadge({ status }: { status: OrderStatusType }) {
  const config: Record<OrderStatusType, { label: string; className: string }> =
    {
      pending: {
        label: "Pending",
        className: "bg-warning/15 text-warning-foreground border-warning/30",
      },
      fulfilled: {
        label: "Fulfilled",
        className: "bg-success/15 text-success border-success/30",
      },
      cancelled: {
        label: "Cancelled",
        className: "bg-destructive/15 text-destructive border-destructive/30",
      },
    };
  const c = config[status] ?? config.pending;
  return (
    <Badge variant="outline" className={`text-xs font-medium ${c.className}`}>
      {c.label}
    </Badge>
  );
}
