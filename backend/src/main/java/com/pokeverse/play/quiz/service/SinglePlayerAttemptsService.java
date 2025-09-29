package com.pokeverse.play.quiz.service;

import com.pokeverse.play.model.Question;
import com.pokeverse.play.model.SinglePlayerAttempts;
import com.pokeverse.play.model.SinglePlayerSession;
import com.pokeverse.play.model.Status;
import com.pokeverse.play.quiz.dto.SinglePlayerAttemptDto;
import com.pokeverse.play.quiz.dto.SubmitAttemptDto;
import com.pokeverse.play.quiz.utils.ErrorUtil;
import com.pokeverse.play.quiz.cache.SinglePlayerSessionCache;
import com.pokeverse.play.repository.QuestionRepository;
import com.pokeverse.play.repository.SinglePlayerSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SinglePlayerAttemptsService {

    private final ErrorUtil errorUtil;
    private final QuestionRepository questionRepository;
    private final SinglePlayerSessionRepository singlePlayerSessionRepository;
    private final SinglePlayerSessionCache sessionCache;

    public ResponseEntity<?> submitAttempt(SubmitAttemptDto dto) {

        // 1. Fetch session from cache
        SinglePlayerSession session = sessionCache.get(dto.sessionId());
        if (session == null) {
            return ResponseEntity.status(404)
                    .body(errorUtil.sendErrorMessage("Session not found in cache"));
        }

        // 2. Validate session status
        if (session.getStatus() != Status.IN_PROGRESS) {
            return ResponseEntity.badRequest()
                    .body(errorUtil.sendErrorMessage("Session is not in progress"));
        }

        // 3. Find the attempt for this question
        SinglePlayerAttempts attempt = session.getAttempts().stream()
                .filter(a -> a.getQuestion().getId().equals(dto.questionId()))
                .findFirst()
                .orElse(null);

        if (attempt == null) {
            return ResponseEntity.status(400)
                    .body(errorUtil.sendErrorMessage("Attempt not found for this question"));
        }

        // 4. Validate question exists
        Question question = questionRepository.findById(dto.questionId()).orElse(null);
        if (question == null) {
            return ResponseEntity.badRequest()
                    .body(errorUtil.sendErrorMessage("Invalid question ID"));
        }

        // 5. Submit attempt
        attempt.setSelectedAnswer(dto.selectedAnswer());
        attempt.setCorrect(dto.selectedAnswer().equals(question.getAnswer()));
        attempt.setAnsweredAt(java.time.Instant.now());

        SinglePlayerAttemptDto responseDto = new SinglePlayerAttemptDto(
                question.getId(),
                attempt.getSelectedAnswer(),
                attempt.isCorrect(),
                question.getAnswer()
        );

        // 6. Increment current round
        session.setCurrentRound(session.getCurrentRound() + 1);

        // 7. If this was the last question, mark session as completed
        if (session.getCurrentRound() > session.getRounds()) {
            session.setStatus(Status.COMPLETED);
        }

        // 8. Update session in cache
        sessionCache.put(session);

        // 9. Persist session (and attempts via cascade)
        singlePlayerSessionRepository.save(session);

        // 10. Return attempt response
        return ResponseEntity.ok(responseDto);
    }

}
