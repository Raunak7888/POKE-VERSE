package com.pokeverse.play.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// DTO for individual question attempts
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionAttemptDto {
    private Long id;
    private int questionNo;
    private String question;
    private String selectedAnswer;
    private boolean correct;
}

// DTO for overall quiz analysis
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizAnalysisDto {
    private String quizType;
    private String difficulty;
    private String region;
    private int totalQuestions;
    private int correctAnswers;
    private int wrongAnswers;
    private double accuracy; // percentage
    private long totalDuration; // seconds
    private long averageTimePerQuestion; // seconds
    private long fastestAnswerTime; // seconds
    private long slowestAnswerTime; // seconds
    private String answerSpeedRating;
    private String performanceRating;
    private String createdAt; // ISO date string
    private List<QuestionAttemptDto> questionAttempts;
}
