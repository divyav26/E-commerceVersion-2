import { Input } from "@/components/ui/input";
import { auth, db } from "@/firebase/FirebaseConfig";
import { signOut } from "firebase/auth";
import Cookies from "js-cookie";
import { BsCartCheck } from "react-icons/bs";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdOutlineEmail, MdOutlinePowerSettingsNew } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { IoBagCheckOutline } from "react-icons/io5";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEffect, useRef, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { setProducts, filterByCategory, searchProducts } from "@/redux/slice/productSlice"; // Import actions
import { Separator } from "@/components/ui/separator";


const Navbar = () => {
  const isLoggedIn = !!Cookies.get("user_token");
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch
  const totalQuantity = useSelector((state: any) => state.cart.totalQuantity);
  // const wishlistItems = useSelector((state: any) => state?.wishlist?.items || []); 
  // const wishlistCount = wishlistItems.length;

  const userData = Cookies.get("user") ? JSON.parse(Cookies.get("user")!) : null;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false)
    }, 300) // 300ms delay before closing
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])
  const fetchProducts = async () => {
    const productRef = collection(db, "products");
    const querySnapshot = await getDocs(productRef);

    const data = querySnapshot.docs.map((doc) => {
      const productData = doc.data();
      return {
        id: doc.id,
        name: productData.name,
        category: productData.category,
        price: productData.price,
        img: productData.img,
        discountedPrice: productData.discountedPrice,
        costPrice: productData.costPrice,
        description: productData.description,
        brand: productData.brand,
        quantity: productData.quantity,
        
        // Add any other necessary properties here
      };
    });
  
    dispatch(setProducts(data)); // Dispatch setProducts action
  };
  

  const handleCategory = (category: string) => {
    dispatch(filterByCategory(category)); // Dispatch filterByCategory action
  };

  const handleSearch = (e: any) => {
    dispatch(dispatch(searchProducts(e.target.value))); // Dispatch filterProducts action
  };

  const handleLogout = async () => {
    Cookies.remove("user_id")
    Cookies.remove("user_token");
    Cookies.remove("user"); // Remove user data
    await signOut(auth);
    navigate("/login");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <nav className="bg-white-800 text-black w-full p-2 shadow">
        
        <div className="flex justify-between items-center gap-2 text-sm">
          <ul className="flex items-center gap-4"> 
            <div className="text-lg flex items-center gap-1 cursor-pointer" onClick={() => handleCategory("all")}>
              <img src="https://www.loudmouth-media.com/media/1652/e-commerce-large-01.png" alt="FashionNest" className="w-5 h-6 rounded-full object-cover" />
            <Link to="/" className="text-blue-500 font-bold">FashionNest</Link>
            </div>
            <li onClick={() => handleCategory("men")} className="text-black font-semibold flex justify-center items-center cursor-pointer">Men</li>
            <li onClick={() => handleCategory("women")} className="text-black font-semibold flex justify-center items-center cursor-pointer">Women</li>
            <li onClick={() => handleCategory("electronics")} className="text-black font-semibold flex justify-center items-center cursor-pointer">Electronics</li>
            <li onClick={() => handleCategory("Jewellery")} className="text-black font-semibold flex justify-center items-center cursor-pointer">Jewellery</li>
          </ul>

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
                        <div>
            <Input placeholder="Search..." className="w-[100%]"
              onChange={handleSearch}
            />
          </div>
              <div className="text-xl">
                <NavLink to="/wishlist" className="relative text-black text-lg flex justify-center items-center">
                  <IoIosHeartEmpty className="text-xl" />
                  {/* {wishlistCount > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 text-black text-xs p-1 font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )} */}
                </NavLink>
              </div>

              <NavLink to="/cart" className="relative text-black text-lg flex justify-center items-center">
                <BsCartCheck className="text-xl" />
                {totalQuantity > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 text-black text-xs p-2 font-bold rounded-full h-3 w-3 flex items-center justify-center">
                    {totalQuantity}
                  </span>
                )}
              </NavLink>
              <NavLink to="/orderhistory" className="text-black text-lg flex justify-center items-center">
                <IoBagCheckOutline className="text-2xl" />
              </NavLink>
              <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className=" p-1 rounded cursor-pointer hover:text-text-red transition-all ">
                <IoPersonCircleOutline className="text-xl  " />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col text-xs ">
                  <p className="flex  items-center gap-1 ">
                    <MdOutlineEmail className="text-base text-center text-red-700 " />

                    <span>{userData?.email}</span>
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleLogout}>
                <p className="text-xs flex items-center gap-2 font-medium">
                  <MdOutlinePowerSettingsNew className="text-red-700 text-base " />{" "}
                  Log out
                </p>
              </DropdownMenuItem>
            </DropdownMenuContent>
               </DropdownMenu>
            </div>
          ) : (
            <>
            <div className="hidden md:flex md:items-center">
            <div>
            <Input placeholder="Search..." className="w-[100%]"
              onChange={handleSearch}
            />
          </div>
            <div 
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              ref={dropdownRef}
            >
              <button className="p-2 text-black hover:text-blue-600 transition-colors duration-200 flex items-center">
              <IoPersonCircleOutline className="text-2xl" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
            <Link to="/cart" className="p-2 text-black hover:text-blue-600 transition-colors duration-200">
            <BsCartCheck className="text-2xl" />
            </Link>
          </div>
            </>
          )}
        </div>
      </nav>
      <Separator />
    </>
  );
};

export default Navbar;
