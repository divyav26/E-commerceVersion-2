import Footer from "../layout/Footer"
import Navbar from "../layout/Navbar"

import ProductsList from "../products/ProductList"
// import Navbar from "./Navbar"


const Home = () => {
  return (
    <>
    
    <Navbar />
      <div className="">
       <ProductsList />
      </div>
    <Footer />
    </>
  )
}

export default Home
