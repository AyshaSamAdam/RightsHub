import type React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import {ROUTES} from '../constants/routes'


const ProtectRoute = ({children} : {children : React.ReactNode}) => {
    const {user, isLoading} = useAuth()

    if (isLoading) {
        return <div>  Is Loading........</div>
    }

   if (!user) {
    return <Navigate  to={ROUTES.LOGIN} />
   }
    if (!user.emailVerified) {
    return <Navigate to={ROUTES.VERIFY_EMAIL}  />
   }
  

   return children

}

export default  ProtectRoute 

















// Case 1 

// isLoading : true 
// we dont know yet if user is Logged in 
// show a loading spinner or text Dont redirect yet!


// Case 2

// Isloading = false user = null
//  -> definetly not logge din 
//  -> redirect to /login   


// Case 3

// isloading = false  user exists
// logged in !
//  show the cildren (dashboard )

// in App.routes.tsx  so dashboard is children 
{/* <ProtectedRoute>
   <DashBoard></DashBoard>
<ProtectedRoute /> */}