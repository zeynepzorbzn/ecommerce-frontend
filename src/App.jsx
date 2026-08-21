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
//import Orders from "./pages/Orders";
import ProductDetail from "./pages/ProductDetail";
import Categories from "./pages/Categories";


function App() {
  return (
      <BrowserRouter>
      <div className="min-h-screen bg-white text-gray-900">

          <Header />
          <Routes>
             <Route path = "/" element ={<Home />}/>
              <Route path = "/products" element ={<Products />}/>
              <Route path="/products/:id" element={<ProductDetail />} />

              <Route path = "/login" element ={<Login />}/>
              <Route path = "/register" element ={<Register />}/>

              <Route path = "/cart" element ={<Cart/>}/>

              <Route path="/account" element={<Account />} />
              <Route path="/myAccount" element={<ProtectedRoute><MyAccount /></ProtectedRoute> }/>

              <Route path = "/categories" element ={<Categories/>}/>



              {/*<Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>}/>*/}
          </Routes>
          <Footer />

      </div>
          </BrowserRouter>
  )
}
export default App;
