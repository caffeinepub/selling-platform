import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ShoppingCart {
    id: CartId;
    ownerId: Principal;
    createdAt: Time;
    isActive: boolean;
    items: Array<ShoppingCartItem>;
}
export interface Review {
    id: ReviewId;
    createdAt: Time;
    productId: ProductId;
    reviewerId: Principal;
    comment: string;
    rating: bigint;
}
export interface Product {
    id: ProductId;
    name: string;
    createdAt: Time;
    description: string;
    isActive: boolean;
    category: string;
    sellerId: Principal;
    inventoryCount: bigint;
    image: ExternalBlob;
    priceInCents: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export type OrderId = bigint;
export type CartId = bigint;
export interface Order {
    id: OrderId;
    status: OrderStatus;
    total: bigint;
    createdAt: Time;
    lastUpdated: Time;
    buyerId: Principal;
    shippingAddress: string;
    items: Array<ShoppingCartItem>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingCartItem {
    priceSnapshotInCents: bigint;
    productId: ProductId;
    quantity: bigint;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export type ReviewId = bigint;
export type ProductId = bigint;
export interface UserProfile {
    name: string;
    role: string;
}
export enum OrderStatus {
    cancelled = "cancelled",
    pending = "pending",
    fulfilled = "fulfilled"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCategory(category: string): Promise<void>;
    addItemToCart(cartId: CartId, item: ShoppingCartItem): Promise<void>;
    addProduct(product: Product): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(cartId: CartId): Promise<void>;
    createCart(): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createOrder(buyerId: Principal, cartId: CartId, shippingAddress: string): Promise<void>;
    deleteCart(cartId: CartId): Promise<void>;
    deleteProduct(productId: ProductId): Promise<void>;
    deleteReview(reviewId: ReviewId): Promise<void>;
    getActiveProductsByCategory(category: string): Promise<Array<Product>>;
    getAllAvailableProducts(): Promise<Array<Product>>;
    getAllCategories(): Promise<Array<string>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getAllReviews(): Promise<Array<Review>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(cartId: CartId): Promise<ShoppingCart>;
    getOrder(orderId: OrderId): Promise<Order>;
    getOrdersByBuyer(buyerId: Principal): Promise<Array<Order>>;
    getOrdersByProduct(productId: ProductId): Promise<Array<Order>>;
    getProduct(productId: ProductId): Promise<Product>;
    /**
     * / ***********************************************
     * /    * UTILITY FUNCTIONS                              *
     * /    ************************************************
     */
    getProductById(productId: ProductId): Promise<Product>;
    getProductPrice(productId: ProductId): Promise<bigint>;
    getProductsBySeller(sellerId: Principal): Promise<Array<Product>>;
    getRecentOrders(limit: bigint): Promise<Array<Order>>;
    getReviewsByProduct(productId: ProductId): Promise<Array<Review>>;
    getReviewsByReviewer(reviewerId: Principal): Promise<Array<Review>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    /**
     * / ***********************************************
     * /    * USER PROFILES                                  *
     * /    ************************************************
     */
    isCallerAdmin(): Promise<boolean>;
    isProductInStock(productId: ProductId): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    leaveReview(productId: ProductId, rating: bigint, comment: string): Promise<void>;
    removeCategory(category: string): Promise<void>;
    removeItemFromCart(cartId: CartId, productId: ProductId): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    /**
     * / ***********************************************
     * /    * SEARCH & FILTERS                               *
     * /    ************************************************
     */
    searchProducts(searchTerm: string): Promise<Array<Product>>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateOrderStatus(orderId: OrderId, status: OrderStatus): Promise<void>;
    updateProduct(productId: ProductId, product: Product): Promise<void>;
}
