/* eslint-disable react/prop-types */
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children, role })=> {
    const { userData, isAuthin } = useContext(AuthContext);
  
    if (!userData || !isAuthin) {
      return <Navigate to="/www.bookito.com/login" />;
    }
  
    const hasAccess = role ? role.includes(userData.role) : true;
  
    if (role && !hasAccess) {
      return <Navigate to="/www.bookito.com/forbidden" />;
    }
    return children;
  }
  export default ProtectedRoute;