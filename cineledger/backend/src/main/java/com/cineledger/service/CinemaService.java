package com.cineledger.service;

import com.cineledger.dto.CinemaDto;
import com.cineledger.entity.Cinema;
import com.cineledger.entity.Screen;
import com.cineledger.exception.ConflictException;
import com.cineledger.exception.ResourceNotFoundException;
import com.cineledger.repository.CinemaRepository;
import com.cineledger.repository.OrganizationRepository;
import com.cineledger.repository.ScreenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CinemaService {

    private final CinemaRepository cinemaRepository;
    private final ScreenRepository screenRepository;
    private final OrganizationRepository organizationRepository;
    private final AuditService auditService;

    public CinemaService(CinemaRepository cinemaRepository, ScreenRepository screenRepository,
                         OrganizationRepository organizationRepository, AuditService auditService) {
        this.cinemaRepository = cinemaRepository;
        this.screenRepository = screenRepository;
        this.organizationRepository = organizationRepository;
        this.auditService = auditService;
    }

    public List<CinemaDto> getAllCinemas(String city) {
        List<Cinema> cinemas;
        if (city != null && !city.isBlank()) {
            cinemas = cinemaRepository.findByCityIgnoreCase(city.trim());
        } else {
            cinemas = cinemaRepository.findAll();
        }
        return cinemas.stream().map(this::toDto).collect(Collectors.toList());
    }

    public CinemaDto getCinemaById(Long id) {
        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cinema not found with id: " + id));
        return toDto(cinema);
    }

    public Cinema getCinemaEntityById(Long id) {
        return cinemaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cinema not found with id: " + id));
    }

    @Transactional
    public CinemaDto createCinema(CinemaDto dto, String username, String role) {
        if (cinemaRepository.findByCode(dto.getCode()).isPresent()) {
            throw new ConflictException("Cinema with code '" + dto.getCode() + "' already exists");
        }

        Cinema cinema = new Cinema(
                dto.getName().trim(),
                dto.getCode().trim().toUpperCase(),
                dto.getCircuitName(),
                dto.getCity(),
                dto.getState(),
                dto.getCountry(),
                dto.getScreenCount() != null ? dto.getScreenCount() : 4,
                dto.getOperatorOrganizationId()
        );

        Cinema saved = cinemaRepository.save(cinema);

        // Create default screens if none specified
        if (dto.getScreens() == null || dto.getScreens().isEmpty()) {
            int count = saved.getScreenCount() != null ? saved.getScreenCount() : 4;
            for (int i = 1; i <= count; i++) {
                String screenName = (i == 1) ? "Screen 1 (IMAX Laser)" : "Screen " + i;
                String format = (i == 1) ? "4K IMAX Laser" : "2K Laser";
                String sound = (i == 1) ? "Dolby Atmos 12-Channel" : "Dolby 7.1";
                screenRepository.save(new Screen(saved.getId(), screenName, i, 250, sound, format));
            }
        }

        auditService.recordEvent(username, role, "CINEMA_CREATED", "CINEMA", saved.getId(),
                "Registered cinema '" + saved.getName() + "' [" + saved.getCode() + "]");

        return toDto(saved);
    }

    private CinemaDto toDto(Cinema cinema) {
        CinemaDto dto = new CinemaDto();
        dto.setId(cinema.getId());
        dto.setName(cinema.getName());
        dto.setCode(cinema.getCode());
        dto.setCircuitName(cinema.getCircuitName());
        dto.setCity(cinema.getCity());
        dto.setState(cinema.getState());
        dto.setCountry(cinema.getCountry());
        dto.setScreenCount(cinema.getScreenCount());
        dto.setOperatorOrganizationId(cinema.getOperatorOrganizationId());

        if (cinema.getOperatorOrganizationId() != null) {
            organizationRepository.findById(cinema.getOperatorOrganizationId())
                    .ifPresent(org -> dto.setOperatorName(org.getName()));
        }

        List<Screen> screens = screenRepository.findByCinemaId(cinema.getId());
        dto.setScreens(screens.stream()
                .map(s -> new CinemaDto.ScreenDto(s.getId(), s.getScreenName(), s.getScreenNumber(),
                        s.getSeatCapacity(), s.getSoundSystem(), s.getProjectionType()))
                .collect(Collectors.toList()));

        return dto;
    }
}
