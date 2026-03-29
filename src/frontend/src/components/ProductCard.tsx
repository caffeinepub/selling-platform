import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SampleProduct } from "@/data/sampleProducts";
import { Link } from "@tanstack/react-router";
import { ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  product: SampleProduct;
  index: number;
  onAddToCart: (product: SampleProduct) => void;
}

export function ProductCard({ product, index, onAddToCart }: ProductCardProps) {
  const price = (product.priceInCents / 100).toFixed(2);

  return (
    <div
      className="group bg-card border border-border rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5"
      data-ocid={`products.item.${index}`}
    >
      <Link to="/shop" className="block overflow-hidden">
        <div className="aspect-square overflow-hidden bg-secondary">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="p-4">
        <Badge variant="secondary" className="text-xs mb-2">
          {product.category}
        </Badge>
        <h3 className="font-semibold text-sm leading-tight text-foreground mb-1 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`h-3 w-3 ${s <= 4 ? "fill-warning text-warning" : "fill-muted text-muted"}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">(24)</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-base text-foreground">${price}</span>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3 text-xs"
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product);
            }}
            data-ocid={`products.item.${index}`}
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
