import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { auth, db } from '@/firebase/FirebaseConfig';
import { showErrorToast, showSuccessToast } from '@/commanComponents/CommanToast';
import Layout from '../layout/Layout';
import { doc, getDoc } from 'firebase/firestore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Attempting to sign in...");

      // Sign in the user with Firebase Auth
      const userData = await signInWithEmailAndPassword(auth, email, password);
      const user = userData.user;
      console.log("User signed in:", user);

      // Fetch user data from Firestore using user.uid
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User data from Firestore:", userData);

        // Check if the user has the isAdmin field
        const isAdmin = userData.isAdmin === true;
        const name = userData.name || ''; // get name from firebase 
        navigate("/admin/dashboard/AdminDashboard");
        // console.log("Is Admin: ", isAdmin);

        // Store user data in cookies
        Cookies.set("user", JSON.stringify({name, email: user.email, isAdmin }));
        console.log("User data stored in cookies");

        // Get user token
        const userToken = await user.getIdToken();
        console.log("User token:", userToken);
        Cookies.set("user_token", userToken);
        Cookies.set("user_id", user.uid);

        // Navigate based on user role
        if (isAdmin) {
          // console.log("Navigating to /admin/dashboard");
          navigate("/adminhome/dashboard");
          showSuccessToast('Login successful!');
        } else {
          // console.log("Navigating to /");
          navigate("/");
          showSuccessToast('Login successful!');
        }

       
      } else {
        console.error("User document not found in Firestore.");
        throw new Error("User data not found.");
      }
    } catch (error: any) {
      console.error("Login error:", error.message);
      showErrorToast(`Login failed. ${error.message}`);
    }
  };

  // useEffect(() => {
	// 	Cookies.remove("user_id")
  //   Cookies.remove("user_token");
  //   Cookies.remove("user"); 
	// }, []);

  return (
    <Layout>
   <section className="bg-gray-50">
  <div className="container h-full px-6 py-10 flex justify-center items-center">
    <div className="flex flex-col lg:flex-row lg:w-[60%] h-[70vh] p-6 items-center justify-center border border-gray-200 rounded-lg shadow-lg bg-white">
      
      <div className="mb-12 md:mb-0 md:w-full lg:w-6/12">
        <img
          src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
          className="w-full h-[200px] object-cover"
          alt="Illustration" />
      </div>

      <div className="md:w-full lg:ms-6 lg:w-5/12">
        <p className='text-xl text-gray-900 font-bold mb-6 text-center lg:text-left'>
          Login to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <input 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              className="block w-full px-4 py-2 text-gray-800 bg-transparent border rounded-lg outline-none appearance-none focus:border-blue-500 focus:ring-0 peer"
              placeholder=" " 
              required 
            />
            <label 
              htmlFor="email" 
              className="absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
              Email address
            </label>
          </div>

          {/* Password Input */}
          <div className="relative">
            <input 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 px-5 text-sm font-semibold text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-150">
            Login
          </button>
        </form>
      </div>
    </div>
  </div>
</section>

    </Layout>
  );
};

export default Login;
