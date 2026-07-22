
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import {ROUTES} from '../constants/routes'

function PublicRoute({children} : {children : React.ReactNode}) {

     const {user, isLoading} = useAuth()
     
    
        if (isLoading) {
        return <div>  Is Loading........</div>
    }

     if (user && user.emailVerified) {
    return <Navigate  to={ROUTES.DASHBOARD} />
   }

   return children

}

export default PublicRoute
