import axios from "axios";
import {
  GET_ASSET_DETAILS_FAILURE,
  GET_ASSET_DETAILS_REQUEST,
  GET_ASSET_DETAILS_SUCCESS,
  GET_ASSET_FAILURE,
  GET_ASSET_REQUEST,
  GET_ASSET_SUCCESS,
  GET_USER_ASSETS_FAILURE,
  GET_USER_ASSETS_REQUEST,
  GET_USER_ASSETS_SUCCESS,
} from "./ActionType";

const baseUrl = "http://localhost:9091";

export const getAssetById = (jwt, assetId) => async (dispatch) => {
  dispatch({ type: GET_ASSET_REQUEST });
  try {
    const response = await axios.get(`${baseUrl}/api/asset/${assetId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch({ type: GET_ASSET_SUCCESS, payload: response.data });
    console.log("asset", response.data);
  } catch (error) {
    console.log("error", error);
    dispatch({ type: GET_ASSET_FAILURE, error: error.message });
  }
};

export const getAssetDetails =
  ({ coinId, jwt }) =>
  async (dispatch) => {
    dispatch({ type: GET_ASSET_DETAILS_REQUEST });
    try {
      const response = await axios.get(
        `${baseUrl}/api/asset/coin/${coinId}/user`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      dispatch({ type: GET_ASSET_DETAILS_SUCCESS, payload: response.data });
      console.log("asset", response.data);
    } catch (error) {
      console.log("error", error);
      dispatch({ type: GET_ASSET_DETAILS_FAILURE, error: error.message });
    }
  };

export const getUserAssets = (jwt) => async (dispatch) => {
  dispatch({ type: GET_USER_ASSETS_REQUEST });
  try {
    const response = await axios.get(`${baseUrl}/api/asset`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch({ type: GET_USER_ASSETS_SUCCESS, payload: response.data });
    console.log("assets", response.data);
  } catch (error) {
    console.log("error", error);
    dispatch({ type: GET_USER_ASSETS_FAILURE, error: error.message });
  }
};
