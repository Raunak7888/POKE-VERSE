package com.pokeverse.play.repository;

import com.pokeverse.play.model.SinglePlayerAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SinglePlayerAnalysisRepository extends JpaRepository<SinglePlayerAnalysis, Long> {
}
