package com.cineledger.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "screens")
public class Screen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cinema_id", nullable = false)
    private Long cinemaId;

    @Column(name = "screen_name", nullable = false, length = 50)
    private String screenName; // Screen 1, IMAX Laser, Dolby Atmos 1

    @Column(name = "screen_number")
    private Integer screenNumber;

    @Column(name = "seat_capacity")
    private Integer seatCapacity = 250;

    @Column(name = "sound_system", length = 50)
    private String soundSystem = "Dolby Atmos";

    @Column(name = "projection_type", length = 50)
    private String projectionType = "4K Laser";

    public Screen() {}

    public Screen(Long cinemaId, String screenName, Integer screenNumber, Integer seatCapacity, String soundSystem, String projectionType) {
        this.cinemaId = cinemaId;
        this.screenName = screenName;
        this.screenNumber = screenNumber;
        this.seatCapacity = seatCapacity != null ? seatCapacity : 250;
        this.soundSystem = soundSystem != null ? soundSystem : "Dolby Atmos";
        this.projectionType = projectionType != null ? projectionType : "4K Laser";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCinemaId() { return cinemaId; }
    public void setCinemaId(Long cinemaId) { this.cinemaId = cinemaId; }

    public String getScreenName() { return screenName; }
    public void setScreenName(String screenName) { this.screenName = screenName; }

    public String getName() { return screenName; }
    public void setName(String name) { this.screenName = name; }

    public Integer getTotalSeats() { return seatCapacity; }
    public void setTotalSeats(Integer totalSeats) { this.seatCapacity = totalSeats; }

    public Integer getScreenNumber() { return screenNumber; }
    public void setScreenNumber(Integer screenNumber) { this.screenNumber = screenNumber; }

    public Integer getSeatCapacity() { return seatCapacity; }
    public void setSeatCapacity(Integer seatCapacity) { this.seatCapacity = seatCapacity; }

    public String getSoundSystem() { return soundSystem; }
    public void setSoundSystem(String soundSystem) { this.soundSystem = soundSystem; }

    public String getProjectionType() { return projectionType; }
    public void setProjectionType(String projectionType) { this.projectionType = projectionType; }
}
