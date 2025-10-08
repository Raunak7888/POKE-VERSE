package com.pokeverse.play.quiz.dto;

import com.pokeverse.play.model.Status;
import java.util.List;

public record MultiplayerRoomCreationDto(
        long id,
        long code,
        long hostId,
        String name,
        int rounds,
        int maxPlayers,
        Status status,
        List<MultiplayerPlayersInRoomDto> players
) {}
