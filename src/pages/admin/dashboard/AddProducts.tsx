import React, { useState, ChangeEvent, FormEvent } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '@/firebase/FirebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';


interface Product {
  name: string;
  description: string;
  quantity: number;
  category: string;
  brand: string;
  price: number;
  discountedPrice: number;
  costPrice: number;
  img: File | null;
}

const AddProducts: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    name: '',
    description: '',
    quantity: 0,
    category: '',
    brand: '',
    price: 0,
    discountedPrice: 0,
    costPrice: 0,
    img: null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
      const files = e.target.files;
      setProduct({
        ...product,
        [name]: files ? files[0] : null,
      });
    } else {
      setProduct({
        ...product,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let imageUrl = '';

      if (product.img) {
        console.log('Selected image file:', product.img);
        const storage = getStorage();
        const storageRef = ref(storage, `product-images/${product.img.name}`);
        await uploadBytes(storageRef, product.img);
        imageUrl = await getDownloadURL(storageRef);
        console.log('Image uploaded, URL:', imageUrl);
      }

      const docRef = await addDoc(collection(db, 'products'), {
        name: product.name,
        description: product.description,
        quantity: product.quantity,
        category: product.category,
        brand: product.brand,
        price: product.price,
        discountedPrice: product.discountedPrice,
        costPrice: product.costPrice,
        img: imageUrl,  // Store the image URL in Firestore
      });

      console.log('Product added successfully with ID:', docRef.id);
      toast.success('Product added successfully!');

      // Reset the form after successful submission
      setProduct({
        name: '',
        description: '',
        quantity: 0,
        category: '',
        brand: '',
        price: 0,
        discountedPrice: 0,
        costPrice: 0,
        img: null,
      });

    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="productName">Product Name</Label>
        <Input id="productName" value={product.name} name='name' onChange={handleChange} placeholder="Enter product name" required />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={product.description} name='description' onChange={handleChange} placeholder="Enter product description" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" type="number" name='quantity' value={product.quantity} onChange={handleChange} placeholder="Enter quantity" required />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input id="category" value={product.category} name='category' onChange={handleChange} placeholder="Enter category" required />
        </div>
      </div>

      <div>
        <Label htmlFor="brand">Brand</Label>
        <Input id="brand" value={product.brand} name='brand' onChange={handleChange} placeholder="Enter brand name" required />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" value={product.price} name='price' onChange={handleChange} type="number" step="0.01" placeholder="Enter price" required />
        </div>
        <div>
          <Label htmlFor="discountedPrice">Discounted Price</Label>
          <Input id="discountedPrice" value={product.discountedPrice} name='discountedPrice' onChange={handleChange} type="number" step="0.01" placeholder="Enter discounted price" />
        </div>
        <div>
          <Label htmlFor="costPrice">Cost Price</Label>
          <Input id="costPrice" value={product.costPrice} name='costPrice' onChange={handleChange} type="number" step="0.01" placeholder="Enter cost price" required />
        </div>
      </div>

      <div>
        <Label>Product Image</Label>
        <Input
          id="img"
          type="file"
          name="img"
          onChange={handleChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />
        
      </div>

      <Button type="submit" className="w-full">Add Product</Button>
    </form>
  </div>
  );
};

export default AddProducts;
