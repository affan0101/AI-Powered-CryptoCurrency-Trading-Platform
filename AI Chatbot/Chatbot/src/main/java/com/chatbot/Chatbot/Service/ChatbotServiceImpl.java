package com.chatbot.Chatbot.Service;

import com.chatbot.Chatbot.dto.CoinDto;
import com.chatbot.Chatbot.response.ApiResponse;
import com.chatbot.Chatbot.utility.CoinNameExtractor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class ChatbotServiceImpl implements ChatbotService {

    String GEMENI_API_KEY = "AIzaSyARGCR4dVzxvBnRKDWOTobwJGLyVNpt1nw";
    String COINGECKO_API_KEY = "CG-NMpB4c1YQhyWvCHHacJDgm4N";

    private double convertToDouble(Object value) {
        if (value == null) return 0.0;
        if (value instanceof Integer) {
            return ((Integer) value).doubleValue();
        } else if (value instanceof Long) {
            return ((Long) value).doubleValue();
        } else if (value instanceof Double) {
            return (Double) value;
        } else {
            return 0.0;
        }
    }

    public CoinDto makeApiRequest(String currencyName) throws Exception {
        // Extract just the coin ID from the message
        String coinId = CoinNameExtractor.extractCoinId(currencyName);

        if (coinId == null) {
            throw new Exception("No cryptocurrency found in the message: " + currencyName);
        }

        String url = "https://api.coingecko.com/api/v3/coins/" + coinId;
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("x-cg-demo-api-key", COINGECKO_API_KEY);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> responseEntity = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
        Map<String, Object> responseBody = responseEntity.getBody();

        if (responseBody != null) {
            Map<String, Object> image = (Map<String, Object>) responseBody.get("image");
            Map<String, Object> marketData = (Map<String, Object>) responseBody.get("market_data");

            if (marketData == null) {
                throw new Exception("Market data not available for: " + coinId);
            }

            CoinDto coinDto = new CoinDto();
            coinDto.setId((String) responseBody.get("id"));
            coinDto.setName((String) responseBody.get("name"));
            coinDto.setSymbol((String) responseBody.get("symbol"));

            if (image != null) {
                coinDto.setImage((String) image.get("large"));
            }

            Map<String, Object> currentPrice = (Map<String, Object>) marketData.get("current_price");
            if (currentPrice != null) {
                coinDto.setCurrentPrice(convertToDouble(currentPrice.get("usd")));
            }

            Map<String, Object> marketCap = (Map<String, Object>) marketData.get("market_cap");
            if (marketCap != null) {
                coinDto.setMarketCap(convertToDouble(marketCap.get("usd")));
            }

            coinDto.setMarketCapRank(convertToDouble(marketData.get("market_cap_rank")));

            Map<String, Object> totalVolume = (Map<String, Object>) marketData.get("total_volume");
            if (totalVolume != null) {
                coinDto.setTotalVolume(convertToDouble(totalVolume.get("usd")));
            }

            Map<String, Object> high24h = (Map<String, Object>) marketData.get("high_24h");
            if (high24h != null) {
                coinDto.setHigh24h(convertToDouble(high24h.get("usd")));
            }

            Map<String, Object> low24h = (Map<String, Object>) marketData.get("low_24h");
            if (low24h != null) {
                coinDto.setLow24h(convertToDouble(low24h.get("usd")));
            }

            coinDto.setPriceChange24h(convertToDouble(marketData.get("price_change_24h")));
            coinDto.setPriceChangePercentage24h(convertToDouble(marketData.get("price_change_percentage_24h")));
            coinDto.setMarketCapChange24h(convertToDouble(marketData.get("market_cap_change_24h")));
            coinDto.setMarketCapChangePercentage24h(convertToDouble(marketData.get("market_cap_change_percentage_24h")));
            coinDto.setCirculatingSupply(convertToDouble(marketData.get("circulating_supply")));
            coinDto.setTotalSupply(convertToDouble(marketData.get("total_supply")));

            return coinDto;
        }
        throw new Exception("Coin Not Found: " + coinId);
    }

    @Override
    public ApiResponse<CoinDto> getCoinDetail(String prompt) throws Exception {
        try {
            CoinDto coinDto = makeApiRequest(prompt);

            ApiResponse<CoinDto> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage("Coin data retrieved successfully");
            response.setData(coinDto);

            return response;
        } catch (Exception e) {
            ApiResponse<CoinDto> response = new ApiResponse<>();
            response.setSuccess(false);
            response.setMessage("Error: " + e.getMessage());
            response.setData(null);
            return response;
        }
    }

    @Override
    public ApiResponse<String> getFunctionRequest(String prompt) {
        try {
            String GEMINI_API_URL =
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="
                            + GEMENI_API_KEY;

            JSONObject requestBodyJson = new JSONObject()
                    .put("contents", new JSONArray()
                            .put(new JSONObject()
                                    .put("parts", new JSONArray()
                                            .put(new JSONObject()
                                                    .put("text", prompt)))))
                    .put("tools", new JSONArray()
                            .put(new JSONObject()
                                    .put("functionDeclarations", new JSONArray()
                                            .put(new JSONObject()
                                                    .put("name", "getCoinDetails")
                                                    .put("description", "Get the Coin Details from given currency Object")
                                                    .put("parameters", new JSONObject()
                                                            .put("type", "OBJECT")
                                                            .put("properties", new JSONObject()
                                                                    .put("currencyName", new JSONObject()
                                                                            .put("type", "STRING")
                                                                            .put("description", "The currency name, id, symbol."))
                                                                    .put("currencyData", new JSONObject()
                                                                            .put("type", "STRING")
                                                                            .put("description", "Currency Data fields: id, symbol, name, current_price, market_cap, market_cap_rank, total_volume, high_24h, low_24h, price_change_24h, price_change_percentage_24h, market_cap_change_24h, market_cap_change_percentage_24h, circulating_supply, total_supply"))))
                                                    .put("required", new JSONArray()
                                                            .put("currencyName")
                                                            .put("currencyData"))))));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> requestEntity = new HttpEntity<>(requestBodyJson.toString(), headers);
            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_API_URL, requestEntity, String.class);
            String responseBody = response.getBody();

            ApiResponse<String> apiResponse = new ApiResponse<>();
            apiResponse.setSuccess(true);
            apiResponse.setMessage("Function request processed successfully");
            apiResponse.setData(responseBody);

            return apiResponse;
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>();
            response.setSuccess(false);
            response.setMessage("Error in function request: " + e.getMessage());
            response.setData(null);
            return response;
        }
    }

    @Override
    public ApiResponse<String> simpleChat(String prompt) {
        try {
            String GEMINI_API_URL =
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="
                            + GEMENI_API_KEY;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            JSONObject requestBody = new JSONObject()
                    .put("contents", new JSONArray()
                            .put(new JSONObject()
                                    .put("parts", new JSONArray()
                                            .put(new JSONObject()
                                                    .put("text", prompt)))));

            HttpEntity<String> requestEntity = new HttpEntity<>(requestBody.toString(), headers);
            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_API_URL, requestEntity, String.class);

            // Parse the Gemini response
            String parsedResponse = parseGeminiResponse(response.getBody());

            ApiResponse<String> apiResponse = new ApiResponse<>();
            apiResponse.setSuccess(true);
            apiResponse.setMessage("Chat response generated successfully");
            apiResponse.setData(parsedResponse);

            return apiResponse;
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>();
            response.setSuccess(false);
            response.setMessage("Error in chat processing: " + e.getMessage());
            response.setData(null);
            return response;
        }
    }

    @Override
    public ApiResponse<String> processChatMessage(String prompt) {
        try {
            // First, analyze the prompt to understand what specific information is requested
            String coinId = CoinNameExtractor.extractCoinId(prompt);

            if (coinId != null) {
                try {
                    CoinDto coinDto = makeApiRequest(coinId);
                    // Analyze the prompt to determine what specific data to return
                    String responseText = generateFocusedResponse(prompt, coinDto);

                    ApiResponse<String> response = new ApiResponse<>();
                    response.setSuccess(true);
                    response.setMessage("Cryptocurrency data retrieved successfully");
                    response.setData(responseText);

                    return response;
                } catch (Exception e) {
                    ApiResponse<String> response = new ApiResponse<>();
                    response.setSuccess(false);
                    response.setMessage("I found a cryptocurrency mention (" + coinId + ") but couldn't retrieve its data");
                    response.setData("Error: " + e.getMessage());
                    return response;
                }
            }

            // If no coin mentioned, use the simple chat
            return simpleChat(prompt);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>();
            response.setSuccess(false);
            response.setMessage("Error processing chat message");
            response.setData("Error: " + e.getMessage());
            return response;
        }
    }

    private String parseGeminiResponse(String geminiResponse) {
        try {
            JSONObject responseJson = new JSONObject(geminiResponse);
            JSONArray candidates = responseJson.getJSONArray("candidates");
            if (candidates.length() > 0) {
                JSONObject candidate = candidates.getJSONObject(0);
                JSONObject content = candidate.getJSONObject("content");
                JSONArray parts = content.getJSONArray("parts");
                if (parts.length() > 0) {
                    return parts.getJSONObject(0).getString("text");
                }
            }
            return "Sorry, I couldn't generate a response for that.";
        } catch (Exception e) {
            return "Error parsing response: " + e.getMessage();
        }
    }

    private String generateFocusedResponse(String userPrompt, CoinDto coinDto) {
        String promptLower = userPrompt.toLowerCase();
        String coinName = coinDto.getName();
        String symbol = coinDto.getSymbol().toUpperCase();

        // Check what specific information the user is asking for
        if (promptLower.contains("price") || promptLower.contains("how much") || promptLower.contains("value")) {
            return String.format("The current price of %s (%s) is $%,.2f USD",
                    coinName, symbol, coinDto.getCurrentPrice());

        } else if (promptLower.contains("market cap") || promptLower.contains("capitalization")) {
            return String.format("The market cap of %s (%s) is $%,.0f USD, ranking #%.0f",
                    coinName, symbol, coinDto.getMarketCap(), coinDto.getMarketCapRank());

        } else if (promptLower.contains("volume") || promptLower.contains("trading")) {
            return String.format("The 24h trading volume for %s (%s) is $%,.0f USD",
                    coinName, symbol, coinDto.getTotalVolume());

        } else if (promptLower.contains("change") || promptLower.contains("performance") ||
                promptLower.contains("up") || promptLower.contains("down")) {
            String trend = coinDto.getPriceChangePercentage24h() >= 0 ? "up" : "down";
            return String.format("%s (%s) is %s %.2f%% in the last 24 hours. Current price: $%,.2f USD",
                    coinName, symbol, trend, Math.abs(coinDto.getPriceChangePercentage24h()), coinDto.getCurrentPrice());

        } else if (promptLower.contains("supply") || promptLower.contains("circulating") ||
                promptLower.contains("total supply")) {
            return String.format("%s (%s) has a circulating supply of %,.0f %s and total supply of %,.0f %s",
                    coinName, symbol, coinDto.getCirculatingSupply(), symbol,
                    coinDto.getTotalSupply(), symbol);

        } else if (promptLower.contains("high") || promptLower.contains("low") ||
                promptLower.contains("range")) {
            return String.format("In the last 24 hours, %s (%s) reached a high of $%,.2f and a low of $%,.2f USD",
                    coinName, symbol, coinDto.getHigh24h(), coinDto.getLow24h());

        } else if (promptLower.contains("all") || promptLower.contains("everything") ||
                promptLower.contains("complete") || promptLower.contains("full")) {
            // Return complete data only if explicitly requested
            return formatCompleteCoinResponse(coinDto);
        } else {
            // Default response for general cryptocurrency queries
            return String.format("%s (%s) is currently trading at $%,.2f USD, %s %.2f%% in the last 24 hours",
                    coinName, symbol, coinDto.getCurrentPrice(),
                    coinDto.getPriceChangePercentage24h() >= 0 ? "up" : "down",
                    Math.abs(coinDto.getPriceChangePercentage24h()));
        }
    }

    private String formatCompleteCoinResponse(CoinDto coinDto) {
        return String.format(
                "**%s (%s) - Complete Overview**\n" +
                        "Current Price: $%,.2f USD\n" +
                        "24h Change: %.2f%% ($%,.2f)\n" +
                        "Market Cap: $%,.0f USD (Rank #%.0f)\n" +
                        "24h Volume: $%,.0f USD\n" +
                        "24h High: $%,.2f | 24h Low: $%,.2f\n" +
                        "Circulating Supply: %,.0f %s\n" +
                        "Total Supply: %,.0f %s",
                coinDto.getName(),
                coinDto.getSymbol().toUpperCase(),
                coinDto.getCurrentPrice(),
                coinDto.getPriceChangePercentage24h(),
                coinDto.getPriceChange24h(),
                coinDto.getMarketCap(),
                coinDto.getMarketCapRank(),
                coinDto.getTotalVolume(),
                coinDto.getHigh24h(),
                coinDto.getLow24h(),
                coinDto.getCirculatingSupply(),
                coinDto.getSymbol().toUpperCase(),
                coinDto.getTotalSupply(),
                coinDto.getSymbol().toUpperCase()
        );
    }
}