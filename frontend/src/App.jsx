import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Suspense, lazy } from "react";

import Layout from "./pages/Layout";
import PayPalWraper from "./components/PayPalWraper";
import PrivateRout from "./components/PrivateRout";
import AdminRoutes from "./pages/Admin/AdminRoutes";
import ErrorBoundary from "./components/ErrorBoundary";
import PageLoader from "./components/PageLoader";

// id don't make home it's for lazy loading becasue it's the first page
// and i don't wanna show loader on the first page
import Home from "./pages/Home";

const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const Profile = lazy(() => import("./pages/user/Profile"));
const UserList = lazy(() => import("./pages/Admin/UserList"));
const CategoryList = lazy(() => import("./pages/Admin/CategoryList"));
const CreateProduct = lazy(() => import("./pages/Admin/CreateProduct"));
const ProductList = lazy(() => import("./pages/Admin/ProductList"));
const UpdateProduct = lazy(() => import("./pages/Admin/UpdateProduct"));
const AllProduct = lazy(() => import("./pages/Admin/AllProduct"));
const Favorites = lazy(() => import("./pages/products/Favorites"));
const ProductDetails = lazy(() => import("./pages/products/ProductDetails"));
const Cart = lazy(() => import("./pages/user/Cart"));
const Shope = lazy(() => import("./pages/Shope"));
const Shipping = lazy(() => import("./pages/Orders/Shipping"));
const PlaceOrder = lazy(() => import("./pages/Orders/PlaceOrder"));
const Order = lazy(() => import("./pages/Orders/Order"));
const Orders = lazy(() => import("./pages/user/Orders"));
const Dashboard = lazy(() => import("./pages/Admin/Dashboard"));
const OrdersList = lazy(() => import("./pages/Admin/OrdersList"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PayPalWraper>
          <BrowserRouter>
            <Suspense
              fallback={<PageLoader className={"bg-white/10"}  height="h-screen" width="w-full" />}
            >
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="favorite" element={<Favorites />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="shop" element={<Shope />} />
                  <Route path="product/:id" element={<ProductDetails />} />

                  {/* Private routes */}
                  <Route path="" element={<PrivateRout />}>
                    <Route path="profile" element={<Profile />} />
                    <Route path="shipping" element={<Shipping />} />
                    <Route path="placeorder" element={<PlaceOrder />} />
                    <Route path="order/:id" element={<Order />} />
                    <Route path="/orderslist" element={<Orders />} />
                  </Route>

                  {/* Admin routes */}
                  <Route path="admin" element={<AdminRoutes />}>
                    <Route path="userlist" element={<UserList />} />
                    <Route path="categoryList" element={<CategoryList />} />
                    <Route path="productlist" element={<ProductList />} />
                    <Route path="createproduct" element={<CreateProduct />} />
                    <Route path="allproductslist" element={<AllProduct />} />
                    <Route
                      path="product/update/:id"
                      element={<UpdateProduct />}
                    />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="orderlist" element={<OrdersList />} />
                  </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </PayPalWraper>
      </Provider>
    </ErrorBoundary>
  );
}
