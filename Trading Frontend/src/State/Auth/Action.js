import axios from "axios";
import {
  LOGIN_FAILIURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  REGISTER_FAILIURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  GET_USER_FAILIURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  LOGOUT
} from "./ActionType";

const baseUrl = "http://localhost:9091";

export const register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });

  try {
    const response = await axios.post(`${baseUrl}/auth/signup`, userData);
    const user = response.data;
    console.log(user);

    dispatch({ type: REGISTER_SUCCESS, payload: user.jwt });
    localStorage.setItem("jwt", user.jwt);
    
    // Get user details after successful registration
    dispatch(getUser(user.jwt));
  } catch (error) {
    dispatch({ type: REGISTER_FAILIURE, payload: error.message });
    console.log(error);
  }
};

export const login = (userData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const response = await axios.post(`${baseUrl}/auth/signin`, userData.data);
    const user = response.data;
    console.log(user);

    dispatch({ type: LOGIN_SUCCESS, payload: user.jwt });
    localStorage.setItem("jwt", user.jwt);
    
    // Get user details after successful login
    dispatch(getUser(user.jwt));
    
    userData.navigate("/");
  } catch (error) {
    dispatch({ type: LOGIN_FAILIURE, payload: error.message });
    console.log(error);
  }
};

export const getUser = (jwt) => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });

  try {
    const response = await axios.get(`${baseUrl}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const user = response.data;
    console.log(user);

    dispatch({ type: GET_USER_SUCCESS, payload: user });
  } catch (error) {
    dispatch({ type: GET_USER_FAILIURE, payload: error.message });
    console.log(error);
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("jwt");
  dispatch({ type: LOGOUT });
};