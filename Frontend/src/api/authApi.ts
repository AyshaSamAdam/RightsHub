//    THIS FILE CONTAINS ALL API CALLS REALTED TO AUTH 


import  AxiosInstance  from "../utils/axios";


import type { LoginResponse, RegisterResponse } from "../types/auth.types";



export const registerApi = async (firstName :string, lastName : string, email : string, password : string) : Promise<RegisterResponse> => {

              const response = await AxiosInstance.post('/auth/register', {firstName, lastName, email, password})

                     return response.data

}

export const loginApi = async (email :string, password : string) : Promise<LoginResponse>  => {
      const response = await AxiosInstance.post("/auth/login", {email, password})

      return response.data
}

export const logOutApi = async () => {
         const response = await AxiosInstance.post("/auth/logout" , {})
         return response.data
}   

//  No body neeeded {} GET requests dont have a body
export const getMeApi = async () => {
      const response =  await AxiosInstance.get("/auth/me") 
      return response.data
}

export const verifyOTPApi = async (otp :string) => {
             const response = await AxiosInstance.post("/auth/verify-otp", {otp})
             return response.data

}

export const resendOTPApi = async () => {
         const response = await AxiosInstance.post("/auth/resend-verification-otp", {})
         return response.data
}

export const forgotPasswordApi =  async (email :string) => {
       const response = await AxiosInstance.post("/auth/forgot-password", {email})
       return response.data
}

export const resetPasswordApi = async (resetToken : string , newPassword : string ) => {
       const response = await AxiosInstance.post("/auth/reset-password", {resetToken, newPassword})
       return response.data 
}