import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebase/FirebaseConfig'; // Adjust Firebase import path
import Layout from '../layout/Layout';
import { Separator } from '@/components/ui/separator';
import { BsCurrencyRupee } from "react-icons/bs";
import { showSuccessToast } from '@/commanComponents/CommanToast';

interface CartItem {
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
  final_price: number;
  products: CartItem[];
  discount: number;
  coupon_id: string;
}

const Orders = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form state for order placement
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderDoc = await getDoc(doc(db, 'Orders', orderId!));
        if (orderDoc.exists()) {
          setOrder(
            orderDoc.data() as Omit<Order, 'products'> & { products: CartItem[] }
          )
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // Function to handle order form submission
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');

    if (!name || !address) {
      setFormError('Please fill out all fields.');
      setSubmitting(false);
      return;
    }

    try {
      // Prepare the new order object
      const newOrder = {
        order_id: orderId , // Replace with your order ID logic
        date: new Date().toISOString(),
        total_items: order?.total_items || 0,
        final_price: order?.final_price || 0,
        products: order?.products || [],
        discount: order?.discount || 0,
        coupon_id: order?.coupon_id || '',
        customer_name: name,
        customer_address: address,
        payment_method: paymentMethod,
      };

      // Save the new order to Firebase
      await addDoc(collection(db, 'Orders'), newOrder);
      console.log("newOrder---", newOrder)
      setName('');
      setAddress('');
     

      // Redirect or notify user of successful order placement
      showSuccessToast('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      setFormError('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>Order not found.</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-lg font-bold mb-4">Place Your Order</h2>
        <Separator  />

        <div className='flex justify-between items-center'>

        <div className="bg-white shadow-sm rounded-lg p-4 w-[40%]">
          {/* <h3 className="text-lg font-medium mb-4">Order ID: {order.order_id}</h3> */}
          {
            order.products.map((item) => (
              <li key={item.id} className="flex py-4">
                <img src={item.img} alt={item.name} className="w-16 h-16 rounded-lg object-center object-cover" />
                <div className="ml-4">
                  <h4 className="text-sm font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-500 flex items-center"><BsCurrencyRupee/>{item.price} x {item.quantity}</p>
                  <p className="text-sm text-gray-900 flex items-center gap-1"><BsCurrencyRupee/>{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </li>
            ))
          }
          <div className='text-xs '>

          <p>Date: {new Date(order.date).toLocaleDateString()}</p>
          <p>Total Items: {order.total_items}</p>
          <p className='flex items-center'>Final Price:<BsCurrencyRupee className=' mt-[1px] ml-1'/>{order.final_price}</p>
          {order.discount > 0 && (
            <p>Discount Applied: {order.discount}%</p>
          )}
          {order.coupon_id && (
            <p>Coupon Code: {order.coupon_id}</p>
          )}
          </div>
        </div>
        <div className="w-[50%]">
          <form onSubmit={handleOrderSubmit} className="bg-white rounded-lg p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Name
                <input
                  type="text"
                  className="mt-1 block w-full p-1 border rounded-md"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Address
                <input
                  type="text"
                  className="mt-1 block w-full p-1 border rounded-md"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Payment Method
                <select
                  className="mt-1 block w-full p-1 border rounded-md"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="credit-card">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="cash-on-delivery">Cash on Delivery</option>
                </select>
              </label>
            </div>
            {formError && (
              <p className="text-red-500 text-sm mb-4">{formError}</p>
            )}
            <button
              type="submit"
              className="bg-indigo-600 text-white text-xs px-4 py-1 rounded-md"
              disabled={submitting}
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
        </div>
          <Separator  />


      


        <div className="mt-6">
          <Link to="/orderhistory" className="text-indigo-600 font-medium">View Order History</Link>
        </div>

        {/* <div className="mt-6">
          <a href="/" className="text-indigo-600 font-medium">Continue Shopping</a>
        </div> */}
      </div>
    </Layout>
  );
};

export default Orders;
