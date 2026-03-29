import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/context/CartContext";
import { CATEGORIES, SAMPLE_PRODUCTS } from "@/data/sampleProducts";
import type { SampleProduct } from "@/data/sampleProducts";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A\u2013Z" },
];

export function StorefrontPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const { addItem } = useCart();

  const filtered = useMemo(() => {
    let products = SAMPLE_PRODUCTS;
    if (category !== "All")
      products = products.filter((p) => p.category === category);
    if (search.trim())
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()),
      );
    if (sort === "price-asc")
      products = [...products].sort((a, b) => a.priceInCents - b.priceInCents);
    if (sort === "price-desc")
      products = [...products].sort((a, b) => b.priceInCents - a.priceInCents);
    if (sort === "name-asc")
      products = [...products].sort((a, b) => a.name.localeCompare(b.name));
    return products;
  }, [search, category, sort]);

  const handleAddToCart = (product: SampleProduct) => {
    addItem({
      productId: BigInt(product.id),
      productName: product.name,
      priceInCents: BigInt(product.priceInCents),
      imageUrl: product.imageUrl,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Page Header */}
      <section
        className="bg-secondary border-b border-border py-10"
        data-ocid="storefront.section"
      >
        <div className="mx-auto max-w-container px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-foreground mb-1">
            Storefront
          </h1>
          <p className="text-muted-foreground">
            Discover products from trusted sellers
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-container px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="storefront.search_input"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger
              className="w-full sm:w-44"
              data-ocid="storefront.select"
            >
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger
              className="w-full sm:w-48"
              data-ocid="storefront.select"
            >
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                category === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
              data-ocid="storefront.tab"
            >
              {c}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-5">
          Showing{" "}
          <span className="font-medium text-foreground">{filtered.length}</span>{" "}
          products
          {category !== "All" && (
            <>
              {" "}
              in <span className="font-medium text-foreground">{category}</span>
            </>
          )}
        </p>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20" data-ocid="storefront.empty_state">
            <p className="text-muted-foreground">
              No products found. Try a different search or category.
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            data-ocid="storefront.list"
          >
            {filtered.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i + 1}
                onAddToCart={handleAddToCart}
              />
            ))}
          </motion.div>
        )}
      </section>
    </main>
  );
}
