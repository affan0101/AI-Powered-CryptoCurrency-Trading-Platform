import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./Auth/Reducer";
import coinReducer from "./Coin/Reducer";
import walletReducer from "./Wallet/Reducer";
import withdrawalReducer from "./withdrawal/Reducer";
import orderReducer from "./order/Reducer";
import assetReducer from "./Asset/Reducer";
import watchlistReducer from "./watchlist/Reducer";
import chatbotReducer from "./chatbot/Reducer";




const rootReducer = combineReducers({
  auth:authReducer,
  coin:coinReducer,
  wallet:walletReducer,
  withdrawal:withdrawalReducer,
  order:orderReducer,
  asset:assetReducer,
  watchlist:watchlistReducer,
  chatbot: chatbotReducer,

});



export const store = legacy_createStore(rootReducer,applyMiddleware(thunk));