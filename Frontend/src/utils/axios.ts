import axios, {AxiosError} from "axios";

const BASE_URL = import.meta.env.VITE_API_URL


let accessToken: string | null = null

export const setAccessToken = (token : string | null) : void => {
         accessToken = token

} 

const axiosInstance = axios.create({
     baseURL : BASE_URL,
     withCredentials : true
})


// REQUEST INTERCEPTOR IS BEING CALLED ON EVERY REQUEST if access Token exist attach it to to Authorization header 
axiosInstance.interceptors.request.use(

//  config INCLUDES everything about the request url method(get / post) http headers body data everything
    (config) => {

        // so if u have accessToken attach it to the Headers

          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
          }

          return config

    },
    (error) => Promise.reject(error)
)


//  this runs after every response comes back from backened
//  when does it need to do something?
// when response is 401 (unauthorized)
// means accessToken expired
// need to call /auth/refresh-token 
// get new accessToken  
// retry the original request

// also .use  takes 2 parameters sucess handler and error handler 

axiosInstance.interceptors.response.use(
    //  if success just return response 
    // if request succeed (200, 201, etc)
    // just return the res as-is 
    // dont do anything special component receive the data normally 
    (response) => response,


// when A request fails axios saves the original request details in error.config 
//  we save it so we can retry it later after  getting a new token 
//  as any bcz typescript does not know about our custom _retry property we'e about to add 
// 

// BOTH MUST BE TRUE to attempt refresh 
// error.response?.status === 401 means this si not a not Uathorized error? means accessToken is expired 
// !originalRequest._retry have we already tried to refresh if we already tried it and it failed, dont try agian (prevent infinite loop ) 



    async (error: AxiosError) => {

        const originalRequest = error.config as any

        if (error.response?.status === 401 &&  !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh-token')) {
            
            originalRequest._retry = true

            try {
                const response = await axios.post(
                    `${BASE_URL}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                )

                const newAccessToken = response.data.accessToken
                setAccessToken(newAccessToken)


                //  the original request that failed still has the old expired token in its headers we update it with new token so weh  we retry it it works 
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

//  NOW RETRY THE ORIGINAL REQUEST WITH THE NEW TOKEN IN THE HEADERS 
                return axiosInstance(originalRequest)

            } catch {

// if the refresh token request failed : 
// refrehs token expired (7 days passed )
// or user log out on another device 
// clear the token from memory 
// no point keeping an invalid token 

                setAccessToken(null)
                return Promise.reject(error)
            }
        }

        return Promise.reject(error)
    }
)


export  default axiosInstance