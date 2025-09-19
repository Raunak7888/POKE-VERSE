package com.pokeverse.play.auth.service;

import com.pokeverse.play.auth.dto.AuthenticatedUser;
import com.pokeverse.play.auth.dto.UserDto;
import com.pokeverse.play.model.RefreshToken;
import com.pokeverse.play.model.User;
import com.pokeverse.play.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;

    public RefreshToken CreateRefreshTokenForNewUser(User user){
        RefreshToken token = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiresAt(Instant.now().plusSeconds(3600*24*7))
                .build();
        return refreshTokenRepository.save(token);
    }
    public RefreshToken CreateRefreshTokenForOldUser(User user){

        RefreshToken token = refreshTokenRepository.findByUser(user);
        if (token == null){
            return CreateRefreshTokenForNewUser(user);
        }
        token.setToken(UUID.randomUUID().toString());
        token.setExpiresAt(Instant.now().plusSeconds(3600*24*7));
        return refreshTokenRepository.save(token);
    }
    public boolean isValid(RefreshToken refreshToken){
        if (refreshToken == null) return false;
        return refreshToken.getExpiresAt().isAfter(Instant.now());
    }

    public ResponseEntity<?> refreshToken(String refreshToken){
        RefreshToken token = refreshTokenRepository.findByToken(refreshToken);

        boolean isValid = isValid(token);

        if (!isValid){
            return ResponseEntity.status(401).body(Map.of("Error","Invalid refresh token"));
        }

        User user = token.getUser();
        String accessToken = jwtService.generateToken(user.getEmail(), Map.of("id", user.getId()));
        String newRefreshToken = CreateRefreshTokenForOldUser(user).getToken();

        AuthenticatedUser authenticatedUser = new AuthenticatedUser(
                UserDto.from(user),
                accessToken,
                newRefreshToken
        );

        return ResponseEntity.ok(authenticatedUser);
    }
}

