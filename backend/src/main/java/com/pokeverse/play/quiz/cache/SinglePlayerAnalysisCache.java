package com.pokeverse.play.quiz.cache;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.pokeverse.play.quiz.dto.QuizAnalysisDto;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class SinglePlayerAnalysisCache {

    private final Cache<Long, QuizAnalysisDto> cache = CacheBuilder.newBuilder()
            .expireAfterAccess(30, TimeUnit.MINUTES) // entries expire after 30 minutes of inactivity
            .maximumSize(1000) // limit to 1000 analyses
            .build();

    // Save analysis in cache
    public void put(Long sessionId, QuizAnalysisDto quizAnalysisDto) {
        cache.put(sessionId, quizAnalysisDto);
    }

    // Get analysis by sessionId
    public QuizAnalysisDto get(Long sessionId) {
        return cache.getIfPresent(sessionId);
    }

    // Remove analysis by sessionId
    public void remove(Long sessionId) {
        cache.invalidate(sessionId);
    }

    // Optional: clear all cached analyses
    public void clear() {
        cache.invalidateAll();
    }
}
