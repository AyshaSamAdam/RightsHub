import { createBrowserRouter, Navigate } from "react-router-dom";
import {ROUTES} from './constants/routes'
import ProtectRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Result from './pages/Result'
import PublicRoute from "./components/PublicRoute";

export const router = createBrowserRouter([

    {
            path : '/',
            element : <Navigate to={ROUTES.REGISTER}  />
    },  
       {
           path : ROUTES.REGISTER,
           element : <PublicRoute  ><Register  /></PublicRoute>
    },
    {
           path : ROUTES.LOGIN,  
           element : <PublicRoute> <Login  /></PublicRoute>
    },
    {
          path : ROUTES.VERIFY_EMAIL,
          element : <PublicRoute><VerifyEmail /></PublicRoute> 
    },
    {
        path: ROUTES.FORGOT_PASSWORD,
        element:  <PublicRoute><ForgotPassword  /></PublicRoute> 
    },
    {
        path : ROUTES.RESET_PASSWORD,
        element : <ResetPassword />
    }, 
    {
        path : ROUTES.DASHBOARD,
        element : ( 
            <ProtectRoute>
                <Dashboard  />
            </ProtectRoute>
        )
    },
    {
        path : ROUTES.RESULTS,
        element : (
            <ProtectRoute>
               <Result  />
            </ProtectRoute>
        )
    }

])

