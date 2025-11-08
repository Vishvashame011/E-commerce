package com.ecommerce.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:3000")
public class TestController {

    @GetMapping("/hello")
    public Map<String, String> hello() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Backend is working!");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return response;
    }

    @PostMapping("/upload")
    public Map<String, String> testUpload(@RequestParam("file") MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        response.put("filename", file.getOriginalFilename());
        response.put("size", String.valueOf(file.getSize()));
        response.put("contentType", file.getContentType());
        return response;
    }
}