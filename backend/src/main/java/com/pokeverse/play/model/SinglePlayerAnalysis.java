package com.pokeverse.play.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "single_player_analysis")
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
@Builder
public class SinglePlayerAnalysis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long sessionId;
    private Long userId;
    private String quizType;
    private String difficulty;
    private String region;
    private int totalQuestions;
    private int correctAnswers;
    private int wrongAnswers;
    private double accuracy;
    private Long totalDuration;
    private Long averageTimePerQuestion;
    private Long fastestAnswerTime;
    private Long slowestAnswerTime;
    private String answerSpeedRating; // e.g.,
    private String performanceRating;
    private LocalDateTime createdAt;
    @OneToMany
    @JoinColumn(name = "analysis_id") // or mappedBy if bidirectional
    private List<SinglePlayerAttempts> questionAttempts;
}