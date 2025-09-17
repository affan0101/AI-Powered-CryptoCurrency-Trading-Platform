import axios from "axios";
import {
  DEPOSIT_MONEY_FAILURE,
  DEPOSIT_MONEY_REQUEST,
  DEPOSIT_MONEY_SUCCESS,
  GET_USER_WALLET_FAILURE,
  GET_USER_WALLET_REQUEST,
  GET_USER_WALLET_SUCCESS,
  GET_WALLET_TRANSACTION_REQUEST,
  GET_WALLET_TRANSACTION_FAILURE,
  GET_WALLET_TRANSACTION_SUCCESS,
  TRANSFER_MONEY_REQUEST,
  TRANSFER_MONEY_SUCCESS,
  TRANSFER_MONEY_FAILURE,

} from "./ActionType";

const baseUrl = "http://localhost:9091";

// ---------------- Get Wallet ----------------
export const getUserWallet = (jwt) => async (dispatch) => {
  dispatch({ type: GET_USER_WALLET_REQUEST });

  try {
    const response = await axios.get(`${baseUrl}/api/wallet`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({ type: GET_USER_WALLET_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_USER_WALLET_FAILURE, payload: error.message });
    console.log(error);
  }
};

// ---------------- Get Wallet Transactions ----------------
export const getWalletTransaction =
  ({ jwt }) =>
  async (dispatch) => {
    dispatch({ type: GET_WALLET_TRANSACTION_REQUEST });

    try {
      const response = await axios.get(`${baseUrl}/api/wallet/transactions`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      dispatch({
        type: GET_WALLET_TRANSACTION_SUCCESS,
        payload: response.data,
      });
      console.log("wallet transaction ", response.data);
    } catch (error) {
      dispatch({
        type: GET_WALLET_TRANSACTION_FAILURE,
        payload: error.message,
      });
      console.log(error);
    }
  };

export const depositMoney =
  ({ jwt, orderId, paymentId, navigate }) =>
  async (dispatch) => {
    dispatch({ type: DEPOSIT_MONEY_REQUEST });
    try {
      const response = await axios.put(`${baseUrl}/api/wallet/deposite`, 
        null, // No request body
        {
          params: {
            order_id: orderId,
            payment_id: paymentId,
          },
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      dispatch({
        type: DEPOSIT_MONEY_SUCCESS,
        payload: response.data,
      });

      navigate("/wallet");
      console.log(response.data);
    } catch (error) {
      dispatch({
        type: DEPOSIT_MONEY_FAILURE,
        payload: error.message,
      });
      console.log(" error", error);
    }
  };
// ---------------- Payment Handler ----------------
export const paymentHandler =
  ({ jwt, amount, paymentMethod }) =>
  async (dispatch) => {
    dispatch({ type: DEPOSIT_MONEY_REQUEST });
    try {
      const response = await axios.post(
        `${baseUrl}/api/payment/${paymentMethod}/amount/${amount}`,
        null, 
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      window.location.href=response.data.payment_url;

     //dispatch({ type: DEPOSIT_MONEY_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: DEPOSIT_MONEY_FAILURE, payload: error.message });
      console.log(" error", error);
    }
  };



  // ---------------- Transfer Money ----------------
export const transferMoney =
  ({ jwt, walletId, reqData }) =>
  async (dispatch) => {
    dispatch({ type: TRANSFER_MONEY_REQUEST });
    try {
      const response = await axios.put(
        `${baseUrl}/api/wallet/${walletId}/transfer`,
        reqData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      dispatch({ type: TRANSFER_MONEY_SUCCESS, payload: response.data });
      console.log("transfer money success", response.data);
    } catch (error) {
      dispatch({ type: TRANSFER_MONEY_FAILURE, payload: error.message });
      console.log(" error", error);
    }
  };
