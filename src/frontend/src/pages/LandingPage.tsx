import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { SAMPLE_PRODUCTS } from "@/data/sampleProducts";
import type { SampleProduct } from "@/data/sampleProducts";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  ChevronRight,
  Globe,
  Package,
  Shield,
  ShoppingBag,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

const FEATURES = [
  {
    icon: ShoppingBag,
    title: "Instant Storefront",
    desc: "Launch a beautiful online store in minutes with our pre-built templates and drag-and-drop editor.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    desc: "Real-time dashboards showing revenue, traffic, conversion rates, and customer behavior insights.",
  },
  {
    icon: Package,
    title: "Inventory Control",
    desc: "Manage stock levels, get low-inventory alerts, and sync across all sales channels automatically.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    desc: "PCI-compliant Stripe integration supporting 135+ currencies and all major payment methods worldwide.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "CDN-powered storefronts with sub-second load times ensuring higher conversions and happy customers.",
  },
  {
    icon: Globe,
    title: "Sell Everywhere",
    desc: "Connect your store to social media, marketplaces, and retail channels from a single dashboard.",
  },
];

const STATS = [
  { value: "50K+", label: "Active Sellers" },
  { value: "$2.4B", label: "Total Sales" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9\u2605", label: "Avg. Rating" },
];

const BAR_DATA = [
  { day: "Mar 18", h: 60 },
  { day: "Mar 19", h: 45 },
  { day: "Mar 20", h: 80 },
  { day: "Mar 21", h: 55 },
  { day: "Mar 22", h: 90 },
  { day: "Mar 23", h: 70 },
  { day: "Mar 24", h: 100 },
  { day: "Mar 25", h: 65 },
  { day: "Mar 26", h: 85 },
  { day: "Mar 27", h: 75 },
  { day: "Mar 28", h: 95 },
  { day: "Mar 29", h: 88 },
];

export function LandingPage() {
  const { addItem } = useCart();

  const handleAddToCart = (product: SampleProduct) => {
    addItem({
      productId: BigInt(product.id),
      productName: product.name,
      priceInCents: BigInt(product.priceInCents),
      imageUrl: product.imageUrl,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <main>
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-background pt-16 pb-20"
        data-ocid="hero.section"
      >
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                \uD83D\uDE80 New: AI-Powered Product Descriptions
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-foreground mb-5">
                Launch Your Online Store.
                <br />
                <span className="text-primary">Sell Everywhere.</span>
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-md">
                The all-in-one ecommerce platform for ambitious entrepreneurs.
                Create your store, manage products, process payments, and scale
                \u2014 all in one place.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/shop">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                    data-ocid="hero.primary_button"
                  >
                    Start Selling <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/shop">
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2"
                    data-ocid="hero.secondary_button"
                  >
                    Explore Platform <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 mt-8">
                <div className="flex -space-x-2">
                  {["A", "B", "C", "D"].map((letter) => (
                    <div
                      key={letter}
                      className="h-7 w-7 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-bold text-primary"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">50,000+</span>{" "}
                  sellers trust us
                </p>
              </div>
            </motion.div>

            {/* Right */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 -z-10">
                <svg
                  viewBox="0 0 600 450"
                  className="w-full h-full"
                  fill="none"
                  aria-hidden="true"
                >
                  <polygon
                    points="120,0 600,0 600,450 0,350"
                    fill="oklch(0.55 0.185 253 / 0.12)"
                  />
                  <polygon
                    points="200,0 600,0 600,450 80,450"
                    fill="oklch(0.55 0.185 253 / 0.08)"
                  />
                </svg>
              </div>
              <img
                src="/assets/generated/hero-devices.dim_600x450.png"
                alt="Selling Platform dashboard preview"
                className="w-full rounded-2xl shadow-card-hover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-primary py-10">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <p className="text-2xl font-extrabold text-primary-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-primary-foreground/70">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-background py-20" data-ocid="features.section">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
              Features
            </Badge>
            <h2 className="text-3xl font-bold text-foreground">
              Features Built for Growth
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Everything you need to start, run, and grow your online business
              \u2014 no technical skills required.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-6 rounded-xl border border-border bg-card hover:shadow-card transition-shadow"
                data-ocid={`features.item.${i + 1}`}
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feat.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid Preview */}
      <section className="bg-secondary py-20" data-ocid="products.section">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <Badge className="mb-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                Marketplace
              </Badge>
              <h2 className="text-3xl font-bold text-foreground">
                Product Listings & Management
              </h2>
              <p className="text-muted-foreground mt-2">
                Showcase and manage your inventory with our powerful product
                tools.
              </p>
            </div>
            <Link to="/shop">
              <Button
                variant="default"
                className="bg-primary text-primary-foreground hover:bg-primary/90 hidden sm:flex"
                data-ocid="products.primary_button"
              >
                Browse All Products
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SAMPLE_PRODUCTS.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i + 1}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/shop">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid="products.secondary_button"
              >
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Seller Dashboard Preview */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                Dashboard
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Seller Dashboard & Tools
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Get a bird's-eye view of your business with our intuitive
                analytics dashboard. Track revenue, monitor orders, and
                understand customer behavior \u2014 all in real-time.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Revenue tracking & forecasting",
                  "Inventory management alerts",
                  "Customer lifetime value",
                  "Order fulfillment pipeline",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/dashboard">
                <Button
                  variant="outline"
                  className="gap-2"
                  data-ocid="dashboard.secondary_button"
                >
                  Learn more <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border bg-card p-5 shadow-card-hover"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-sm">Revenue Overview</span>
                <Badge variant="secondary" className="text-xs">
                  This Month
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Revenue", value: "$12,430" },
                  { label: "Orders", value: "284" },
                  { label: "Customers", value: "1,847" },
                ].map((m) => (
                  <div key={m.label} className="bg-secondary rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                    <p className="text-lg font-bold mt-0.5">{m.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-end gap-1.5 h-20">
                {BAR_DATA.map((bar) => (
                  <div
                    key={bar.day}
                    className="flex-1 rounded-sm bg-primary/20 relative"
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-primary rounded-sm transition-all"
                      style={{ height: `${bar.h}%` }}
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Daily revenue \u2014 last 12 days
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Orders Preview */}
      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border bg-card overflow-hidden shadow-card-hover order-2 lg:order-1"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <span className="font-semibold text-sm">Recent Orders</span>
                <Badge variant="secondary" className="text-xs">
                  Live
                </Badge>
              </div>
              <table className="w-full text-xs">
                <thead className="bg-secondary">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                      Order
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                      Customer
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                      Total
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: "#1042",
                      customer: "Sarah M.",
                      total: "$89.99",
                      status: "fulfilled",
                    },
                    {
                      id: "#1041",
                      customer: "James T.",
                      total: "$234.00",
                      status: "fulfilled",
                    },
                    {
                      id: "#1040",
                      customer: "Emily R.",
                      total: "$49.99",
                      status: "pending",
                    },
                    {
                      id: "#1039",
                      customer: "Chris L.",
                      total: "$159.50",
                      status: "fulfilled",
                    },
                  ].map((order, i) => (
                    <tr
                      key={order.id}
                      className="border-t border-border"
                      data-ocid={`orders.row.${i + 1}`}
                    >
                      <td className="px-4 py-3 font-medium">{order.id}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {order.customer}
                      </td>
                      <td className="px-4 py-3 font-medium">{order.total}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            order.status === "fulfilled"
                              ? "bg-success/15 text-success"
                              : "bg-warning/15 text-warning-foreground"
                          }`}
                        >
                          {order.status === "fulfilled"
                            ? "Fulfilled"
                            : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            <div className="order-1 lg:order-2">
              <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                Orders
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Manage Orders Seamlessly
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Stay on top of every sale with our powerful order management
                system. Update statuses, process refunds, and communicate with
                customers \u2014 all without leaving your dashboard.
              </p>
              <Link to="/dashboard">
                <Button
                  variant="outline"
                  className="gap-2"
                  data-ocid="orders.secondary_button"
                >
                  Learn more <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Ready to Start Selling?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join 50,000+ sellers who use Selling Platform to grow their
              business. No credit card required.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/shop">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90"
                  data-ocid="cta.primary_button"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link to="/shop">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-primary-foreground hover:bg-white/10"
                  data-ocid="cta.secondary_button"
                >
                  View Demo Store
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
