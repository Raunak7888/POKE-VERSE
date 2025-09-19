package com.pokeverse.play.auth.controller;

import com.pokeverse.play.auth.service.RefreshTokenService;
import com.pokeverse.play.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestParam String refreshToken){
        return refreshTokenService.refreshToken(refreshToken);    }

}
