import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './pages/Layout'
import { store } from './redux/store';
import { Provider } from 'react-redux'; 
import Home from './pages/Home'
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/user/Profile';
import PrivateRout from './components/PrivateRout';
import AdminRoutes from './pages/Admin/AdminRoutes';
import UserList from './pages/Admin/UserList';
import CategoryList from './pages/Admin/CategoryList';
import CreateProduct from './pages/Admin/CreateProduct';
import ProductList from './pages/Admin/ProductList';
import UpdateProduct from './pages/Admin/UpdateProduct';
import AllProduct from './pages/Admin/AllProduct';
import Favorites from './pages/products/Favorites';
import ProductDetails from './pages/products/ProductDetails';
import Cart from './pages/user/Cart';
import Shope from './pages/Shope';
export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="favorite" element={<Favorites />} />
            <Route path="cart" element={<Cart />} />
            <Route path="shop" element={<Shope />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="" element={<PrivateRout />}>
              <Route path="profile" element={<Profile />} />
            </Route>
            {/* admin routes */}
            <Route path="admin" element={<AdminRoutes />}>
              <Route path="userlist" element={<UserList />} />
              <Route path="categoryList" element={<CategoryList />} />
              <Route path="createproduct" element={<CreateProduct />} />
              <Route path="productlist" element={<ProductList />} />
              <Route path="allproductslist" element={<AllProduct />} />
              <Route path="product/update/:id" element={<UpdateProduct />} />
            </Route>
          </Route>
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
