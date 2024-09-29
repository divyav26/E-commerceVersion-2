import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '@/firebase/FirebaseConfig'; // Import Firestore
import { showErrorToast, showSuccessToast } from '@/commanComponents/CommanToast';
import Layout from '../layout/Layout';

import { doc, setDoc } from 'firebase/firestore';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showErrorToast('Passwords do not match.');
      return;
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // console.log('User created:', user);

      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
        isAdmin: false, // Default value for isAdmin, change if needed
        createdAt: new Date(), // Store the timestamp of user creation
      });
      // console.log('User data stored in Firestore');
      showSuccessToast('Registration successfully completed!!!');
      navigate('/login');
    } catch (error) {
      // console.error("Error registering user:", error);
      showErrorToast('Registration failed. Please try again.');
    }
  };

  return (
    <Layout>
      <section className="">
  <div className="container h-full py-10 flex justify-center items-center">
    <div className="flex  flex-col lg:flex-row lg:w-[70%] items-center justify-center border border-gray-200 rounded-lg bg-white bg-transparent">
      
      {/* Image Section */}
      <div className="w-full lg:w-6/12">
        <img
          src="https://www.womgp.com/blog/wp-content/uploads/2020/03/online-shopping.jpg"
          className="w-full h-[400px] object-cover"
          alt="Illustration" />
      </div>

      {/* Form Section */}
      <div className="md:w-full lg:ms-6 lg:w-5/12">
        <h1 className="text-xl font-bold mb-6 text-center lg:text-left">User Registration</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div className="relative">
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              className="block w-full px-4 py-2 text-gray-800 bg-transparent border rounded-lg outline-none appearance-none focus:border-blue-500 focus:ring-0 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="name"
              className="absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
              Name
            </label>
          </div>

          {/* Email Input */}
          <div className="relative">
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              className="block w-full px-4 py-2 text-gray-800 bg-transparent border rounded-lg outline-none appearance-none focus:border-blue-500 focus:ring-0 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="email"
              className="absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
              Email
            </label>
          </div>

          {/* Password Input */}
          <div className="relative">
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              className="block w-full px-4 py-2 text-gray-800 bg-transparent border rounded-lg outline-none appearance-none focus:border-blue-500 focus:ring-0 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="password"
              className="absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
              Password
            </label>
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <input 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              id="confirmPassword"
              className="block w-full px-4 py-2 text-gray-800 bg-transparent border rounded-lg outline-none appearance-none focus:border-blue-500 focus:ring-0 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="confirmPassword"
              className="absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
              Confirm Password
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 px-5 text-sm font-semibold text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-150">
            Register
          </button>
        </form>
      </div>
    </div>
  </div>
</section>

    </Layout>
  );
};

export default Register;
