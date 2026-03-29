import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useCreateCheckoutSession } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function CartPage() {
  const { items, removeItem, updateQuantity, totalCents } = useCart();
  const { mutateAsync: createSession, isPending } = useCreateCheckoutSession();
  const { identity, login } = useInternetIdentity();

  const handleCheckout = async () => {
    if (!identity) {
      login();
      return;
    }
    try {
      const shoppingItems = items.map((item) => ({
        productName: item.productName,
        currency: "usd",
        quantity: BigInt(item.quantity),
        priceInCents: item.priceInCents,
        productDescription: item.productName,
      }));
      const url = await createSession({
        items: shoppingItems,
        successUrl: `${window.location.origin}/shop?success=true`,
        cancelUrl: `${window.location.origin}/cart`,
      });
      window.location.href = url;
    } catch {
      toast.error("Checkout failed. Please try again.");
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center" data-ocid="cart.empty_state">
          <ShoppingBag className="h-16 w-16 text-muted mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Add some products to get started
          </p>
          <Link to="/shop">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="cart.primary_button"
            >
              Browse Products
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background" data-ocid="cart.section">
      <div className="mx-auto max-w-container px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/shop">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              data-ocid="cart.secondary_button"
            >
              <ArrowLeft className="h-4 w-4" /> Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4" data-ocid="cart.list">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Shopping Cart ({items.length})
            </h1>
            {items.map((item, i) => (
              <div
                key={item.productId.toString()}
                className="flex gap-4 p-4 bg-card border border-border rounded-xl"
                data-ocid={`cart.item.${i + 1}`}
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground truncate">
                    {item.productName}
                  </h3>
                  <p className="text-primary font-bold mt-1">
                    ${(Number(item.priceInCents) / 100).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      data-ocid={`cart.item.${i + 1}`}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium w-6 text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      data-ocid={`cart.item.${i + 1}`}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    data-ocid={`cart.delete_button.${i + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <p className="font-bold text-sm">
                    $
                    {(
                      (Number(item.priceInCents) / 100) *
                      item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div
              className="bg-card border border-border rounded-xl p-6 sticky top-24"
              data-ocid="cart.panel"
            >
              <h2 className="font-bold text-lg text-foreground mb-4">
                Order Summary
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    ${(totalCents / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-success">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">
                    ${((totalCents * 0.08) / 100).toFixed(2)}
                  </span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-bold text-base mb-6">
                <span>Total</span>
                <span>${((totalCents * 1.08) / 100).toFixed(2)}</span>
              </div>
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
                onClick={handleCheckout}
                disabled={isPending}
                data-ocid="cart.submit_button"
              >
                {isPending
                  ? "Processing..."
                  : identity
                    ? "Proceed to Checkout"
                    : "Sign in to Checkout"}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
