import axios from "axios";
import {
  ADD_COIN_TO_WATCHLIST_FAILURE,
  ADD_COIN_TO_WATCHLIST_REQUEST,
  ADD_COIN_TO_WATCHLIST_SUCCESS,
  GET_USER_WATCHLIST_FAILURE,
  GET_USER_WATCHLIST_REQUEST,
  GET_USER_WATCHLIST_SUCCESS,
} from "./ActionType";

const baseUrl = "http://localhost:9091";

// Fetches the user's watchlist from the backend
export const getUserWatchlist = () => async (dispatch) => {
  dispatch({ type: GET_USER_WATCHLIST_REQUEST });
  try {
    const jwt = localStorage.getItem("jwt"); // Retrieve JWT here
    if (!jwt) {
      throw new Error("JWT not found. User is not authenticated.");
    }
    const response = await axios.get(`${baseUrl}/api/watchlist/user`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log(response.data);
    dispatch({ type: GET_USER_WATCHLIST_SUCCESS, payload: response.data });
  } catch (error) {
    console.log(error);
    dispatch({ type: GET_USER_WATCHLIST_FAILURE, error: error.message });
  }
};

// Adds or removes a coin from the user's watchlist
export const addItemToWatchlist = (coinId, jwt) => async (dispatch) => {
  dispatch({ type: ADD_COIN_TO_WATCHLIST_REQUEST });
  try {
    // The JWT is now passed directly to the function
    const response = await axios.patch(
      `${baseUrl}/api/watchlist/add/coin/${coinId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    console.log(response.data);
    dispatch({ type: ADD_COIN_TO_WATCHLIST_SUCCESS, payload: response.data });
  } catch (error) {
    console.log(error);
    dispatch({ type: ADD_COIN_TO_WATCHLIST_FAILURE, error: error.message });
  }
};