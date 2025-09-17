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

const initialState = {
  userWallet: null,
  transactions: [],
  loading: false,
  error: null,
};

const walletReducer = (state = initialState, action) => {
  switch (action.type) {
    // --- REQUESTS ---
    // Set loading to true and clear any previous errors for all async actions.
    case GET_USER_WALLET_REQUEST:
    case GET_WALLET_TRANSACTION_REQUEST:
    case DEPOSIT_MONEY_REQUEST:
    case TRANSFER_MONEY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    // --- WALLET STATE CHANGES ---
    case GET_USER_WALLET_SUCCESS:
      return {
        ...state,
        loading: false,
        userWallet: action.payload,
        error: null,
      };
    
    
    case DEPOSIT_MONEY_SUCCESS:
    case TRANSFER_MONEY_SUCCESS:
        return {
            ...state,
            loading: false,
            userWallet: action.payload,
            error: null,
        };
    
    case GET_USER_WALLET_FAILURE:
    case DEPOSIT_MONEY_FAILURE:
    case TRANSFER_MONEY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // --- TRANSACTIONS STATE CHANGES ---
    case GET_WALLET_TRANSACTION_SUCCESS:
      return {
        ...state,
        loading: false,
        transactions: action.payload,
        error: null,
      };

    case GET_WALLET_TRANSACTION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // --- DEFAULT ---
    default:
      return state;
  }
};

export default walletReducer;
