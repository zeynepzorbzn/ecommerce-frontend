import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"
import Home from "./pages/Home"
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Products from "./pages/Products"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Cart from "./pages/Cart"
import Account from "./pages/Account";
import MyAccount from "./pages/MyAccount";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import ProductDetail from "./pages/ProductDetail";
import Categories from "./pages/Categories";
import Checkout from "./pages/Checkout";
import PaymentPage from "./pages/PaymentPage";
import Store from "./pages/Store";
import StoreManager from "./pages/StoreManager";
import StoreDashboard from "./pages/store/StoreDashboard";
import StoreProduct from "./pages/store/StoreProduct";
import CreateProduct from "./pages/store/CreateProduct";
import Admin from "./pages/Admin";
import ProductVariant from "./pages/ProductVariant";
import Addresses from "./pages/Addresses";
import Profile from "./pages/Profile";
import EditProduct from "./pages/store/EditProduct";
import AdminStores from "./pages/AdminStores";
import AdminUsers from "./pages/AdminUsers";
import AdminBrands from "./pages/AdminBrands";
import AdminCategories from "./pages/AdminCategories";
import Stores from "./pages/Stores";
import Favorites from "./pages/Favorites";



function App() {
  return (
      <BrowserRouter>
      <div className="min-h-screen bg-white text-gray-900">

          <Header />
          <Routes>
             <Route path = "/" element ={<Home />}/>
              <Route path="/products" element={<Products />} />
              <Route path="/stores" element={<Stores />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/products/:id" element={<ProductDetail />} />

              <Route path = "/login" element ={<Login />}/>
              <Route path = "/register" element ={<Register />}/>

              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>}/>

              <Route path="/account" element={<Account />} />
              <Route path="/myAccount" element={<ProtectedRoute><MyAccount /></ProtectedRoute> }/>
              <Route path="/account/addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>}/>

              <Route path = "/categories" element ={<Categories/>}/>
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>}/>
              <Route path="/payment-methods" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>}/>
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>}/>
              <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>}/>
              <Route path="/store" element={<ProtectedRoute allowedRoles={["STORE_MANAGER"]}><Store /></ProtectedRoute>}/>
              <Route path="/store/dashboard" element={<ProtectedRoute allowedRoles={["STORE_MANAGER"]}><StoreDashboard /></ProtectedRoute>}/>
              <Route path="/store/products" element={<ProtectedRoute allowedRoles={["STORE_MANAGER"]}><StoreProduct /></ProtectedRoute>}/>
              <Route path="/store/products/new" element={<ProtectedRoute allowedRoles={["STORE_MANAGER"]}><CreateProduct /></ProtectedRoute>}/>
              <Route path="/admin" element={<ProtectedRoute allowedRoles={["ADMIN"]}><Admin /></ProtectedRoute>}/>
              <Route path="/store/products/:id/variants" element={<ProtectedRoute allowedRoles={["STORE_MANAGER"]}><ProductVariant /></ProtectedRoute>}/>
              <Route path="/account/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
              <Route path="/store/products/:id/edit" element={<ProtectedRoute allowedRoles={["STORE_MANAGER"]}><EditProduct /></ProtectedRoute>}/>
              <Route path="/admin/stores" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminStores /></ProtectedRoute>}/>
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminUsers /></ProtectedRoute>}/>
              <Route path="/admin/brands" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminBrands /></ProtectedRoute>}/>
              <Route path="/admin/categories" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminCategories /></ProtectedRoute>}/>
              
          </Routes>
          <Footer />

      </div>
          </BrowserRouter>
  )
}
export default App;
