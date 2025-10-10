package com.pokeverse.play.quiz.utils;

import com.pokeverse.play.quiz.dto.ApiError;
import org.springframework.stereotype.Component;

@Component
public class ErrorUtil {
    public ApiError sendErrorMessage(String message) {
        return new ApiError(message, java.time.Instant.now());
    }
}
