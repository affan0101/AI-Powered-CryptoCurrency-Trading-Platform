import axios from "axios";
import { 
  FETCH_COIN_BY_ID_FAILURE, 
  FETCH_COIN_BY_ID_SUCCESS, 
  FETCH_COIN_LIST_REQUEST, 
  FETCH_COIN_MARKET_CHART_SUCCESS, 
  FETCH_TOP_50_COINS_FAILURE, 
  FETCH_TOP_50_COINS_REQUEST, 
  FETCH_TOP_50_COINS_SUCCESS, 
  FETCH_COIN_MARKET_CHART_REQUEST, 
  FETCH_COIN_MARKET_CHART_FAILURE, 
  FETCH_COIN_BY_ID_REQUEST, 
  FETCH_COIN_DETAILS_REQUEST, 
  SEARCH_COIN_REQUEST, 
  SEARCH_COIN_SUCCESS, 
  SEARCH_COIN_FAILURE,
  FETCH_COIN_LIST_SUCCESS,
  FETCH_COIN_LIST_FAILURE,
  // Make sure these are imported
  FETCH_COIN_DETAILS_SUCCESS,
  FETCH_COIN_DETAILS_FAILURE
} from "./ActionType";

const baseUrl = "http://localhost:9091";

export const getCoinList = (page) => async (dispatch) => {
  dispatch({ type: FETCH_COIN_LIST_REQUEST });

  try {
    const { data } = await axios.get(`${baseUrl}/coins?page=${page}`);
    console.log("coin list", data);
    
    dispatch({ type: FETCH_COIN_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_COIN_LIST_FAILURE, payload: error.message });
    console.log(error);
  }
};

export const getTop50CoinList = () => async (dispatch) => {
  dispatch({ type: FETCH_TOP_50_COINS_REQUEST});

  try {
    const response = await axios.get(`${baseUrl}/coins/top50`);
    console.log("top 50", response.data);
    dispatch({ type: FETCH_TOP_50_COINS_SUCCESS, payload: response.data });

  } catch (error) {
    dispatch({ type: FETCH_TOP_50_COINS_FAILURE, payload: error.message });
    console.log(error);
  }
};


export const fetchMarketChart = ({coinId, days,jwt}) => async (dispatch) => {
  dispatch({ type: FETCH_COIN_MARKET_CHART_REQUEST});
  try {
    const response = await axios.get(`${baseUrl}/coins/${coinId}/chart?days=${days}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },    
    });
    console.log("market chart", response.data);
    dispatch({ type: FETCH_COIN_MARKET_CHART_SUCCESS, payload: response.data });
  }
  catch (error) {
    dispatch({ type: FETCH_COIN_MARKET_CHART_FAILURE, payload: error.message });
    console.log(" error",error);
  }
};

export const fetchCoinById = (coinId) => async (dispatch) => {
  dispatch({ type: FETCH_COIN_BY_ID_REQUEST});
  try {
    const response = await axios.get(`${baseUrl}/coins/${coinId}`);
    console.log("coin by id", response.data);
    dispatch({ type: FETCH_COIN_BY_ID_SUCCESS, payload: response.data });
  }
  catch (error) {
    dispatch({ type: FETCH_COIN_BY_ID_FAILURE, payload: error.message });
    console.log(" error",error);
  }
};


export const fetchCoinDetails = ({coinId,jwt}) => async (dispatch) => {
  dispatch({ type: FETCH_COIN_DETAILS_REQUEST}); // Use the correct request type
  try {
    const response = await axios.get(`${baseUrl}/coins/details/${coinId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },    
    });
    console.log("coin details", response.data);
    // FIX: Dispatch the correct success action type
    dispatch({ type: FETCH_COIN_DETAILS_SUCCESS, payload: response.data }); 
  }
  catch (error) {
    // FIX: Dispatch the correct failure action type
    dispatch({ type: FETCH_COIN_DETAILS_FAILURE, payload: error.message }); 
    console.log(" error",error);
  }
};

export const searchCoins = (keyword) => async (dispatch) => {
  dispatch({ type: SEARCH_COIN_REQUEST });

  try {
    const response = await axios.get(`${baseUrl}/coins/search?q=${keyword}`);
    console.log("search coin response", response.data);
    
    // Handle different possible response structures
    let coins = [];
    if (response.data.coins) {
      coins = response.data.coins;
    } else if (Array.isArray(response.data)) {
      coins = response.data;
    }
    
    dispatch({ type: SEARCH_COIN_SUCCESS, payload: { coins } });
  } catch (error) {
    console.log("error", error);
    dispatch({ type: SEARCH_COIN_FAILURE, payload: error.message });
  }
};