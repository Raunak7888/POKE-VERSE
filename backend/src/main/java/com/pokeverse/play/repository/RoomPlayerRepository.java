package com.pokeverse.play.repository;

import com.pokeverse.play.model.RoomPlayer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomPlayerRepository extends JpaRepository<RoomPlayer, Long> {

    Optional<RoomPlayer> findByRoomIdAndUserId(Long roomId, Long userId);
}