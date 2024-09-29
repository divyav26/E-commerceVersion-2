
import TaskPage from "../adminTable/TableComponents/page"
import { useEffect, useState } from "react";

import {  db } from "@/firebase/FirebaseConfig";
import Cookies from "js-cookie";
import { collection, getDocs } from "firebase/firestore";

const Dashboard = () => {
    interface Product {
        id: string;
        name: string
        description: string;
        quantity: number;
        category: string;
        brand: string;
        price: number;
        discountedPrice: number;
        costPrice: number;
        img: string;
      }
      
  
        const [products, setProducts] = useState<Product[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
        const [userCount, setUserCount] =useState<number>(0)
        const [productsCount, setProductCount] = useState<number>(0)
       
   
      
        const fetchAllProducts = async () => {
          try {
            const productsCollection = collection(db, 'products');
            const productsSnapshot = await getDocs(productsCollection);
            const productsList: Product[] = productsSnapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                name: data.name || '',
                description: data.description || '',
                quantity: data.quantity || 0,
                category: data.category || '',
                brand: data.brand || '',
                price: data.price || 0,
                discountedPrice: data.discountedPrice || 0,
                costPrice: data.costPrice || 0,
                img: data.img || '',
              };
            });
            setProducts(productsList);
            setProductCount(productsList.length)
            console.log('All products fetched:', productsList);
          } catch (error) {
            console.error("Error fetching products: ", error);
            setError("Failed to fetch products.");
          } finally {
            setLoading(false);
          }
        };
      
      
      
        //get all users from firestore and count the number of users
        const fetchAllUserCount = async()=>{
          const UserDataRef =collection(db,'users')
          const userDataShapshot = await getDocs(UserDataRef) 
          setUserCount(userDataShapshot.size)
          console.log(userDataShapshot.size)
        }
        
      
        //get userData from cookies 
      
      const userData = Cookies.get("user") ? JSON.parse(Cookies.get("user")!) : null;
        console.log("User data: ", userData);
      
     
        useEffect(() => {
          fetchAllUserCount()
          fetchAllProducts();
        }, []);
        if (loading) return <p>Loading...</p>;
        if (error) return <p>{error}</p>;
        
  return (
    <main className="p-2 ">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-white p-2 rounded-lg shadow-sm h-20 flex flex-col justify-center items-center">
            <h2 className="text-sm font-semibold mb-2">Users</h2>
            <p className="text-xs font-bold text-purple-600">{userCount}</p>
          </div>
          <div className="bg-white p-2 rounded-lg shadow-sm h-20 flex flex-col justify-center items-center">
            <h2 className="text-sm font-semibold mb-2">Orders</h2>
            <p className="text-xs font-bold text-purple-600">85%</p>
          </div>
          <div className="bg-white p-2 rounded-lg shadow-sm h-20 flex flex-col justify-center items-center">
            <h2 className="text-sm font-semibold mb-2">All Products</h2>
            <p className="text-xs font-bold text-purple-600">{productsCount}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm h-20 flex flex-col justify-center items-center">
            <h2 className="text-sm font-semibold mb-2">Finished AdminHomeworks</h2>
            <p className="text-xs font-bold text-purple-600">75%</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg overflow-y-auto">
         <TaskPage products={products} />
        </div>
      </main>
  )
}

export default Dashboard
