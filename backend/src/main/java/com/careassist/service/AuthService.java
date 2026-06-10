package com.careassist.service;

import com.careassist.dto.auth.LoginRequest;
import com.careassist.dto.auth.RegisterRequest;
import com.careassist.dto.user.CreateUserRequest;
import com.careassist.dto.user.UserResponse;
import com.careassist.entity.AppUser;
import com.careassist.repository.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    private final UserService userService;
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserService userService, AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse register(RegisterRequest request) {
        if (!request.password().equals(request.confirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        return userService.create(new CreateUserRequest(
                request.name(),
                request.email(),
                request.password()
        ));
    }

    @Transactional(readOnly = true)
    public UserResponse login(LoginRequest request) {
        AppUser user = appUserRepository.findByEmail(request.email().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return new UserResponse(user.getId(), user.getName(), user.getEmail());
    }
}
