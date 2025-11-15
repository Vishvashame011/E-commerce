package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.*;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.security.JwtUtils;
import com.ecommerce.backend.service.*;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private OtpService otpService;

    @Autowired
    private GoogleOAuthService googleOAuthService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        if (userService.existsByUsername(signupRequest.getUsername())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Username is already taken!");
            return ResponseEntity.badRequest().body(error);
        }

        if (userService.existsByEmail(signupRequest.getEmail())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Email is already in use!");
            return ResponseEntity.badRequest().body(error);
        }

        User user = userService.createUser(signupRequest);
        otpService.sendOtp(signupRequest.getMobileNumber(), "SIGNUP");
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully. Please verify your mobile number with the OTP sent.");
        response.put("userId", user.getId());
        response.put("mobileNumber", signupRequest.getMobileNumber());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userService.findByUsernameOrEmail(loginRequest.getUsername());
        
        if (userOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid username/email or password!");
            return ResponseEntity.badRequest().body(error);
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid username/email or password!");
            return ResponseEntity.badRequest().body(error);
        }

        otpService.sendOtp(user.getPhoneNumber(), "LOGIN");
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Please verify your login with the OTP sent to your mobile number.");
        response.put("userId", user.getId());
        response.put("mobileNumber", user.getPhoneNumber());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody OtpRequest otpRequest) {
        boolean isValid = otpService.verifyOtp(otpRequest.getIdentifier(), otpRequest.getOtp(), otpRequest.getType());
        
        if (!isValid) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid or expired OTP!");
            return ResponseEntity.badRequest().body(error);
        }

        if ("SIGNUP".equals(otpRequest.getType())) {
            Optional<User> userOpt = userService.findByPhoneNumber(otpRequest.getIdentifier());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setMobileVerified(true);
                userService.updateUser(user);
                
                String jwt = jwtUtils.generateJwtToken(user.getUsername());
                return ResponseEntity.ok(new AuthResponse(jwt, user.getId(), user.getUsername(), user.getEmail()));
            }
        } else if ("LOGIN".equals(otpRequest.getType())) {
            Optional<User> userOpt = userService.findByPhoneNumber(otpRequest.getIdentifier());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                String jwt = jwtUtils.generateJwtToken(user.getUsername());
                return ResponseEntity.ok(new AuthResponse(jwt, user.getId(), user.getUsername(), user.getEmail()));
            }
        } else if ("EMAIL_VERIFICATION".equals(otpRequest.getType())) {
            Optional<User> userOpt = userService.findByEmail(otpRequest.getIdentifier());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setEmailVerified(true);
                userService.updateUser(user);
                
                String jwt = jwtUtils.generateJwtToken(user.getUsername());
                return ResponseEntity.ok(new AuthResponse(jwt, user.getId(), user.getUsername(), user.getEmail()));
            }
        }

        Map<String, String> error = new HashMap<>();
        error.put("error", "Verification failed!");
        return ResponseEntity.badRequest().body(error);
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleAuth(@Valid @RequestBody GoogleAuthRequest googleAuthRequest) {
        GoogleIdToken.Payload payload = googleOAuthService.verifyGoogleToken(googleAuthRequest.getToken());
        
        if (payload == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid Google token!");
            return ResponseEntity.badRequest().body(error);
        }

        String email = payload.getEmail();
        String googleId = payload.getSubject();
        String name = (String) payload.get("name");
        
        Optional<User> existingUser = userService.findByEmail(email);
        
        if (existingUser.isPresent()) {
            // Existing user - send OTP to EMAIL
            User user = existingUser.get();
            if (user.getGoogleId() == null) {
                user.setGoogleId(googleId);
                userService.updateUser(user);
            }
            
            otpService.sendOtp(email, "EMAIL_VERIFICATION");
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Please verify your email with the OTP sent.");
            response.put("email", email);
            return ResponseEntity.ok(response);
        } else {
            // New user - create account automatically and send OTP to EMAIL
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setGoogleId(googleId);
            newUser.setUsername(email.split("@")[0] + "_" + System.currentTimeMillis());
            newUser.setFirstName(name != null ? name : email.split("@")[0]);
            newUser.setPassword(passwordEncoder.encode("GOOGLE_AUTH_" + System.currentTimeMillis()));
            newUser.setEmailVerified(false); // Will be verified after OTP
            
            // Save user first
            User savedUser = userService.saveUser(newUser);
            
            // Send OTP to EMAIL (not mobile) for Google users
            otpService.sendOtp(email, "EMAIL_VERIFICATION");
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Account created. Please verify your email with the OTP sent.");
            response.put("email", email);
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestParam String identifier, @RequestParam String type) {
        otpService.sendOtp(identifier, type);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "OTP sent successfully!");
        return ResponseEntity.ok(response);
    }
}