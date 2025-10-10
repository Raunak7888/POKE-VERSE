package com.pokeverse.play.quiz.service;

import com.pokeverse.play.model.*;
import com.pokeverse.play.quiz.utils.SinglePlayerSessionCache;
import com.pokeverse.play.quiz.utils.ErrorUtil;
import com.pokeverse.play.repository.SinglePlayerAnalysisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SinglePlayerAnalysisService {

    private final SinglePlayerAnalysisRepository singlePlayerAnalysisRepository;
    private final SinglePlayerSessionCache sessionCache;
    private final ErrorUtil errorUtil;

    public ResponseEntity<?> getAnalysisBySessionId(Long sessionId) {
        // ---------------------- 1. Get session from cache ----------------------
        SinglePlayerSession session = sessionCache.get(sessionId);
        if (session == null) {
            return ResponseEntity.status(404)
                    .body(errorUtil.sendErrorMessage("Session not found in cache"));
        }

        List<SinglePlayerAttempts> attempts = session.getAttempts();
        if (attempts.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(errorUtil.sendErrorMessage("No attempts found for this session"));
        }

        // ---------------------- 2. Compute basic stats ----------------------
        int totalQuestions = attempts.size();
        int correctAnswers = (int) attempts.stream().filter(SinglePlayerAttempts::isCorrect).count();
        int wrongAnswers = totalQuestions - correctAnswers;

        double accuracy = (double) correctAnswers / totalQuestions * 100;

        // ---------------------- 3. Compute timing stats ----------------------
        long totalDuration = attempts.stream()
                .mapToLong(a -> Duration.between(a.getAnsweredAt(), session.getStartedAt()).abs().toMillis())
                .sum();

        long averageTimePerQuestion = totalDuration / totalQuestions;

        long fastestAnswerTime = attempts.stream()
                .mapToLong(a -> Duration.between(a.getAnsweredAt(), session.getStartedAt()).abs().toMillis())
                .min()
                .orElse(0);

        long slowestAnswerTime = attempts.stream()
                .mapToLong(a -> Duration.between(a.getAnsweredAt(), session.getStartedAt()).abs().toMillis())
                .max()
                .orElse(0);

        // ---------------------- 4. Determine Ratings ----------------------
        String answerSpeedRating = getAnswerSpeedRating(averageTimePerQuestion);
        String performanceRating = getPerformanceRating(accuracy);

        // ---------------------- 5. Build Analysis ----------------------
        SinglePlayerAnalysis analysis = SinglePlayerAnalysis.builder()
                .sessionId(session.getId())
                .userId(session.getUserId())
                .quizType("SINGLE_PLAYER")
                .difficulty(session.getDifficulty())
                .region(session.getRegion())
                .totalQuestions(totalQuestions)
                .correctAnswers(correctAnswers)
                .wrongAnswers(wrongAnswers)
                .accuracy(accuracy)
                .totalDuration(totalDuration)
                .averageTimePerQuestion(averageTimePerQuestion)
                .fastestAnswerTime(fastestAnswerTime)
                .slowestAnswerTime(slowestAnswerTime)
                .answerSpeedRating(answerSpeedRating)
                .performanceRating(performanceRating)
                .questionAttempts(attempts)
                .createdAt(LocalDateTime.now())
                .build();

        // ---------------------- 6. Persist Analysis ----------------------
        SinglePlayerAnalysis savedAnalysis = singlePlayerAnalysisRepository.save(analysis);

        return ResponseEntity.ok(savedAnalysis);
    }

    // ---------------------- Helper Methods ----------------------
    private String getAnswerSpeedRating(long avgTimeMs) {
        if (avgTimeMs < 5000) return Rating.MEWTWO.name();
        else if (avgTimeMs < 10000) return Rating.SNORLAX.name();
        else if (avgTimeMs < 15000) return Rating.CHARIZARD.name();
        else if (avgTimeMs < 20000) return Rating.PIKACHU.name();
        else return Rating.CATERPIE.name();
    }

    private String getPerformanceRating(double accuracy) {
        if (accuracy == 100) return Rating.MEWTWO.name();
        else if (accuracy >= 80) return Rating.SNORLAX.name();
        else if (accuracy >= 60) return Rating.CHARIZARD.name();
        else if (accuracy >= 40) return Rating.PIKACHU.name();
        else return Rating.CATERPIE.name();
    }
}
