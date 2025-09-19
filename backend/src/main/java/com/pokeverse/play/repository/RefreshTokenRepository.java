package com.pokeverse.play.repository;

import com.pokeverse.play.model.RefreshToken;
import com.pokeverse.play.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    RefreshToken findByToken(String token);
    RefreshToken findByUser(User user);
}
