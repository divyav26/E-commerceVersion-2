import { Link } from "react-router-dom"
import { RxDashboard } from "react-icons/rx";
import { IoIosAddCircleOutline } from "react-icons/io";
import { RiFileHistoryFill } from "react-icons/ri";


const Sidebar = () => {
  return (
    <aside className="hidden sm:flex sm:flex-col w-[170px] sticky left-0">
      
      <div className="flex-grow flex flex-col justify-between text-gray-500 bg-white text-sm">
        <nav className="flex flex-col mx-4 mt-2 space-y-4">
          <div className="text-lg flex items-center gap-1">
            <img src="https://www.loudmouth-media.com/media/1652/e-commerce-large-01.png" alt="FashionNest" className="w-5 h-6 rounded-full object-cover" />
           <p className="text-blue-500 font-bold">FashionNest</p>
          </div>
          <Link to="dashboard" className="flex  items-center gap-2"><RxDashboard />Dashboard</Link>
          <Link to="addproducts" className="flex  items-center gap-2"><IoIosAddCircleOutline />Add Product</Link>
          <Link to="orders" className="flex  items-center gap-2"><RiFileHistoryFill />
            All orders
          </Link>
          
        </nav>
       
      </div>
    
    </aside>
  )
}

export default Sidebar
