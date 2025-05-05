// url params
// this is for  production on delopment make it epmty because i use proxy
const BASE_URL = "https://cloud-dream-ecommerce-backend-production.up.railway.app";
// const BASE_URL = "";
const USERS_URL = "/api/users";
const CATEGORY_URL = "/api/category";
const PRODUCT_URL = "/api/products";
const ORDER_URL = "/api/order";
const PAYMENT_URL = '/api/payment'
const DASHBOARD_URL = '/api/dashboard'

//tages
const userTage = "User";
const categoryTage = "Category"
const orderTage = "Order"
const productTage = "Product"
const productReviewTage = "ProductReview"

export {
  BASE_URL, DASHBOARD_URL, USERS_URL, productReviewTage, PAYMENT_URL,
  CATEGORY_URL, ORDER_URL, orderTage, PRODUCT_URL, userTage, categoryTage,
  productTage
}