package com.chatbot.Chatbot.utility;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.HashMap;
import java.util.Map;

public class CoinNameExtractor {

    private static final Map<String, String> COIN_MAPPING = new HashMap<>();

    static {
        // Common cryptocurrency mappings
        COIN_MAPPING.put("bitcoin", "bitcoin");
        COIN_MAPPING.put("btc", "bitcoin");
        COIN_MAPPING.put("ethereum", "ethereum");
        COIN_MAPPING.put("eth", "ethereum");
        COIN_MAPPING.put("solana", "solana");
        COIN_MAPPING.put("sol", "solana");
        COIN_MAPPING.put("cardano", "cardano");
        COIN_MAPPING.put("ada", "cardano");
        COIN_MAPPING.put("ripple", "ripple");
        COIN_MAPPING.put("xrp", "ripple");
        COIN_MAPPING.put("dogecoin", "dogecoin");
        COIN_MAPPING.put("doge", "dogecoin");
        COIN_MAPPING.put("binance", "binancecoin");
        COIN_MAPPING.put("bnb", "binancecoin");
        COIN_MAPPING.put("polkadot", "polkadot");
        COIN_MAPPING.put("dot", "polkadot");
        COIN_MAPPING.put("avalanche", "avalanche-2");
        COIN_MAPPING.put("avax", "avalanche-2");
        COIN_MAPPING.put("chainlink", "chainlink");
        COIN_MAPPING.put("link", "chainlink");
        COIN_MAPPING.put("litecoin", "litecoin");
        COIN_MAPPING.put("ltc", "litecoin");
    }

    public static String extractCoinId(String message) {
        if (message == null || message.trim().isEmpty()) {
            return null;
        }

        String lowerMessage = message.toLowerCase();

        // Pattern to match cryptocurrency names
        Pattern pattern = Pattern.compile(
                "(?i)(bitcoin|btc|ethereum|eth|solana|sol|cardano|ada|ripple|xrp|dogecoin|doge|binance|bnb|polkadot|dot|avalanche|avax|chainlink|link|litecoin|ltc|tron|trx)");
        Matcher matcher = pattern.matcher(lowerMessage);

        if (matcher.find()) {
            String matchedCoin = matcher.group(1).toLowerCase();
            return COIN_MAPPING.getOrDefault(matchedCoin, matchedCoin);
        }

        return null;
    }
}