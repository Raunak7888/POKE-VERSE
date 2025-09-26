package com.pokeverse.play.repository;

import com.pokeverse.play.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Query("SELECT q FROM Question q WHERE q.region = :region")
    List<Question> findByRegion(@Param("region") String region, @Param("limit") Integer limit);

    @Query("SELECT q FROM Question q WHERE q.difficulty = :difficulty")
    List<Question> findByDifficulty(@Param("difficulty") String difficulty, @Param("limit") Integer limit);

    @Query("SELECT q FROM Question q WHERE q.region = :region AND q.difficulty = :difficulty")
    List<Question> findByRegionAndDifficulty(@Param("region") String region, @Param("difficulty") String difficulty, @Param("limit") Integer limit);

    @Query("SELECT q FROM Question q")
    List<Question> findAllLimit(@Param("limit") Integer limit);
}
