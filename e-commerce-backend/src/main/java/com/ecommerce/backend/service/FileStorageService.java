package com.ecommerce.backend.service;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String storeFile(MultipartFile file) throws IOException {
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            System.out.println("Upload directory: " + uploadPath.toAbsolutePath());
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                System.out.println("Created upload directory");
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.isEmpty()) {
                throw new IOException("Original filename is null or empty");
            }
            
            String extension = FilenameUtils.getExtension(originalFilename);
            if (extension == null || extension.isEmpty()) {
                extension = "jpg"; // Default extension
            }
            
            String filename = UUID.randomUUID().toString() + "." + extension;
            System.out.println("Generated filename: " + filename);

            // Store file
            Path targetLocation = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            System.out.println("File stored at: " + targetLocation.toAbsolutePath());

            return filename;
        } catch (Exception e) {
            System.err.println("Error storing file: " + e.getMessage());
            e.printStackTrace();
            throw new IOException("Failed to store file: " + e.getMessage(), e);
        }
    }

    public boolean isValidImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && contentType.startsWith("image/");
    }
}