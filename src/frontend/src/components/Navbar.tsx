import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useMyProfile } from "@/hooks/useQueries";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, Search, ShoppingCart, Store, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: profile } = useMyProfile();
  const location = useLocation();
  const isLoggedIn = !!identity;

  const navLinks = [
    { label: "Storefront", to: "/shop" },
    { label: "Products", to: "/shop" },
    { label: "Pricing", to: "/" },
  ];

  const isSeller = profile?.role === "seller" || profile?.role === "admin";

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm"
      data-ocid="navbar.panel"
    >
      <div className="mx-auto max-w-container px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0"
            data-ocid="navbar.link"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              S
            </div>
            <span className="font-bold text-sm tracking-wide text-foreground uppercase hidden sm:block">
              Selling Platform
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === link.to
                    ? "text-primary bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
                data-ocid="navbar.link"
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn && isSeller && (
              <Link
                to="/dashboard"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === "/dashboard"
                    ? "text-primary bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
                data-ocid="navbar.link"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <Link to="/shop" data-ocid="navbar.link">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Search className="h-4 w-4" />
              </Button>
            </Link>

            <Link to="/cart" className="relative" data-ocid="cart.link">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {isLoggedIn ? (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {profile?.name || "User"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clear}
                  data-ocid="auth.secondary_button"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={login}
                  disabled={isLoggingIn}
                  data-ocid="auth.secondary_button"
                >
                  Sign in
                </Button>
                <Button
                  size="sm"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  data-ocid="auth.primary_button"
                >
                  Get Started Free
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-ocid="navbar.toggle"
            >
              {mobileOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md"
              onClick={() => setMobileOpen(false)}
              data-ocid="navbar.link"
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn && isSeller && (
            <Link
              to="/dashboard"
              className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md"
              onClick={() => setMobileOpen(false)}
              data-ocid="navbar.link"
            >
              Dashboard
            </Link>
          )}
          <div className="pt-2 flex flex-col gap-2">
            {isLoggedIn ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  clear();
                  setMobileOpen(false);
                }}
                data-ocid="auth.secondary_button"
              >
                Sign Out
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    login();
                    setMobileOpen(false);
                  }}
                  data-ocid="auth.secondary_button"
                >
                  Sign in
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    login();
                    setMobileOpen(false);
                  }}
                  className="bg-primary text-primary-foreground"
                  data-ocid="auth.primary_button"
                >
                  Get Started Free
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
