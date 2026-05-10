import React from 'react'
import { Navigate,Outlet } from 'react-router-dom'

const  ProtectedRoute=({children})=> {
      const token=sessionStorage.getItem('token')
      
  return token?<Outlet/> : <Navigate to='/' replace/>
}

export default ProtectedRoute