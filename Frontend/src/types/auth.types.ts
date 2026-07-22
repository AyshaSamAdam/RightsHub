

// We  CREATE THE USER INTERFACE SEPERATELY SO WE CAN REUSE IT INSIDE OTHER INTERFACES ( LIEK loginResponse and RegisterResponse interface ) INSTEAD OF REPEATING ALL THE FIELDS 

export interface User {

    id : string,
    firstName : string,
    lastName : string,
    email : string,
    emailVerified : boolean

}

export interface LoginResponse {
            message : string,
            accessToken : string,
            user : User
}

export interface RegisterResponse {
                message : string,
                user : User
}

export interface ApiError {
       message : string
}