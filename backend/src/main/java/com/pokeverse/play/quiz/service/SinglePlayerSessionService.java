package com.pokeverse.play.quiz.service;

import com.pokeverse.play.model.Question;
import com.pokeverse.play.model.SinglePlayerAttempts;
import com.pokeverse.play.model.SinglePlayerSession;
import com.pokeverse.play.model.Status;
import com.pokeverse.play.quiz.dto.SinglePlayerSessionCreateDto;
import com.pokeverse.play.quiz.utils.ErrorUtil;
import com.pokeverse.play.quiz.utils.SinglePlayerSessionCache;
import com.pokeverse.play.repository.QuestionRepository;
import com.pokeverse.play.repository.SinglePlayerSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SinglePlayerSessionService {

    private final QuestionRepository questionRepository;
    private final SinglePlayerSessionRepository singlePlayerSessionRepository;
    private final SinglePlayerSessionCache sessionCache;
    private final ErrorUtil errorUtil;

    public ResponseEntity<?> createSinglePlayerSession(SinglePlayerSessionCreateDto dto) {
        // Validation
        if (dto.userId() == null) {
            return ResponseEntity.badRequest().body(errorUtil.sendErrorMessage("User ID is required"));
        }
        if (dto.rounds() <= 0) {
            return ResponseEntity.badRequest().body(errorUtil.sendErrorMessage("Rounds must be greater than 0"));
        }

        // Create session
        SinglePlayerSession session = SinglePlayerSession.builder()
                .userId(dto.userId())
                .difficulty(dto.difficulty())
                .region(dto.region())
                .rounds(dto.rounds())
                .currentRound(1)
                .status(Status.IN_PROGRESS) // start immediately
                .completedAt(null)
                .build();

        // Fetch questions
        List<Question> questionsList = questionRepository.findByRegionAndDifficulty(
                session.getRegion(), session.getDifficulty(), session.getRounds()
        );

        // Create attempts for each question
        for (Question q : questionsList) {
            SinglePlayerAttempts attempt = SinglePlayerAttempts.builder()
                    .session(session)
                    .question(q)
                    .isCorrect(false)
                    .selectedAnswer(null)
                    .build();
            session.getAttempts().add(attempt);
        }
        session.setStartedAt(Instant.now());
        // Save session
        SinglePlayerSession savedSession = singlePlayerSessionRepository.save(session);

        // Cache it if needed
        sessionCache.put(savedSession);

        // Return the questions list to the user
        return ResponseEntity.ok(questionsList);
    }


    public ResponseEntity<?> getSinglePlayerSession(Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().body(errorUtil.sendErrorMessage("Session ID is required"));
        }
        Optional<SinglePlayerSession> sessionOpt = singlePlayerSessionRepository.findById(id);
        return sessionOpt
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body(errorUtil.sendErrorMessage("Session not found")));
    }

    public ResponseEntity<?> getSinglePlayerSessionsByUser(Long userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().body(errorUtil.sendErrorMessage("User ID is required"));
        }
        List<SinglePlayerSession> sessions = singlePlayerSessionRepository.findByUserId(userId);
        return ResponseEntity.ok(sessions);
    }


}
