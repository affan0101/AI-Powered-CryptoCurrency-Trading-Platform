import axios from "axios";
import {
  GET_ALL_ORDERS_FAILURE,
  GET_ALL_ORDERS_REQUEST,
  GET_ALL_ORDERS_SUCCESS,
  GET_ORDER_FAILURE,
  GET_ORDER_REQUEST,
  GET_ORDER_SUCCESS,
  PAY_ORDER_FAILURE,
  PAY_ORDER_REQUEST,
  PAY_ORDER_SUCCESS,
} from "./ActionType";

const baseUrl = "http://localhost:9091";

export const payOrder =
  ({ jwt, orderData }) =>
  async (dispatch) => {
    dispatch({ type: PAY_ORDER_REQUEST });
    try {
      const { data } = await axios.post(
        `${baseUrl}/api/orders/pay`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      dispatch({ type: PAY_ORDER_SUCCESS, payload: data });
      console.log("pay order success", data);
    } catch (error) {
      console.log("error", error);
      dispatch({ type: PAY_ORDER_FAILURE, payload: error.message });
    }
  };

export const getOrderById =
  ({ jwt, orderId }) =>
  async (dispatch) => {
    dispatch({ type: GET_ORDER_REQUEST });
    try {
      const { data } = await axios.get(`${baseUrl}/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      dispatch({ type: GET_ORDER_SUCCESS, payload: data });
      console.log("get order success", data);
    } catch (error) {
      console.log("error", error);
      dispatch({ type: GET_ORDER_FAILURE, payload: error.message });
    }
  };

export const getAllOrders = (jwt) => async (dispatch) => {
  dispatch({ type: GET_ALL_ORDERS_REQUEST });
  try {
    const { data } = await axios.get(`${baseUrl}/api/orders`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch({ type: GET_ALL_ORDERS_SUCCESS, payload: data });
    console.log("get all orders success", data);
  } catch (error) {
    console.log("error", error);
    dispatch({ type: GET_ALL_ORDERS_FAILURE, payload: error.message });
  }
};