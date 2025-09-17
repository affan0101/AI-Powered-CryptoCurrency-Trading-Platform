import { 
  FETCH_COIN_BY_ID_FAILURE, 
  FETCH_COIN_LIST_REQUEST,
  FETCH_TOP_50_COINS_FAILURE, 
  FETCH_TOP_50_COINS_REQUEST, 
  FETCH_TOP_50_COINS_SUCCESS, 
  FETCH_COIN_MARKET_CHART_REQUEST,
  FETCH_COIN_MARKET_CHART_FAILURE, 
  FETCH_COIN_BY_ID_REQUEST, 
  SEARCH_COIN_REQUEST, 
  SEARCH_COIN_SUCCESS, 
  SEARCH_COIN_FAILURE, 
  FETCH_COIN_LIST_SUCCESS, 
  FETCH_COIN_DETAILS_SUCCESS, 
  FETCH_COIN_LIST_FAILURE,
  FETCH_COIN_DETAILS_FAILURE, 
  FETCH_COIN_MARKET_CHART_SUCCESS,
  FETCH_COIN_DETAILS_REQUEST // Import this
} from "./ActionType";

const initialState = {
  loading: false,
  coinList: [], 
  top50: [],
  coinDetails: null,
  marketChart: { data: [], loading: false },
  error: null,
  coinById: null,
  searchCoinList: [],
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_COIN_LIST_REQUEST:
    case FETCH_TOP_50_COINS_REQUEST:
    case FETCH_COIN_BY_ID_REQUEST:
    case SEARCH_COIN_REQUEST:
    case FETCH_COIN_DETAILS_REQUEST: // FIX: Add this case to handle loading state
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_COIN_MARKET_CHART_REQUEST:
      return {
        ...state,
        marketChart: { data: [], loading: true },
        error: null,
      };  
    
    case FETCH_COIN_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        coinList: action.payload,
        error: null,
      }; 

    case FETCH_TOP_50_COINS_SUCCESS:
      return {
        ...state,
        loading: false,
        top50: action.payload,
        error: null,
      };

    case FETCH_COIN_MARKET_CHART_SUCCESS:
      return {
        ...state,
        marketChart: { data: action.payload.prices, loading: false },
        error: null,
      };

   case SEARCH_COIN_SUCCESS:
  return {
    ...state,
    loading: false,
    searchCoinList: action.payload.coins || [], // Handle both structures
    error: null,
  }; 

    case FETCH_COIN_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        coinDetails: action.payload,
        error: null,  
      };

    case FETCH_COIN_MARKET_CHART_FAILURE:
      return {
        ...state,
        marketChart: { data: [], loading: false },
        error: null,
      };  

    case FETCH_COIN_LIST_FAILURE:
    case FETCH_TOP_50_COINS_FAILURE:
    case FETCH_COIN_BY_ID_FAILURE:
    case FETCH_COIN_DETAILS_FAILURE:
    case SEARCH_COIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default Reducer;