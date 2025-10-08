package com.pokeverse.play.quiz.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;

@Service
public class RedisCacheService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private static final Duration DEFAULT_TTL = Duration.ofMinutes(30);

    public <T> void set(String prefix, Long id, T object) {
        set(prefix, id, object, DEFAULT_TTL);
    }

    public <T> void set(String prefix, Long id, T object, Duration ttl) {
        String key = buildKey(prefix, id);
        redisTemplate.opsForValue().set(key, object, ttl);
    }

    public <T> Optional<T> get(String prefix, Long id, Class<T> clazz) {
        String key = buildKey(prefix, id);
        Object value = redisTemplate.opsForValue().get(key);
        if (value != null && clazz.isInstance(value)) {
            return Optional.of(clazz.cast(value));
        }
        return Optional.empty();
    }

    public void delete(String prefix, Long id) {
        String key = buildKey(prefix, id);
        redisTemplate.delete(key);
    }

    public boolean exists(String prefix, Long id) {
        String key = buildKey(prefix, id);
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    private String buildKey(String prefix, Long id) {
        return prefix + ":" + id;
    }
}