import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Order, OrderStatus, Product, Review } from "../backend.d";
import { useActor } from "./useActor";

export function useAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAvailableProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchProducts(term: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "search", term],
    queryFn: async () => {
      if (!actor) return [];
      if (!term.trim()) return actor.getAllAvailableProducts();
      return actor.searchProducts(term);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProductsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      if (!actor) return [];
      if (!category || category === "all")
        return actor.getAllAvailableProducts();
      return actor.getActiveProductsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProduct(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Product | null>({
    queryKey: ["product", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useProductReviews(productId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Review[]>({
    queryKey: ["reviews", productId?.toString()],
    queryFn: async () => {
      if (!actor || productId === null) return [];
      return actor.getReviewsByProduct(productId);
    },
    enabled: !!actor && !isFetching && productId !== null,
  });
}

export function useCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSellerProducts(sellerId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["sellerProducts", sellerId],
    queryFn: async () => {
      if (!actor || !sellerId) return [];
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.getProductsBySeller(Principal.fromText(sellerId));
    },
    enabled: !!actor && !isFetching && !!sellerId,
  });
}

export function useAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["allOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBuyerOrders(buyerId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["buyerOrders", buyerId],
    queryFn: async () => {
      if (!actor || !buyerId) return [];
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.getOrdersByBuyer(Principal.fromText(buyerId));
    },
    enabled: !!actor && !isFetching && !!buyerId,
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: { orderId: bigint; status: OrderStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allOrders"] });
    },
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: any) => {
      if (!actor) throw new Error("Not connected");
      // @ts-ignore - ExternalBlob types compatible at runtime
      return actor.addProduct(product);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["sellerProducts"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, product }: { id: bigint; product: any }) => {
      if (!actor) throw new Error("Not connected");
      // @ts-ignore - ExternalBlob types compatible at runtime
      return actor.updateProduct(id, product);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["sellerProducts"] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteProduct(productId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["sellerProducts"] });
    },
  });
}

export function useLeaveReview() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      rating,
      comment,
    }: { productId: bigint; rating: bigint; comment: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.leaveReview(productId, rating, comment);
    },
    onSuccess: (_d, { productId }) => {
      qc.invalidateQueries({ queryKey: ["reviews", productId.toString()] });
    },
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      items,
      successUrl,
      cancelUrl,
    }: {
      items: Array<{
        productName: string;
        currency: string;
        quantity: bigint;
        priceInCents: bigint;
        productDescription: string;
      }>;
      successUrl: string;
      cancelUrl: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createCheckoutSession(items, successUrl, cancelUrl);
    },
  });
}
