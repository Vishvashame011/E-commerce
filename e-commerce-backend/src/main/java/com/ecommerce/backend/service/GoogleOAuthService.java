package com.ecommerce.backend.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.Collections;

@Service
public class GoogleOAuthService {

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    public GoogleIdToken.Payload verifyGoogleToken(String token) {
        try {
            System.out.println("Verifying Google token with client ID: " + googleClientId);
            System.out.println("Token length: " + (token != null ? token.length() : "null"));
            
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), 
                    GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(token);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                
                // Log for debugging
                System.out.println("✅ Google token verification successful!");
                System.out.println("Google user email: " + payload.getEmail());
                System.out.println("Google user name: " + payload.get("name"));
                System.out.println("Google user verified: " + payload.getEmailVerified());
                
                return payload;
            } else {
                System.err.println("❌ Invalid Google token - verification failed");
                System.err.println("Expected client ID: " + googleClientId);
            }
        } catch (Exception e) {
            System.err.println("❌ Error verifying Google token: " + e.getMessage());
            System.err.println("Client ID being used: " + googleClientId);
            e.printStackTrace();
        }
        return null;
    }
}