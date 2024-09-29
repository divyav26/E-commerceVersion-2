import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { auth, db } from '@/firebase/FirebaseConfig';
import Layout from '../layout/Layout';
import { showErrorToast } from '@/commanComponents/CommanToast';
import { BsCurrencyRupee } from 'react-icons/bs';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  img: string;
  quantity: number;
  discountedPrice: number;
}

interface Order {
  order_id: string;
  date: string;
  total_items: number;
  final_price: string;
  products: OrderItem[];
  discount: number;
  coupon_id: string;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = auth.currentUser;

  const fetchOrders = async () => {
    if (!user) {
      showErrorToast('User not authenticated.');
      return;
    }

    try {
      // Get the user's document reference
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        setError('No user document found.');
        return;
      }

      const userData = userDoc.data();
      if (userData && userData.orders && Array.isArray(userData.orders)) {
        // Extract the order IDs from user data
        const orderIds = userData.orders.map((order: { order_id: string }) => order.order_id);
        console.log('User Order IDs:', orderIds);

        // Fetch all orders from 'Orders' collection
        const ordersRef = collection(db, 'Orders');
        const ordersSnapshot = await getDocs(ordersRef);

        // Extract the order data from the fetched documents
        const ordersData = ordersSnapshot.docs.map((doc: any) => ({
          ...doc.data(),
          order_id: doc.id, // Use document ID if that's your order_id
        }));
        console.log('Fetched Orders:', ordersData);
        console.log('Number of Fetched Orders:', ordersData.length);

        // Filter the fetched orders to only those matching the user's order IDs
        const filteredOrders = ordersData.filter((order: Order) => orderIds.includes(order.order_id));
        console.log('Filtered Orders:', filteredOrders);
        
        // Set the filtered orders to state
        setOrders(filteredOrders);
      } else {
        setError('No orders found in user data.');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return (
    <Layout>
      <div className="bg-white h-[90vh] overflow-y-auto p-4">
        <h2 className="text-lg font-medium text-center mb-4">Order History</h2>
        {loading ? (
           <div className="flex justify-center items-center min-h-screen space-x-2">
      <div className="w-6 h-6 bg-yellow-500 animate-spin" />
      <div className="w-6 h-6 bg-yellow-400 animate-spin" />
      <div className="w-6 h-6 bg-yellow-300 animate-spin" />
    </div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="space-y-4 grid grid-cols-1 md:grid-cols-4 gap-2">
            {orders.map((order, index) => (
              <div key={`${order.order_id}-${index}`} className="border border-gray-200 p-2 text-xs rounded-md">
                <h3 className="text-xs font-semibold">Order ID: {order.order_id}</h3>
                <p className="text-gray-500">Date: {new Date(order.date).toLocaleDateString()}</p>
                <p className="text-gray-500">Total Items: {order.total_items}</p>
                <p className="text-gray-500">Final Price: <BsCurrencyRupee />{order.final_price}</p>

                {order.products && order.products.length > 0 ? (
                  order.products.map((product, productIndex) => (
                    <div key={`${order.order_id}-${productIndex}`} className="flex items-center mb-2">
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-14 h-14 object-center object-contain"
                      />
                      <div className="ml-4">
                        <h4 className="text-xs font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-500 flex items-center">
                          <BsCurrencyRupee />
                          {product.price} x {product.quantity}
                        </p>
                        <p className="text-xs text-gray-900 flex items-center gap-1">
                          <BsCurrencyRupee />
                          {(product.price * product.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No products found for this order.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrderHistory;
