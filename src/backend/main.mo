import Storage "blob-storage/Storage";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import List "mo:core/List";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  /*************************************************
   * USER PROFILES                                  *
   *************************************************/
  public type UserProfile = {
    name : Text;
    role : Text; // "buyer" or "seller"
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  /*************************************************
   * TYPES                                          *
   *************************************************/
  type ProductId = Nat;
  type CartId = Nat;
  type OrderId = Nat;
  type ReviewId = Nat;

  module Product {
    public type Product = {
      id : ProductId;
      sellerId : Principal;
      name : Text;
      description : Text;
      category : Text;
      priceInCents : Nat;
      inventoryCount : Nat;
      image : Storage.ExternalBlob;
      isActive : Bool;
      createdAt : Time.Time;
    };

    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Int.compare(product1.id, product2.id);
    };
  };

  module ShoppingCart {
    public type ShoppingCartItem = {
      productId : ProductId;
      quantity : Nat;
      priceSnapshotInCents : Nat;
    };

    public type ShoppingCart = {
      id : CartId;
      ownerId : Principal;
      items : [ShoppingCartItem];
      isActive : Bool;
      createdAt : Time.Time;
    };

    public func compare(cart1 : ShoppingCart, cart2 : ShoppingCart) : Order.Order {
      Int.compare(cart1.id, cart2.id);
    };
  };

  module Review {
    public type Review = {
      id : ReviewId;
      productId : ProductId;
      reviewerId : Principal;
      rating : Nat;
      comment : Text;
      createdAt : Time.Time;
    };

    public func compare(review1 : Review, review2 : Review) : Order.Order {
      Int.compare(review1.id, review2.id);
    };
  };

  module OrderInfo {
    public type OrderStatus = { #pending; #fulfilled; #cancelled };

    public type Order = {
      id : OrderId;
      buyerId : Principal;
      items : [ShoppingCart.ShoppingCartItem];
      total : Nat;
      shippingAddress : Text;
      status : OrderStatus;
      createdAt : Time.Time;
      lastUpdated : Time.Time;
    };

    public func compare(order1 : Order, order2 : Order) : Order.Order {
      Int.compare(order1.id, order2.id);
    };
  };

  /*************************************************
   * CATEGORIES                                     *
   *************************************************/
  let predefinedCategories = [
    "Apparel",
    "Electronics",
    "Home & Garden",
    "Beauty & Personal Care",
    "Sports & Outdoors",
    "Toys & Games",
  ];
  let customCategories = List.empty<Text>();

  public query func getAllCategories() : async [Text] {
    predefinedCategories.concat(customCategories.toArray());
  };

  public shared ({ caller }) func addCategory(category : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add categories");
    };
    customCategories.add(category);
  };

  public shared ({ caller }) func removeCategory(category : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove categories");
    };
    let filteredCategories = customCategories.filter(func(cat) { cat != category });
    customCategories.clear();
    customCategories.addAll(filteredCategories.values());
  };

  /*************************************************
   * PRODUCT MANAGEMENT                             *
   *************************************************/
  var nextProductId = 1;
  let products = Map.empty<ProductId, Product.Product>();

  public shared ({ caller }) func addProduct(product : Product.Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add products");
    };
    let newProduct : Product.Product = {
      product with
      id = nextProductId;
      sellerId = caller;
      createdAt = Time.now();
      isActive = true;
    };
    products.add(nextProductId, newProduct);
    nextProductId += 1;
  };

  public query ({ caller }) func getProductsBySeller(sellerId : Principal) : async [Product.Product] {
    let sellerProducts = products.values().toArray().filter(func(product) { product.sellerId == sellerId and product.isActive });
    sellerProducts;
  };

  public shared ({ caller }) func updateProduct(productId : ProductId, product : Product.Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only sellers can update products");
    };
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Could not find product with ID " # productId.toText()) };
      case (?existingProduct) {
        if (existingProduct.sellerId != caller) {
          Runtime.trap("Unauthorized: You can only update your own products");
        };
        products.add(productId, {
          product with
          id = existingProduct.id;
          sellerId = existingProduct.sellerId;
          createdAt = existingProduct.createdAt;
        });
      };
    };
  };

  public shared ({ caller }) func deleteProduct(productId : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only sellers can delete products");
    };
    switch (products.get(productId)) {
      case (null) {
        Runtime.trap("Could not find product with ID " # productId.toText());
      };
      case (?product) {
        if (product.sellerId != caller) {
          Runtime.trap("Unauthorized: You can only delete your own products");
        };
        products.remove(productId);
      };
    };
  };

  public query func getProduct(productId : ProductId) : async Product.Product {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Could not find product with ID " # productId.toText()) };
      case (?product) { product };
    };
  };

  public query func getAllProducts() : async [Product.Product] {
    products.values().toArray().sort();
  };

  public query func getAllAvailableProducts() : async [Product.Product] {
    let availableProducts = products.values().toArray().filter(func(product) { product.isActive });
    availableProducts;
  };

  public query func getActiveProductsByCategory(category : Text) : async [Product.Product] {
    let filteredProducts = products.values().toArray().filter(
      func(product) {
        product.category == category and product.isActive;
      }
    );
    filteredProducts.sort();
  };

  /*************************************************
   * SHOPPING CART                                  *
   *************************************************/
  var nextCartId = 1;
  let carts = Map.empty<CartId, ShoppingCart.ShoppingCart>();

  public shared ({ caller }) func createCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create carts");
    };
    let newCart : ShoppingCart.ShoppingCart = {
      id = nextCartId;
      ownerId = caller;
      items = [];
      isActive = true;
      createdAt = Time.now();
    };
    carts.add(nextCartId, newCart);
    nextCartId += 1;
  };

  public shared ({ caller }) func deleteCart(cartId : CartId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete carts");
    };
    switch (carts.get(cartId)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) {
        if (cart.ownerId != caller) {
          Runtime.trap("Unauthorized: You can only delete your own carts");
        };
        carts.remove(cartId);
      };
    };
  };

  public shared ({ caller }) func addItemToCart(cartId : CartId, item : ShoppingCart.ShoppingCartItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can modify carts");
    };
    switch (carts.get(cartId)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) {
        if (cart.ownerId != caller) {
          Runtime.trap("Unauthorized: You can only update your own cart");
        };
        let newItems = cart.items.concat([item]);
        let updatedCart = {
          id = cart.id;
          ownerId = cart.ownerId;
          items = newItems;
          isActive = cart.isActive;
          createdAt = cart.createdAt;
        };
        carts.add(cartId, updatedCart);
      };
    };
  };

  public shared ({ caller }) func removeItemFromCart(cartId : CartId, productId : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can modify carts");
    };
    switch (carts.get(cartId)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) {
        if (cart.ownerId != caller) {
          Runtime.trap("Unauthorized: You can only update your own cart");
        };
        let filteredItems = cart.items.filter(func(item) { item.productId != productId });
        let updatedCart = {
          id = cart.id;
          ownerId = cart.ownerId;
          items = filteredItems;
          isActive = cart.isActive;
          createdAt = cart.createdAt;
        };
        carts.add(cartId, updatedCart);
      };
    };
  };

  public shared ({ caller }) func clearCart(cartId : CartId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can modify carts");
    };
    switch (carts.get(cartId)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) {
        if (cart.ownerId != caller) {
          Runtime.trap("Unauthorized: You can only update your own cart");
        };
        let updatedCart = {
          id = cart.id;
          ownerId = cart.ownerId;
          items = [];
          isActive = cart.isActive;
          createdAt = cart.createdAt;
        };
        carts.add(cartId, updatedCart);
      };
    };
  };

  public query ({ caller }) func getCart(cartId : CartId) : async ShoppingCart.ShoppingCart {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view carts");
    };
    switch (carts.get(cartId)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) {
        if (cart.ownerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only view your own cart");
        };
        cart;
      };
    };
  };

  /*************************************************
   * ORDER MANAGEMENT                               *
   *************************************************/
  var nextOrderId = 1;
  let orders = Map.empty<OrderId, OrderInfo.Order>();

  public shared ({ caller }) func createOrder(buyerId : Principal, cartId : CartId, shippingAddress : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };
    if (caller != buyerId) {
      Runtime.trap("Unauthorized: You can only create orders for yourself");
    };
    switch (carts.get(cartId)) {
      case (null) { Runtime.trap("Could not find shopping cart with ID " # cartId.toText()) };
      case (?cart) {
        if (cart.ownerId != caller) {
          Runtime.trap("Unauthorized: You can only create orders from your own cart");
        };
        let newOrder : OrderInfo.Order = {
          id = nextOrderId;
          buyerId;
          items = cart.items;
          total = cart.items.foldLeft(
            0,
            func(acc, item) { acc + (item.quantity * item.priceSnapshotInCents) },
          );
          shippingAddress;
          status = #pending;
          createdAt = Time.now();
          lastUpdated = Time.now();
        };
        orders.add(nextOrderId, newOrder);
        nextOrderId += 1;
      };
    };
  };

  func isSellerOfOrderProducts(caller : Principal, order : OrderInfo.Order) : Bool {
    for (item in order.items.vals()) {
      switch (products.get(item.productId)) {
        case (?product) {
          if (product.sellerId == caller) {
            return true;
          };
        };
        case (null) {};
      };
    };
    false;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : OrderId, status : OrderInfo.OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (not isSellerOfOrderProducts(caller, order) and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only sellers of products in this order can update status");
        };
        orders.add(orderId, {
          id = order.id;
          buyerId = order.buyerId;
          items = order.items;
          total = order.total;
          shippingAddress = order.shippingAddress;
          status;
          createdAt = order.createdAt;
          lastUpdated = Time.now();
        });
      };
    };
  };

  public query ({ caller }) func getOrdersByBuyer(buyerId : Principal) : async [OrderInfo.Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    if (caller != buyerId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You can only view your own orders");
    };
    let filteredOrders = orders.values().toArray().filter(func(order) { order.buyerId == buyerId });
    filteredOrders.sort();
  };

  public query ({ caller }) func getOrdersByProduct(productId : ProductId) : async [OrderInfo.Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        if (product.sellerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only view orders for your own products");
        };
      };
    };
    let filteredOrders = orders.values().toArray().filter(
      func(order) { order.items.filter(func(item) { item.productId == productId }).size() > 0 }
    );
    filteredOrders.sort();
  };

  public query ({ caller }) func getOrder(orderId : OrderId) : async OrderInfo.Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Could not find order with ID " # orderId.toText()) };
      case (?order) {
        if (order.buyerId != caller and not isSellerOfOrderProducts(caller, order) and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only view your own orders or orders containing your products");
        };
        order;
      };
    };
  };

  public query ({ caller }) func getAllOrders() : async [OrderInfo.Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray().sort();
  };

  public query ({ caller }) func getRecentOrders(limit : Nat) : async [OrderInfo.Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view recent orders");
    };
    orders.values().toArray().sort().sliceToArray(0, Nat.min(limit, orders.size()));
  };

  /*************************************************
   * REVIEWS                                        *
   *************************************************/
  var nextReviewId = 1;
  let reviews = Map.empty<ReviewId, Review.Review>();

  func hasPurchasedProduct(buyer : Principal, productId : ProductId) : Bool {
    for (order in orders.values()) {
      if (order.buyerId == buyer) {
        for (item in order.items.vals()) {
          if (item.productId == productId) {
            return true;
          };
        };
      };
    };
    false;
  };

  public shared ({ caller }) func leaveReview(productId : ProductId, rating : Nat, comment : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can leave reviews");
    };
    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };
    if (not hasPurchasedProduct(caller, productId)) {
      Runtime.trap("Unauthorized: You can only review products you have purchased");
    };
    let newReview : Review.Review = {
      id = nextReviewId;
      productId;
      reviewerId = caller;
      rating;
      comment;
      createdAt = Time.now();
    };
    reviews.add(nextReviewId, newReview);
    nextReviewId += 1;
  };

  public shared ({ caller }) func deleteReview(reviewId : ReviewId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete reviews");
    };
    switch (reviews.get(reviewId)) {
      case (null) { Runtime.trap("Review with id " # reviewId.toText() # " does not exist.") };
      case (?review) {
        if (review.reviewerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only delete your own reviews");
        };
        reviews.remove(reviewId);
      };
    };
  };

  public query ({ caller }) func getReviewsByProduct(productId : ProductId) : async [Review.Review] {
    let productReviews = reviews.values().toArray().filter(func(review) { review.productId == productId });
    productReviews.sort();
  };

  public query ({ caller }) func getReviewsByReviewer(reviewerId : Principal) : async [Review.Review] {
    let reviewerReviews = reviews.values().toArray().filter(func(review) { review.reviewerId == reviewerId });
    reviewerReviews.sort();
  };

  public query func getAllReviews() : async [Review.Review] {
    reviews.values().toArray().sort();
  };

  /*************************************************
   * SEARCH & FILTERS                               *
   *************************************************/
  public query func searchProducts(searchTerm : Text) : async [Product.Product] {
    let searchResults = products.values().toArray().filter(
      func(product) {
        product.name.toLower().contains(#text(searchTerm.toLower())) or product.description.toLower().contains(#text(searchTerm.toLower()));
      }
    );
    searchResults;
  };

  /*************************************************
   * STRIPE INTEGRATION                             *
   *************************************************/
  var configuration : ?Stripe.StripeConfiguration = null;

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    configuration := ?config;
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public query func isStripeConfigured() : async Bool {
    configuration != null;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  /*************************************************
   * UTILITY FUNCTIONS                              *
   *************************************************/
  public query ({ caller }) func getProductById(productId : ProductId) : async Product.Product {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Could not find product with ID " # productId.toText()) };
      case (?product) { product };
    };
  };

  public query ({ caller }) func isProductInStock(productId : ProductId) : async Bool {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Could not find product with ID " # productId.toText()) };
      case (?product) { product.inventoryCount > 0 };
    };
  };

  public query ({ caller }) func getProductPrice(productId : ProductId) : async Nat {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Could not find product with ID " # productId.toText()) };
      case (?product) { product.priceInCents };
    };
  };
};
