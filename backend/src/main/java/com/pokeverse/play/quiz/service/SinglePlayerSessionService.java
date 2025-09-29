package com.pokeverse.play.quiz.service;

import com.pokeverse.play.model.Question;
import com.pokeverse.play.model.SinglePlayerAttempts;
import com.pokeverse.play.model.SinglePlayerSession;
import com.pokeverse.play.model.Status;
import com.pokeverse.play.quiz.dto.QuestionWithOutAnswerDto;
import com.pokeverse.play.quiz.dto.SinglePlayerSessionCreateDto;
import com.pokeverse.play.quiz.dto.SinglePlayerSessionDto;
import com.pokeverse.play.quiz.dto.SinglePlayerSessionResponseDto;
import com.pokeverse.play.quiz.utils.ErrorUtil;
import com.pokeverse.play.quiz.cache.SinglePlayerSessionCache;
import com.pokeverse.play.repository.QuestionRepository;
import com.pokeverse.play.repository.SinglePlayerSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class SinglePlayerSessionService {

    private final QuestionRepository questionRepository;
    private final SinglePlayerSessionRepository singlePlayerSessionRepository;
    private final SinglePlayerSessionCache sessionCache;
    private final ErrorUtil errorUtil;

    public ResponseEntity<?> createSinglePlayerSession(SinglePlayerSessionCreateDto dto) {
        if (dto.userId() == null) {
            return ResponseEntity.badRequest().body(errorUtil.sendErrorMessage("User ID is required"));
        }
        if (dto.rounds() <= 0) {
            return ResponseEntity.badRequest().body(errorUtil.sendErrorMessage("Rounds must be greater than 0"));
        }
        List<Question> questionsList;

        if (!dto.region().isEmpty() && !dto.difficulty().isEmpty()) {
            questionsList = questionRepository.findByRegionAndDifficulty(dto.region(), dto.difficulty(), dto.rounds());
        } else if (!dto.region().isEmpty()) {
            questionsList = questionRepository.findByRegion(dto.region(), dto.rounds());
        } else if (!dto.difficulty().isEmpty()) {
            questionsList = questionRepository.findByDifficulty(dto.difficulty(), dto.rounds());
        } else {
            questionsList = questionRepository.findAllLimit(dto.rounds());
        }

        if (questionsList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND) // Use 404 or 400 as appropriate
                    .body(errorUtil.sendErrorMessage("Could not find enough questions for the specified region and difficulty."));
        }

        SinglePlayerSession session = SinglePlayerSession.builder()
                .userId(dto.userId())
                .difficulty(dto.difficulty())
                .region(dto.region())
                .rounds(questionsList.size())
                .currentRound(1)
                .status(Status.IN_PROGRESS)
                .completedAt(null)
                .build();

        List<QuestionWithOutAnswerDto> questions = IntStream.range(0, questionsList.size())
                .mapToObj(index -> {
                    Question q = questionsList.get(index);

                    SinglePlayerAttempts attempt = SinglePlayerAttempts.builder()
                            .session(session) // Set bidirectional relationship
                            .question(q)
                            .isCorrect(false)
                            .selectedAnswer(null)
                            .build();
                    session.getAttempts().add(attempt);

                    return new QuestionWithOutAnswerDto(
                            q.getId(),
                            index + 1,
                            q.getQuestion(),
                            q.getOptions()
                    );
                })
                .collect(Collectors.toList());

        session.setStartedAt(Instant.now());

        SinglePlayerSession savedSession = singlePlayerSessionRepository.save(session);
        SinglePlayerSessionResponseDto sessionResponseDto = new SinglePlayerSessionResponseDto(
                session.getId(),
                session.getUserId(),
                session.getRegion(),
                session.getDifficulty(),
                session.getRounds()
        );
        SinglePlayerSessionDto sessionDto = new SinglePlayerSessionDto(sessionResponseDto, questions);
        sessionCache.put(savedSession);

        return ResponseEntity.ok(sessionDto);
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
