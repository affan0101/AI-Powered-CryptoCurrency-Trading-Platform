package com.chatbot.Chatbot.Service;

import com.chatbot.Chatbot.dto.CoinDto;
import com.chatbot.Chatbot.response.ApiResponse;

public interface ChatbotService {
    ApiResponse<CoinDto> getCoinDetail(String prompt) throws Exception;
    ApiResponse<String> simpleChat(String prompt);
    ApiResponse<String> processChatMessage(String prompt);
    ApiResponse<String> getFunctionRequest(String prompt);
}