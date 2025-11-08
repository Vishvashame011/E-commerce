package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ProfileRequest;
import com.ecommerce.backend.dto.SignupRequest;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FileStorageService fileStorageService;

    public User createUser(SignupRequest signupRequest) {
        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setFirstName(signupRequest.getFirstName());
        user.setLastName(signupRequest.getLastName());
        
        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User updateUser(Long userId, User userDetails) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setFirstName(userDetails.getFirstName());
            user.setLastName(userDetails.getLastName());
            user.setPhoneNumber(userDetails.getPhoneNumber());
            user.setDateOfBirth(userDetails.getDateOfBirth());
            user.setAddress(userDetails.getAddress());
            user.setCity(userDetails.getCity());
            user.setState(userDetails.getState());
            user.setZipCode(userDetails.getZipCode());
            user.setCountry(userDetails.getCountry());
            return userRepository.save(user);
        }
        throw new RuntimeException("User not found");
    }

    public User updateProfileImage(Long userId, MultipartFile image) throws IOException {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String filename = fileStorageService.storeFile(image);
            user.setProfileImage("/uploads/" + filename);
            return userRepository.save(user);
        }
        throw new RuntimeException("User not found");
    }

    public User updateUserProfile(String username, ProfileRequest profileRequest) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Check if email is being changed and if it's already taken by another user
            if (profileRequest.getEmail() != null && !profileRequest.getEmail().equals(user.getEmail())) {
                if (userRepository.existsByEmail(profileRequest.getEmail())) {
                    throw new RuntimeException("Email is already in use by another user");
                }
                user.setEmail(profileRequest.getEmail());
            }
            
            if (profileRequest.getFirstName() != null) {
                user.setFirstName(profileRequest.getFirstName());
            }
            if (profileRequest.getLastName() != null) {
                user.setLastName(profileRequest.getLastName());
            }
            if (profileRequest.getPhoneNumber() != null) {
                user.setPhoneNumber(profileRequest.getPhoneNumber());
            }
            if (profileRequest.getDateOfBirth() != null) {
                user.setDateOfBirth(profileRequest.getDateOfBirth());
            }
            if (profileRequest.getAddress() != null) {
                user.setAddress(profileRequest.getAddress());
            }
            if (profileRequest.getCity() != null) {
                user.setCity(profileRequest.getCity());
            }
            if (profileRequest.getState() != null) {
                user.setState(profileRequest.getState());
            }
            if (profileRequest.getZipCode() != null) {
                user.setZipCode(profileRequest.getZipCode());
            }
            if (profileRequest.getCountry() != null) {
                user.setCountry(profileRequest.getCountry());
            }
            
            return userRepository.save(user);
        }
        throw new RuntimeException("User not found");
    }

    public User updateUserProfileImage(String username, MultipartFile image) throws IOException {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String filename = fileStorageService.storeFile(image);
            user.setProfileImage("/uploads/" + filename);
            return userRepository.save(user);
        }
        throw new RuntimeException("User not found");
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
}