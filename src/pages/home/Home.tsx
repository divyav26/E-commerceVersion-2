
import Footer from "../layout/Footer"
import Navbar from "../layout/Navbar"
import Carousel from "./carousel"


import ProductsList from "../products/ProductList"
// import Navbar from "./Navbar"


const Home = () => {
  return (
    <>
    
    <Navbar />
      <Carousel />
      {/* <h1 className="text-center font-bold text-xl text-[#3b82f6] py-2">All Products Collection</h1> */}
      <div className="pt-5">
       <ProductsList />
      </div>
    <Footer />
    </>
  )
}

export default Home
