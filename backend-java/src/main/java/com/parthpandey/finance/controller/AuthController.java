package com.parthpandey.finance.controller;

import com.parthpandey.finance.dto.AuthResponse;
import com.parthpandey.finance.dto.LoginRequest;
import com.parthpandey.finance.dto.RegisterRequest;
import com.parthpandey.finance.entity.User;
import com.parthpandey.finance.repository.UserRepository;
import com.parthpandey.finance.security.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService,
                          AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request, HttpServletResponse response) {
        if (userRepository.existsByEmail(request.getEmail())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Email is already registered");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        }

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()), // BCrypt hashed with 12 rounds
                request.getFullName(),
                "ROLE_USER"
        );
        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail(), user.getRole());
        attachJwtCookie(response, token);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new AuthResponse(token, user.getEmail(), user.getFullName(), user.getRole())
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String token = jwtService.generateToken(user.getEmail(), user.getRole());
        attachJwtCookie(response, token);

        return ResponseEntity.ok(
                new AuthResponse(token, user.getEmail(), user.getFullName(), user.getRole())
        );
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        Map<String, Object> profile = new HashMap<>();
        profile.put("email", user.getEmail());
        profile.put("fullName", user.getFullName());
        profile.put("role", user.getRole());
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // set to true in HTTPS production
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    private void attachJwtCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("jwt", token);
        cookie.setHttpOnly(true); // Mitigates XSS token exfiltration (CWE-79)
        cookie.setSecure(false);  // Set true for HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(86400);   // 24 hours
        response.addCookie(cookie);
    }
}
