package com.chatbot.Chatbot.controller;
import com.chatbot.Chatbot.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Home {

    @GetMapping()
    public ResponseEntity<ApiResponse>HomeController(){
        ApiResponse response=new ApiResponse();
        response.setMessage("Welcome to AI chatbot");
        return new ResponseEntity<>(response,HttpStatus.OK);
    }
}


