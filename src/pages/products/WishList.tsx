import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc, arrayRemove, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/FirebaseConfig';
import { useDispatch } from 'react-redux';
import Layout from '../layout/Layout';
import { removeFromWishlist } from '@/redux/slice/whishlistSlice';
import { showSuccessToast } from '@/commanComponents/CommanToast';

interface Product {
  id: string;
  name: string;
  price: number;
  img: string;
  discountedPrice: number;
  costPrice: number;
}

const Wishlist: React.FC = () => {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const user = auth.currentUser;

 

  const fetchWishlist = async () => {
    if (user) {
      try {
        console.log(`Fetching wishlist for user ${user.uid}`);

        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const wishlist = userDocSnap.data()?.wishlist || [];
          console.log('User wishlist:', wishlist);

          const productsCollection = collection(db, 'products');
          const productsSnapshot = await getDocs(productsCollection);

          const wishlistProducts = productsSnapshot.docs
            .filter(doc => wishlist.includes(doc.id))
            .map(doc => ({
              id: doc.id,
              ...(doc.data() as Omit<Product, 'id'>),
            }));

          setWishlistProducts(wishlistProducts);
        } else {
          console.log('User document does not exist');
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error('No user is logged in');
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    if (user) {
      try {
        console.log(`Removing product ${productId} from wishlist for user ${user.uid}`);

        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          wishlist: arrayRemove(productId), // Remove the product ID from the wishlist array
        });

        dispatch(removeFromWishlist(productId));
        showSuccessToast('Product removed from wishlist');
        console.log('Product removed from wishlist');
        fetchWishlist();
      } catch (error) {
        console.error('Error removing product from wishlist:', error);
      }
    } else {
      console.error('No user is logged in');
    }
  };
  useEffect(() => {

    fetchWishlist();
  }, [user]);

  if (loading) {
    return <div><div className="flex flex-col items-center justify-center h-screen space-y-4">
    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
    <p className="text-lg text-gray-500">Loading, please wait...</p>
  </div></div>;
  }

 

  return (
    <Layout>
      {
        wishlistProducts.length ===0 ?
          (<div className='h-screen flex flex-col items-center justify-center'>
            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/mywishlist-empty_39f7a5.png" alt="empty wishlist" className='w-[200px] h-[200px] object-contain' />
           <p className='text-sm'>Empty Wishlist</p> 
            <p className='text-xs'>You have no items in your wishlist. Start adding!</p>
          </div>)
          : (

      <div>
      <h2 className="text-2xl font-bold mb-4">My Wishlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        {wishlistProducts.map(product => (
          <div key={product.id} className="bg-white p-4 shadow rounded">
            <img src={product.img} alt={product.name} className="w-full h-[150px] object-cover" />
            <h3 className="text-sm font-semibold mt-2">{product.name}</h3>
            <p className="text-xs text-gray-700">{product.price}</p>
            <button
              onClick={() => handleRemoveFromWishlist(product.id)}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white text-xs font-normal py-1 px-4 rounded"
            >
              Remove from Wishlist
            </button>
          </div>
        ))}
      </div>
      </div>
          )
      }
    </Layout>
  );
};

export default Wishlist;