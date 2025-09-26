package com.pokeverse.play.quiz.utils;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.pokeverse.play.model.SinglePlayerSession;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class SinglePlayerSessionCache {

    private final Cache<Long, SinglePlayerSession> cache = CacheBuilder.newBuilder()
            .expireAfterAccess(30, TimeUnit.MINUTES) // adjust TTL
            .maximumSize(1000)
            .build();

    // Add or update a session
    public void put(SinglePlayerSession session) {
        cache.put(session.getId(), session);
    }

    // Get a session
    public SinglePlayerSession get(Long sessionId) {
        return cache.getIfPresent(sessionId);
    }

    // Remove a session
    public void remove(Long sessionId) {
        cache.invalidate(sessionId);
    }
}
