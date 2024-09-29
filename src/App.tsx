
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Register from './pages/login/Register'
import AddProducts from './pages/admin/dashboard/AddProducts'
import OrdersList from './pages/admin/dashboard/OrdersList'
import Cart from './pages/products/Cart'
import WishList from './pages/products/WishList'
import AdminHome from './pages/admin/dashboard/AdminHome'
import Orders from './pages/products/Orders'
import OrderHistory from './pages/products/OrderHistory'
import Cookies from 'js-cookie'
import Protected from './pages/protected/Protected'
import Dashboard from './pages/admin/dashboard/Dashboard'
function App() {

  const useData = Cookies.get("user") ? JSON.parse(Cookies.get("user")!) : null;
  console.log("useData-- App", useData);

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/adminhome" element={<Protected Component={AdminHome}/>}>
        <Route path='dashboard' element={<Protected Component={Dashboard} />} />
          <Route path="addproducts" element={<Protected Component={AddProducts} />} />
          <Route path="orders" element={<Protected Component={OrdersList} />} />
        </Route>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/cart' element={<Protected Component={Cart} />} />
        <Route path="/wishlist" element={<Protected Component={WishList} />} />
        <Route path="/order/:orderId" element={<Protected Component={Orders} />} />
        <Route path="/orderhistory" element={<Protected Component={OrderHistory} />} />        
      </Routes>
     
    </BrowserRouter>
    </>
  )
}

export default App
