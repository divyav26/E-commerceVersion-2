import { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, arrayUnion, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/FirebaseConfig';
import { Card, CardContent } from '@/components/ui/card';
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/redux/slice/CartSlice';
import { addToWishlist } from '@/redux/slice/whishlistSlice';
import { showErrorToast, showSuccessToast } from '@/commanComponents/CommanToast';
import { FaRegHeart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { setProducts } from '@/redux/slice/productSlice';

// Interface to define the structure of a product
interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  category: string;
  brand: string;
  price: number;
  discountedPrice: number;
  costPrice: number;
  img: string;
}

const ProductsList = () => {
  // Use Redux to get filtered products from the state
  const products = useSelector((state: any) => state.product.filteredProducts);
  console.log("products from Redux state:", products);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = auth.currentUser;
  console.log("user---", user);
  const isLoging = Cookies.get("user_token");

  // Function to handle adding products to the cart
  const handleAddToCart = async (product: Product) => {
    if (!isLoging) {
      showErrorToast('User not logged in! Redirecting to login page.');
      navigate('/login'); // Redirect to login page if not logged in
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.costPrice,
      img: product.img,
      quantity: 1, // Default quantity of 1 for the initial add
      discountedPrice: product.discountedPrice,
      costPrice: product.costPrice,
    };
  
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();

        // Check if cart exists in user's document and if the product is already in the cart
        const existingCart = userData?.cart || [];
        const existingProduct = existingCart.find((item: any) => item.id === product.id);

        if (existingProduct) {
          // Update quantity if the product is already in the cart
          const updatedCart = existingCart.map((item: any) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 } // Increment quantity by 1
              : item
          );
          await updateDoc(userDocRef, {
            cart: updatedCart,
          });
          showSuccessToast('Product added to cart');
        } else {
          // Add new product if not already in cart
          await updateDoc(userDocRef, {
            cart: arrayUnion(cartItem),
          });
          showSuccessToast('Product added to cart');
        }
        
        // Add item to Redux state (if applicable)
        dispatch(addToCart(cartItem));
      } catch (error) {
        console.error("Error adding/updating item in cart: ", error);
      }
    }
  };
  
  // Function to handle adding products to the wishlist
  const handleAddToWishlist = async (product: Product) => {
    if (!isLoging) {
      showErrorToast('User Not Login!!!.');
      return;
    }

    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.costPrice,
      img: product.img,
      discountedPrice: product.discountedPrice,
      costPrice: product.costPrice,
    };

    dispatch(addToWishlist(wishlistItem));
    showSuccessToast('Product added to wishlist');

    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid); // Reference to the logged-in user's document
        await updateDoc(userDocRef, {
          wishlist: arrayUnion(product.id), // Add the product ID to the wishlist array
        });
        console.log("Product added to wishlist in Firebase");
      } catch (error) {
        console.error("Error adding product to wishlist: ", error);
      }
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Product, 'id'>),
      }));
      // Here you should ideally dispatch an action to store products in Redux
      dispatch(setProducts(productsList)); 
    } catch (error) {
      console.error("Error fetching products: ", error);
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full">
        <iframe 
          src="https://lottie.host/embed/999c2f54-db3d-44ba-bb2e-c97c303981a5/CPapgoqjur.json" 
          className="rounded-lg"
        ></iframe>
      </div>
    );
  }

  // Error handling
  if (error) {
    return <div>{error}</div>;
  }

  // Check if products exist
  if (!Array.isArray(products) || products.length === 0) {
    return <div>No products available</div>;
  }

  return (
    <div className='my-4'>
      <h2 className="text-2xl font-bold my-4">Products List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        {products.map((product: Product) => (
          <Card key={product.id} className='w-full'>
            <CardContent className='flex flex-col justify-between h-[330px]'>
              <div className=' w-full'>
                <img src={product.img} alt={product.name} className="mt-2 w-full h-[150px] object-cover" />
              </div>
              <div className='text-xs text-gray-700 '>
                 <h3 className="text-sm font-semibold">{product.name}</h3>
                <p>{product.description.slice(0, 60)}</p>
                <div className='gap-4 my-1 text-sm'>
                  <p className='flex items-center font-semibold'>
                    <LiaRupeeSignSolid className='text-bold' />{product.costPrice}
                    <span className='line-through flex items-center mx-2'>
                      <LiaRupeeSignSolid className='text-bold line-through' />{product.price}
                    </span>
                    <span className='text-green-800'>{product.discountedPrice}% off</span>
                  </p>
                </div>
              <div className='flex items-center justify-between gap-4'>
                <button onClick={() => handleAddToCart(product)} className="mt-4 bg-gray-800 hover:bg-gray-900 text-white text-xs font-normal py-1 px-4 rounded">
                  Add to Cart
                </button>
                <FaRegHeart onClick={() => handleAddToWishlist(product)} className='mt-4' />
              </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
