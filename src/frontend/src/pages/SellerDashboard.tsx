import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, SAMPLE_PRODUCTS } from "@/data/sampleProducts";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useAllOrders, useUpdateOrderStatus } from "@/hooks/useQueries";
import {
  DollarSign,
  Edit,
  Loader2,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { OrderStatus } from "../backend.d";

const MOCK_STATS = [
  { icon: DollarSign, label: "Revenue", value: "$12,430", change: "+18%" },
  { icon: Package, label: "Products", value: "24", change: "+2" },
  { icon: ShoppingBag, label: "Orders", value: "284", change: "+32" },
  { icon: TrendingUp, label: "Conversion", value: "3.8%", change: "+0.4%" },
];

const MOCK_ORDERS = [
  {
    id: BigInt(1042),
    customer: "Sarah Mitchell",
    product: "ProSound Headphones",
    total: 129.99,
    status: "fulfilled" as const,
    date: "Mar 28, 2026",
  },
  {
    id: BigInt(1041),
    customer: "James Thompson",
    product: "Vortex Smart Watch",
    total: 199.99,
    status: "fulfilled" as const,
    date: "Mar 27, 2026",
  },
  {
    id: BigInt(1040),
    customer: "Emily Rodriguez",
    product: "Apex Running Jacket",
    total: 84.99,
    status: "pending" as const,
    date: "Mar 27, 2026",
  },
  {
    id: BigInt(1039),
    customer: "Chris Liu",
    product: "TrailBlazer Bottle",
    total: 34.99,
    status: "fulfilled" as const,
    date: "Mar 26, 2026",
  },
  {
    id: BigInt(1038),
    customer: "Maria Garcia",
    product: "Nordic Coffee Mug",
    total: 24.99,
    status: "cancelled" as const,
    date: "Mar 25, 2026",
  },
];

interface ProductFormData {
  name: string;
  description: string;
  priceInCents: string;
  category: string;
  inventoryCount: string;
}

const EMPTY_FORM: ProductFormData = {
  name: "",
  description: "",
  priceInCents: "",
  category: "",
  inventoryCount: "",
};

export function SellerDashboard() {
  const { identity, login } = useInternetIdentity();
  const [products, setProducts] = useState(SAMPLE_PRODUCTS.slice(0, 4));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState(MOCK_ORDERS);

  if (!identity) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Seller Dashboard
          </h2>
          <p className="text-muted-foreground mb-6">
            Sign in to access your seller dashboard and manage your products and
            orders.
          </p>
          <Button
            onClick={login}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="dashboard.primary_button"
          >
            Sign In to Continue
          </Button>
        </div>
      </main>
    );
  }

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };
  const openEdit = (p: (typeof SAMPLE_PRODUCTS)[0]) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      priceInCents: String(p.priceInCents),
      category: p.category,
      inventoryCount: String(p.inventoryCount),
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.priceInCents) {
      toast.error("Name and price are required.");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    if (editId !== null) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editId
            ? {
                ...p,
                ...form,
                priceInCents: Number(form.priceInCents),
                inventoryCount: Number(form.inventoryCount),
              }
            : p,
        ),
      );
      toast.success("Product updated successfully!");
    } else {
      const newId = Date.now();
      setProducts((prev) => [
        ...prev,
        {
          id: newId,
          ...form,
          priceInCents: Number(form.priceInCents),
          inventoryCount: Number(form.inventoryCount),
          imageUrl: "/assets/generated/product-book.dim_400x400.jpg",
          seller: "You",
        },
      ]);
      toast.success("Product created successfully!");
    }
    setSaving(false);
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product deleted.");
  };

  const handleStatusChange = (
    orderId: bigint,
    status: "pending" | "fulfilled" | "cancelled",
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );
    toast.success(`Order status updated to ${status}`);
  };

  return (
    <main className="min-h-screen bg-secondary" data-ocid="dashboard.section">
      <div className="mx-auto max-w-container px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Seller Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your products, orders, and store performance
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {MOCK_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-card border border-border rounded-xl p-5"
              data-ocid={`dashboard.card.${i + 1}`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-success mt-1">
                {stat.change} this month
              </p>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="products">
          <TabsList className="mb-6" data-ocid="dashboard.tab">
            <TabsTrigger value="products" data-ocid="dashboard.tab">
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" data-ocid="dashboard.tab">
              Orders
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <div
              className="bg-card border border-border rounded-xl overflow-hidden"
              data-ocid="dashboard.table"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold">My Products</h2>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1"
                  onClick={openAdd}
                  data-ocid="dashboard.primary_button"
                >
                  <Plus className="h-4 w-4" /> Add Product
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Inventory</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-10 text-muted-foreground"
                          data-ocid="dashboard.empty_state"
                        >
                          No products yet. Add your first product!
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((p, i) => (
                        <TableRow
                          key={p.id}
                          data-ocid={`dashboard.row.${i + 1}`}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                              <span className="font-medium text-sm">
                                {p.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {p.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            ${(p.priceInCents / 100).toFixed(2)}
                          </TableCell>
                          <TableCell>{p.inventoryCount}</TableCell>
                          <TableCell>
                            <Badge className="bg-success/15 text-success border-success/30 text-xs">
                              Active
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => openEdit(p)}
                                data-ocid={`dashboard.edit_button.${i + 1}`}
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleDelete(p.id)}
                                data-ocid={`dashboard.delete_button.${i + 1}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold">Recent Orders</h2>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order, i) => (
                      <TableRow
                        key={order.id.toString()}
                        data-ocid={`orders.row.${i + 1}`}
                      >
                        <TableCell className="font-medium">
                          #{order.id.toString()}
                        </TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {order.product}
                        </TableCell>
                        <TableCell className="font-medium">
                          ${order.total.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {order.date}
                        </TableCell>
                        <TableCell>
                          <OrderStatusBadge status={order.status} />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(v) =>
                              handleStatusChange(
                                order.id,
                                v as "pending" | "fulfilled" | "cancelled",
                              )
                            }
                          >
                            <SelectTrigger
                              className="h-8 w-32 text-xs"
                              data-ocid={`orders.row.${i + 1}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="fulfilled">
                                Fulfilled
                              </SelectItem>
                              <SelectItem value="cancelled">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg" data-ocid="dashboard.dialog">
          <DialogHeader>
            <DialogTitle>
              {editId !== null ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="prod-name" className="mb-1 block text-sm">
                Product Name *
              </Label>
              <Input
                id="prod-name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Wireless Headphones"
                data-ocid="dashboard.input"
              />
            </div>
            <div>
              <Label htmlFor="prod-desc" className="mb-1 block text-sm">
                Description
              </Label>
              <Textarea
                id="prod-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Describe your product..."
                rows={3}
                data-ocid="dashboard.textarea"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="prod-price" className="mb-1 block text-sm">
                  Price (cents) *
                </Label>
                <Input
                  id="prod-price"
                  type="number"
                  value={form.priceInCents}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, priceInCents: e.target.value }))
                  }
                  placeholder="e.g. 9999"
                  data-ocid="dashboard.input"
                />
              </div>
              <div>
                <Label htmlFor="prod-inv" className="mb-1 block text-sm">
                  Inventory
                </Label>
                <Input
                  id="prod-inv"
                  type="number"
                  value={form.inventoryCount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, inventoryCount: e.target.value }))
                  }
                  placeholder="e.g. 100"
                  data-ocid="dashboard.input"
                />
              </div>
            </div>
            <div>
              <Label className="mb-1 block text-sm">Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              >
                <SelectTrigger data-ocid="dashboard.select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="dashboard.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="dashboard.save_button"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : editId !== null ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
