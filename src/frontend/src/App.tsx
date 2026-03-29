import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import { CartPage } from "@/pages/CartPage";
import { LandingPage } from "@/pages/LandingPage";
import { SellerDashboard } from "@/pages/SellerDashboard";
import { StorefrontPage } from "@/pages/StorefrontPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </div>
      <Toaster richColors position="top-right" />
    </CartProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop",
  component: StorefrontPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: SellerDashboard,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  shopRoute,
  cartRoute,
  dashboardRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
