import axios from "axios";
import {
  ADD_PAYMENT_DETAILS_FAILURE,
  ADD_PAYMENT_DETAILS_REQUEST,
  ADD_PAYMENT_DETAILS_SUCCESS,
  GET_PAYMENT_DETAILS_FAILURE,
  GET_PAYMENT_DETAILS_REQUEST,
  GET_PAYMENT_DETAILS_SUCCESS,
  GET_WITHDRAWAL_HISTORY_FAILURE,
  GET_WITHDRAWAL_HISTORY_REQUEST,
  GET_WITHDRAWAL_HISTORY_SUCCESS,
  GET_WITHDRAWAL_REQUEST_FAILURE,
  GET_WITHDRAWAL_REQUEST_REQUEST,
  GET_WITHDRAWAL_REQUEST_SUCCESS,
  WITHDRAWAL_FAILURE,
  WITHDRAWAL_PROCEED_FAILURE,
  WITHDRAWAL_PROCEED_REQUEST,
  WITHDRAWAL_PROCEED_SUCCESS,
  WITHDRAWAL_REQUEST,
  WITHDRAWAL_SUCCESS,
} from "./ActionType";

const baseUrl = "http://localhost:9091";

export const withdrawalRequest =
  ({ amount, jwt }) =>
  async (dispatch) => {
    dispatch({ type: WITHDRAWAL_REQUEST });
    try {
      const response = await axios.post(
        `${baseUrl}/api/withdrawal/${amount}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      dispatch({ type: WITHDRAWAL_SUCCESS, payload: response.data });
      console.log("withdrawal success", response.data);
    } catch (error) {
      dispatch({ type: WITHDRAWAL_FAILURE, payload: error.message });
      console.log(error);
    }
  };

export const proceedWithdrawal =
  ({ id, jwt, accept }) =>
  async (dispatch) => {
    dispatch({ type: WITHDRAWAL_PROCEED_REQUEST });
    try {
      const response = await axios.patch(
        `${baseUrl}/api/admin/withdrawal/${id}/proceed/${accept}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      dispatch({
        type: WITHDRAWAL_PROCEED_SUCCESS,
        payload: response.data,
      });
      console.log("withdrawal proceed success", response.data);
    } catch (error) {
      dispatch({ type: WITHDRAWAL_PROCEED_FAILURE, payload: error.message });
      console.log(error);
    }
  };

export const getAllWithdrawalHistory =
  ({ jwt }) =>
  async (dispatch) => {
    dispatch({ type: GET_WITHDRAWAL_HISTORY_REQUEST });
    try {
      const response = await axios.get(`${baseUrl}/api/withdrawal`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      dispatch({
        type: GET_WITHDRAWAL_HISTORY_SUCCESS,
        payload: response.data,
      });
      console.log("withdrawal history success", response.data);
    } catch (error) {
      dispatch({
        type: GET_WITHDRAWAL_HISTORY_FAILURE,
        payload: error.message,
      });
      console.log(error);
    }
  };

export const getAllWithdrawalRequest =
  ({ jwt }) =>
  async (dispatch) => {
    dispatch({ type: GET_WITHDRAWAL_REQUEST_REQUEST });
    try {
      const response = await axios.get(`${baseUrl}/api/admin/withdrawal`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      dispatch({
        type: GET_WITHDRAWAL_REQUEST_SUCCESS,
        payload: response.data,
      });
      console.log("withdrawal request success", response.data);
    } catch (error) {
      dispatch({
        type: GET_WITHDRAWAL_REQUEST_FAILURE,
        payload: error.message,
      });
      console.log(error);
    }
  };

export const addpaymentDetails =
  ({ paymentDetails, jwt }) =>
  async (dispatch) => {
    dispatch({ type: ADD_PAYMENT_DETAILS_REQUEST });
    try {
      const response = await axios.post(
        `${baseUrl}/api/payment-details`,
        paymentDetails,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      dispatch({
        type: ADD_PAYMENT_DETAILS_SUCCESS,
        payload: response.data,
      });
      console.log("payment details success", response.data);
    } catch (error) {
      dispatch({ type: ADD_PAYMENT_DETAILS_FAILURE, payload: error.message });
      console.log(error);
    }
  };

export const getPaymentDetails =
  ({ jwt }) =>
  async (dispatch) => {
    dispatch({ type: GET_PAYMENT_DETAILS_REQUEST });
    try {
      const response = await axios.get(`${baseUrl}/api/payment-details`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      dispatch({
        type: GET_PAYMENT_DETAILS_SUCCESS,
        payload: response.data,
      });
      console.log("payment details success", response.data);
    } catch (error) {
      dispatch({ type: GET_PAYMENT_DETAILS_FAILURE, payload: error.message });
      console.log(error);
    }
  };
