// State/chatbot/Reducer.js
import {
  SEND_CHAT_MESSAGE_REQUEST,
  SEND_CHAT_MESSAGE_SUCCESS,
  SEND_CHAT_MESSAGE_FAILURE,
  CLEAR_CHAT_RESPONSE,
  CLEAR_CHAT_ERROR
} from './ActionTypes';

const initialState = {
  loading: false,
  response: null,
  error: null
};

const chatbotReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEND_CHAT_MESSAGE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case SEND_CHAT_MESSAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        response: action.payload,
        error: null
      };

    case SEND_CHAT_MESSAGE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        response: null
      };

    case CLEAR_CHAT_RESPONSE:
      return {
        ...state,
        response: null
      };

    case CLEAR_CHAT_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

export default chatbotReducer;