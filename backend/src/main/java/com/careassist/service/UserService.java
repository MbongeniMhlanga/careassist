package com.careassist.service;

import com.careassist.dto.user.CreateUserRequest;
import com.careassist.dto.user.UserResponse;
import com.careassist.entity.AppUser;
import com.careassist.exception.ResourceNotFoundException;
import com.careassist.repository.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse create(CreateUserRequest request) {
        appUserRepository.findByEmail(request.email()).ifPresent(user -> {
            throw new IllegalArgumentException("Email already exists");
        });

        AppUser user = new AppUser();
        user.setName(request.name().trim());
        user.setEmail(request.email().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.password()));

        return toResponse(appUserRepository.save(user));
    }

    @Transactional(readOnly = true)
    public UserResponse getById(Long id) {
        return toResponse(findEntityById(id));
    }

    @Transactional(readOnly = true)
    public List<UserResponse> listAll() {
        return appUserRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public AppUser findEntityById(Long id) {
        return appUserRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
    }

    private UserResponse toResponse(AppUser user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail());
    }
}
