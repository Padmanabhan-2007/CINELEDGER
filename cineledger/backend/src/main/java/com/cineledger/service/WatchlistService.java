package com.cineledger.service;

import com.cineledger.dto.WatchlistDto;
import com.cineledger.entity.Film;
import com.cineledger.entity.Watchlist;
import com.cineledger.exception.ResourceNotFoundException;
import com.cineledger.repository.FilmRepository;
import com.cineledger.repository.WatchlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final FilmRepository filmRepository;

    public WatchlistService(WatchlistRepository watchlistRepository, FilmRepository filmRepository) {
        this.watchlistRepository = watchlistRepository;
        this.filmRepository = filmRepository;
    }

    public List<WatchlistDto> getWatchlist(Long userId) {
        List<Watchlist> entries = watchlistRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return entries.stream().map(this::toDto).collect(Collectors.toList());
    }

    public boolean isInWatchlist(Long userId, Long filmId) {
        return watchlistRepository.existsByUserIdAndFilmId(userId, filmId);
    }

    @Transactional
    public WatchlistDto addToWatchlist(Long userId, Long filmId) {
        Film film = filmRepository.findById(filmId)
                .orElseThrow(() -> new ResourceNotFoundException("Film not found with id: " + filmId));

        Watchlist entry = watchlistRepository.findByUserIdAndFilmId(userId, filmId)
                .orElseGet(() -> watchlistRepository.save(new Watchlist(userId, filmId)));

        return toDto(entry, film);
    }

    @Transactional
    public void removeFromWatchlist(Long userId, Long filmId) {
        watchlistRepository.deleteByUserIdAndFilmId(userId, filmId);
    }

    private WatchlistDto toDto(Watchlist watchlist) {
        Film film = filmRepository.findById(watchlist.getFilmId()).orElse(null);
        return toDto(watchlist, film);
    }

    private WatchlistDto toDto(Watchlist watchlist, Film film) {
        WatchlistDto dto = new WatchlistDto();
        dto.setId(watchlist.getId());
        dto.setFilmId(watchlist.getFilmId());
        dto.setAddedAt(watchlist.getCreatedAt());

        if (film != null) {
            dto.setFilmTitle(film.getTitle());
            dto.setPosterUrl(film.getPosterUrl());
            dto.setGenre(film.getGenre());
            dto.setDurationMinutes(film.getDurationMinutes());
            dto.setReleaseYear(film.getReleaseYear());
            dto.setRating(film.getRating());
        }

        return dto;
    }
}

