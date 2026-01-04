export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    name: String
    role: String!
    location: String
    avatar: String
    isVip: Boolean!
    memberSince: String
    phone: String
    createdAt: String!
    updatedAt: String!
    orders: [Order!]!
  }

  type ProductVariant {
    id: ID!
    productId: String!
    size: String!
    color: String!
    stock: Int!
  }

  type Product {
    id: ID!
    name: String!
    brand: String!
    category: String!
    price: Float!
    originalPrice: Float
    discount: String
    image: String!
    rating: Float!
    reviews: Int!
    tags: [String!]!
    createdAt: String!
    updatedAt: String!
    variants: [ProductVariant!]!
  }

  type OrderItem {
    id: ID!
    orderId: String!
    productId: String!
    product: Product!
    quantity: Int!
    selectedSize: String
    selectedColor: String
    priceAtTime: Float!
  }

  type Order {
    id: ID!
    userId: String!
    user: User!
    date: String!
    status: String!
    subtotal: Float!
    tax: Float!
    total: Float!
    shippingAddress: String!
    paymentMethod: String!
    estimatedDelivery: String!
    createdAt: String!
    updatedAt: String!
    items: [OrderItem!]!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type PaginatedProducts {
    products: [Product!]!
    pagination: PaginationInfo!
  }

  type PaginationInfo {
    page: Int!
    limit: Int!
    total: Int!
    totalPages: Int!
  }

  input CreateProductInput {
    name: String!
    brand: String!
    category: String!
    price: Float!
    originalPrice: Float
    discount: String
    image: String!
    rating: Float!
    reviews: Int!
    tags: [String!]!
  }

  input UpdateProductInput {
    name: String
    brand: String
    category: String
    price: Float
    originalPrice: Float
    discount: String
    image: String
    rating: Float
    reviews: Int
    tags: [String!]
  }

  input CreateOrderInput {
    userId: String!
    items: [OrderItemInput!]!
    subtotal: Float!
    tax: Float!
    total: Float!
    shippingAddress: String!
  }

  input OrderItemInput {
    id: String!
    quantity: Int!
    price: Float!
    selectedSize: String
    selectedColor: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateProfileInput {
    name: String
    location: String
    avatar: String
    phone: String
  }

  type Query {
    products(page: Int, limit: Int, category: String, brand: String, search: String): PaginatedProducts!
    product(id: ID!): Product
    orders(userId: ID): [Order!]!
    order(id: ID!): Order
    me: User
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
    createOrder(input: CreateOrderInput!): Order!
    updateOrderStatus(id: ID!, status: String!): Order!
    login(input: LoginInput!): AuthPayload!
    updateProfile(input: UpdateProfileInput!): User!
  }
`;
