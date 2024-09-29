import { db } from "@/firebase/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface Order {
  order_id: string;
  customer_name: string;
  customer_address: string;
  date: string;
  total_items: number;
  final_price: number;
  products: any[];
  discount: number;
  coupon_id: string;
}


const OrdersList = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const OrderRef = collection(db, "Orders");
      const querySnapshot = await getDocs(OrderRef);
      const ordersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Order),
      }));
      console.log("ordersList", ordersList);
      setOrders(ordersList);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead>
              <Button variant="ghost">
                Order ID
              </Button>
            </TableHead> */}
            <TableHead>
              <Button variant="ghost">
                Customer Name
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost">
                Order Date
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost">
                Status
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost">
                Total
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.order_id}>
              {/* <TableCell>{order.order_id}</TableCell> */}
              <TableCell>{order.customer_name}</TableCell>
              <TableCell>{order.date}</TableCell> 

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default OrdersList
