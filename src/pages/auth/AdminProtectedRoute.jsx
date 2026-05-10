import { Navigate,Outlet } from "react-router-dom";

const AdminProtectedRoute=()=>{
    const token=sessionStorage.getItem('token')
    const role=sessionStorage.getItem('role')

    return token && role === "admin"?
    <Outlet/>
    :
    <Navigate to="/dashboard" replace/>
}

export default AdminProtectedRoute