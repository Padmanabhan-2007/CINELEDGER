package com.cineledger.service;

import com.cineledger.dto.FilmDto;
import com.cineledger.entity.Film;
import com.cineledger.entity.Organization;
import com.cineledger.exception.ConflictException;
import com.cineledger.exception.ResourceNotFoundException;
import com.cineledger.repository.FilmRepository;
import com.cineledger.repository.OrganizationRepository;
import com.cineledger.repository.ReconciliationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FilmService {

    private final FilmRepository filmRepository;
    private final OrganizationRepository organizationRepository;
    private final ReconciliationRepository reconciliationRepository;
    private final AuditService auditService;

    public FilmService(FilmRepository filmRepository, OrganizationRepository organizationRepository,
                       ReconciliationRepository reconciliationRepository, AuditService auditService) {
        this.filmRepository = filmRepository;
        this.organizationRepository = organizationRepository;
        this.reconciliationRepository = reconciliationRepository;
        this.auditService = auditService;
    }

    public List<FilmDto> getAllFilms(String search) {
        List<Film> films;
        if (search != null && !search.isBlank()) {
            films = filmRepository.findByTitleContainingIgnoreCase(search.trim());
        } else {
            films = filmRepository.findAll();
        }
        return films.stream().map(this::toDto).collect(Collectors.toList());
    }

    public FilmDto getFilmById(Long id) {
        Film film = filmRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Film not found with id: " + id));
        return toDto(film);
    }

    public Film getFilmEntityById(Long id) {
        return filmRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Film not found with id: " + id));
    }

    @Transactional
    public FilmDto createFilm(FilmDto dto, String username, String role) {
        if (filmRepository.findByCode(dto.getCode()).isPresent()) {
            throw new ConflictException("Film with code '" + dto.getCode() + "' already exists");
        }

        Film film = new Film(
                dto.getTitle().trim(),
                dto.getOriginalTitle(),
                dto.getCode().trim().toUpperCase(),
                dto.getReleaseYear(),
                dto.getDurationMinutes(),
                dto.getLanguage(),
                dto.getRating(),
                dto.getGenre(),
                dto.getPosterUrl(),
                dto.getSynopsis(),
                dto.getDistributorId(),
                dto.getStatus() != null ? dto.getStatus() : "ACTIVE"
        );

        Film saved = filmRepository.save(film);

        auditService.recordEvent(username, role, "FILM_CREATED", "FILM", saved.getId(),
                "Added film '" + saved.getTitle() + "' [" + saved.getCode() + "]");

        return toDto(saved);
    }

    @Transactional
    public FilmDto updateFilm(Long id, FilmDto dto, String username, String role) {
        Film film = filmRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Film not found with id: " + id));

        film.setTitle(dto.getTitle());
        film.setOriginalTitle(dto.getOriginalTitle());
        film.setReleaseYear(dto.getReleaseYear());
        film.setDurationMinutes(dto.getDurationMinutes());
        film.setLanguage(dto.getLanguage());
        film.setRating(dto.getRating());
        film.setGenre(dto.getGenre());
        if (dto.getPosterUrl() != null && !dto.getPosterUrl().isBlank()) {
            film.setPosterUrl(dto.getPosterUrl());
        }
        film.setSynopsis(dto.getSynopsis());
        if (dto.getStatus() != null) {
            film.setStatus(dto.getStatus());
        }

        Film saved = filmRepository.save(film);

        auditService.recordEvent(username, role, "FILM_UPDATED", "FILM", saved.getId(),
                "Updated metadata for film '" + saved.getTitle() + "'");

        return toDto(saved);
    }

    private FilmDto toDto(Film film) {
        FilmDto dto = new FilmDto();
        dto.setId(film.getId());
        dto.setTitle(film.getTitle());
        dto.setOriginalTitle(film.getOriginalTitle());
        dto.setCode(film.getCode());
        dto.setReleaseYear(film.getReleaseYear());
        dto.setDurationMinutes(film.getDurationMinutes());
        dto.setLanguage(film.getLanguage());
        dto.setRating(film.getRating());
        dto.setGenre(film.getGenre());
        dto.setPosterUrl(film.getPosterUrl());
        dto.setSynopsis(film.getSynopsis());
        dto.setDistributorId(film.getDistributorId());
        dto.setStatus(film.getStatus());

        if (film.getDistributorId() != null) {
            organizationRepository.findById(film.getDistributorId())
                    .ifPresent(org -> dto.setDistributorName(org.getName()));
        }

        int reconCount = reconciliationRepository.findByFilmId(film.getId()).size();
        dto.setActiveReconciliationsCount(reconCount);

        return dto;
    }
}
