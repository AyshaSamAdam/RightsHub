import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMeApi, logOutApi } from "../api/authApi";
import {  setAccessToken } from "../utils/axios";
import type { User } from "../types/auth.types";
import axios from "axios";


const BASE_URL = import.meta.env.VITE_API_URL



interface AuthContextType {
   user : User | null,
   isLoading : boolean,
   login : (user : User, accessToken: string) => void 
   logout : () => void
}



const AuthContext = createContext<AuthContextType | null>(null)


export function AuthProvider({children}: {children: React.ReactNode}) {


    const queryClient = useQueryClient();

      const {data, isLoading} = useQuery({
                queryKey : ["me"],
                queryFn : async () => {
                    try{
                        const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh-token`, {} , {withCredentials : true})
                        setAccessToken(refreshResponse.data.newAccessToken)
                    }
                    catch(error) {
                      return null
                    }  
                  
                    return getMeApi()
                },
                retry : false ,
                refetchOnWindowFocus : false,
                // WE GOT THSI ERROR WHEN FIRST TIME I TIED IN BROWSER IT WAS GETMEAPI EVERY TIME WE SWITCH TABS SO WE SET IT FALSE 
                // authApi.ts:32  GET http://localhost:5000/api/auth/me 401 (Unauthorized)
                staleTime : 5 * 60 * 1000
                })

      const user = data?.user ?? null


      const login = (userData :User, accessToken : string) => {
      
                setAccessToken(accessToken)
                queryClient.setQueryData(["me"], {user: userData}) 
    }


      const logout = async() => {
        queryClient.setQueryData(['me'], null)
           try{
             await logOutApi()
           
           }
           catch(error:any) {
            
           }
             setAccessToken(null)
            
           
      }


    return (
      
        <AuthContext.Provider value={{user, isLoading, login, logout}}>
                {children}
        </AuthContext.Provider>
        
    )
}



export  function useAuth() {
     const context = useContext(AuthContext)
     if (!context) {
        throw new Error("UseAuth must be used inside AuthProvider")
     }
      return context
    
}



































// interface AuthContextType {
//    user : User | null,
//    isLoading : boolean,
//    login : (user : User, accessToken: string) => void 
//    logout : () => void
// }



// const AuthContext = createContext<AuthContextType | null> (null)
// 




//  createContext creates a box that holds and shares data across components 
//  what this context is gonna provide to the components is defined in  AuthContextType
//  Any component that uses useAuth() gets all of these 
// user
// isLoading 
// login : function
// logout : function

//  intially null bcz user hasnt logged in yet
// starts as null (null)


// Auth Provider function 
// it fills the context with real data



//  login takes 2 things user accessToken
// it needs to do 2 things 
// save the access token 
// save the user in React Query Cache 



                // if logge in we wil do this like use Query and just get the adta from getMeApi and passe dit to other components 
                // and if not logged in then login function is gonna implement means the login.jsx page user gives the data and access Token is made and we  call login() this function i login.jsx and pass it the data and here we receive it  and setAccesstoken (to that accessToken )
                // and store teh user data in queryClient 