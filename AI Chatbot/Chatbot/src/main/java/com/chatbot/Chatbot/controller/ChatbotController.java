package com.chatbot.Chatbot.controller;

import com.chatbot.Chatbot.Service.ChatbotService;
import com.chatbot.Chatbot.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    @PostMapping("/coin-details")
    public ResponseEntity<ApiResponse<?>> getCoinDetails(@RequestBody String prompt) {
        try {
            ApiResponse<?> response = chatbotService.getCoinDetail(prompt);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> errorResponse = new ApiResponse<>();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Error processing request: " + e.getMessage());
            errorResponse.setData(null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/simple-chat")
    public ResponseEntity<ApiResponse<String>> simpleChat(@RequestBody String prompt) {
        try {
            ApiResponse<String> response = chatbotService.simpleChat(prompt);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> errorResponse = new ApiResponse<>();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Error processing chat request: " + e.getMessage());
            errorResponse.setData(null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // New endpoint for intelligent chat that handles both coin queries and general chat
    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<String>> chat(@RequestBody String prompt) {
        try {
            ApiResponse<String> response = chatbotService.processChatMessage(prompt);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> errorResponse = new ApiResponse<>();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Error processing chat message: " + e.getMessage());
            errorResponse.setData(null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        ApiResponse<String> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage("Chatbot API is running!");
        response.setData("Service is healthy");
        return ResponseEntity.ok(response);
    }
}