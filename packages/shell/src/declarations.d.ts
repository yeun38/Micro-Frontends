declare module 'chatbot/Chatbot' {
  const Chatbot: React.ComponentType
  export default Chatbot
}

declare module 'header/Header' {
  const Header: React.ComponentType
  export default Header
}

declare module 'products/ProductList' {
  const ProductList: React.ComponentType
  export default ProductList
}

declare module 'products/ProductDetail' {
  const ProductDetail: React.ComponentType<{ productId: string }>
  export default ProductDetail
}

declare module 'cart/Cart' {
  const Cart: React.ComponentType
  export default Cart
}

declare module 'archive/OrderList' {
  const OrderList: React.ComponentType
  export default OrderList
}

declare module 'archive/EmotionCollection' {
  const EmotionCollection: React.ComponentType
  export default EmotionCollection
}
