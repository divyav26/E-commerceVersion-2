

import AdminSidbar from "./AdminSidbar";
import Header from "./Header";
import { Outlet } from "react-router-dom";




const AdminHome = () => {
  return (
    <div className="flex bg-gray-100  ">
    
    {/* Sidebar */}
    {/* <Sidebar /> */}
    <AdminSidbar />

    {/* Main Content */}
    <div className="flex-grow text-gray-800 ">
      <Header />

      {/* Main Content Section */}
        <main className="p-4 h-[90vh] overflow-y-auto">
          <Outlet />
        </main>
      
    </div>
  </div>
  )
}

export default AdminHome
