

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"

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

interface TaskPageProps {
  products: Product[];
}



// Simulate a database read for tasks.


export default function TaskPage( { products }: TaskPageProps) {
console.log("get all Products in table: ", products);

  
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-4 p-4 md:flex">
        <DataTable data={products} columns={columns} />
      </div>
    </>
  )
}
