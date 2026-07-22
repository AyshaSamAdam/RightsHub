import axiosInstance from "../utils/axios"




export const createSituationApi = async (description : string, state : string, category : string) => {
     const response = await  axiosInstance.post("/situations/", {description, state, category})
     return response.data
}


export const getUserSituationApi = async () => {
       const response =  await  axiosInstance.get("/situations/get")
       return response.data

}