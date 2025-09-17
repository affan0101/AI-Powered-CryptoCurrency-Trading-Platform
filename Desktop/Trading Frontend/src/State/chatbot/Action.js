// State/chatbot/Action.js
import {
  SEND_CHAT_MESSAGE_REQUEST,
  SEND_CHAT_MESSAGE_SUCCESS,
  SEND_CHAT_MESSAGE_FAILURE,
  CLEAR_CHAT_RESPONSE,
  CLEAR_CHAT_ERROR
} from './ActionTypes';
import axios from 'axios';

 const baseUrl = "http://localhost:5454";

export const sendChatMessage = (message) => async (dispatch) => {
  dispatch({ type: SEND_CHAT_MESSAGE_REQUEST });
  
  try {
    const response = await axios.post(`${baseUrl}/api/chat/chat`, message, { 
      headers: {
        'Content-Type': 'text/plain'
      }
    });

    if (response.data.success) {
      dispatch({
        type: SEND_CHAT_MESSAGE_SUCCESS,
        payload: {
          type: 'text',
          message: response.data.data
        }
      });
    } else {
      dispatch({
        type: SEND_CHAT_MESSAGE_FAILURE,
        payload: response.data.message || 'Failed to get response'
      });
    }
  } catch (error) {
    dispatch({
      type: SEND_CHAT_MESSAGE_FAILURE,
      payload: error.response?.data?.message || error.message || 'Network error'
    });
  }
};

export const getCoinDetails = (coinName) => async (dispatch) => {
  dispatch({ type: SEND_CHAT_MESSAGE_REQUEST });
  
  try {
    const response = await axios.post(`${baseUrl}/api/chat/coin-details`, coinName, {
      headers: {
        'Content-Type': 'text/plain'
      }
    });

    if (response.data.success) {
      dispatch({
        type: SEND_CHAT_MESSAGE_SUCCESS,
        payload: {
          type: 'coin',
          data: response.data.data
        }
      });
    } else {
      dispatch({
        type: SEND_CHAT_MESSAGE_FAILURE,
        payload: response.data.message || 'Failed to get coin data'
      });
    }
  } catch (error) {
    dispatch({
      type: SEND_CHAT_MESSAGE_FAILURE,
      payload: error.response?.data?.message || error.message || 'Network error'
    });
  }
};

export const clearChatResponse = () => ({
  type: CLEAR_CHAT_RESPONSE
});

export const clearChatError = () => ({
  type: CLEAR_CHAT_ERROR
});