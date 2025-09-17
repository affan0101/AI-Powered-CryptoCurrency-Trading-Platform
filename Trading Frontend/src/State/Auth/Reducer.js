import {
  LOGIN_FAILIURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  REGISTER_FAILIURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
    GET_USER_FAILIURE,
    GET_USER_REQUEST,
    GET_USER_SUCCESS
} from "./ActionType";



const initialState={
    user:null,
    loading:false,
    error:null,
    jwt:null
}

export const authReducer=(state=initialState,action)=>{
    switch(action.type){
        case "REGISTER_REQUEST":
        case "LOGIN_REQUEST":
        case "GET_USER_REQUEST":    
            return{
                ...state,
                loading:true,
                error:null
            }
        case "REGISTER_SUCCESS":
        case "LOGIN_SUCCESS":
            
            return{
                ...state,
                loading:false,
                jwt:action.payload,
                error:null
            }

        case "GET_USER_SUCCESS":
            return{
                ...state,
                loading:false,
                user:action.payload,
                error:null
            }
        case "REGISTER_FAILIURE":
        case "LOGIN_FAILIURE":
        case "GET_USER_FAILIURE":    
            return{
                ...state,
                loading:false,
                error:action.payload
            }

        case "LOGOUT":
            return{
                ...initialState,
                
               
            }    
       default:
        return state;
    }
}

export default authReducer;