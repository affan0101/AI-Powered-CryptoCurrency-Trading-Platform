package com.crypto.controller;

import com.crypto.request.ForgotPasswordTokenRequest;
import com.crypto.Model.ForgotPasswordToken;
import com.crypto.Model.User;
import com.crypto.Model.VerificationCode;
import com.crypto.domain.VerificationType;
import com.crypto.request.ResetPasswordRequest;
import com.crypto.response.ApiResponse;
import com.crypto.response.AuthResponse;
import com.crypto.service.CreateVerificationCodeService;
import com.crypto.service.EmailService;
import com.crypto.service.ForgotPasswordService;
import com.crypto.service.UserService;
import com.crypto.utils.OtpUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping()
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private CreateVerificationCodeService createVerificationCodeService;
    @Autowired
    private ForgotPasswordService forgotPasswordService;

    @GetMapping("/api/users/profile")
    public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserProfileByJwt(jwt);
        return new ResponseEntity<User>(user, HttpStatus.OK);
    }


    @PostMapping("/api/users/verification/{verificationType}/send-otp")
    public ResponseEntity<String> sendVerificationOtp(
            @RequestHeader("Authorizarion") String jwt,
            @PathVariable VerificationType verificationType) throws Exception {

        User user=userService.findUserProfileByJwt(jwt);
        VerificationCode verificationCode=createVerificationCodeService.getVerificationCodeByUser(user.getId());
        if (verificationCode== null) {
            verificationCode=createVerificationCodeService.sendVerificationCode(user,verificationType);
        }
        if(verificationType.equals(VerificationType.EMAIL)){
            emailService.sendVerificationOtpEmail(user.getEmail(), verificationCode.getOtp());
        }

        return new ResponseEntity<>("Verification otp sent successfully", HttpStatus.OK);
    }

    @PatchMapping("/api/users/enable-two-factor/verify-otp/{otp}")
    public ResponseEntity<User> enableTwoFactorAuthentication(
            @PathVariable String otp,
            @RequestHeader("Authorizarion") String jwt) throws Exception {
        User user=userService.findUserProfileByJwt(jwt);
        VerificationCode verificationCode=createVerificationCodeService.getVerificationCodeByUser(user.getId());
        String sendTo=verificationCode.getVerificationType().equals(VerificationType.EMAIL)?
                verificationCode.getEmail() : verificationCode.getMobile();
        boolean isVerified=verificationCode.getOtp().equals(otp);
        if (isVerified) {
            User updateUser=userService.enableTwoFactorAuthentication(verificationCode.getVerificationType(),sendTo,user);
            createVerificationCodeService.deleteVerificationCodeById(verificationCode);
            return new ResponseEntity<>(updateUser,HttpStatus.OK);
        }
           throw new Exception("Wrong OTP");
    }

    @PostMapping("/auth/users/reset-password/send-otp")
    public ResponseEntity<AuthResponse> sendForgotPasswordOtp(
            @RequestBody ForgotPasswordTokenRequest req) throws Exception {
    User user=userService.findUserByEmail(req.getSendTo());
        String otp= OtpUtils.generateOtp();
        UUID uuid=UUID.randomUUID();
        String id=uuid.toString();
        ForgotPasswordToken token=forgotPasswordService.findByUser(user.getId());
        if (token == null) {
            token=forgotPasswordService.createToken(user,id,otp,req.getVerificationType(), req.getSendTo());

        }
        if(req.getVerificationType().equals(VerificationType.EMAIL)){
            emailService.sendVerificationOtpEmail(
                    user.getEmail(),
                    token.getOtp()
            );
        }
        AuthResponse response=new AuthResponse();
        response.setSession(token.getId());
        response.setMessage("Password Reset OTP sent Successfully");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PatchMapping("/auth/users/reset-password/verify-otp")
    public ResponseEntity<ApiResponse> resetPassword(
            @RequestParam String id,
            @RequestBody ResetPasswordRequest req,
            @RequestHeader("Authorizarion") String jwt) throws Exception {
          ForgotPasswordToken forgotPasswordToken=forgotPasswordService.findById(id);
          boolean isVerified=forgotPasswordToken.getOtp().equals(req.getOtp());
        if (isVerified) {
            userService.updatePassword(forgotPasswordToken.getUser(),req.getPassword());
            ApiResponse res=new ApiResponse();
            res.setMessage("Pasword Updated Successfully");
            return new ResponseEntity<>(res,HttpStatus.ACCEPTED);

        }
        throw new Exception("Wrong Otp");


    }


}
