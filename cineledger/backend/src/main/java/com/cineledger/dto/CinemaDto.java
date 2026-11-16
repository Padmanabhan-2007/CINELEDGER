package com.cineledger.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class CinemaDto {

    private Long id;

    @NotBlank(message = "Cinema name is required")
    private String name;

    @NotBlank(message = "Cinema code is required")
    private String code;

    private String circuitName;
    private String city;
    private String state;
    private String country;
    private Integer screenCount;
    private Long operatorOrganizationId;
    private String operatorName;
    private List<ScreenDto> screens;

    public CinemaDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getCircuitName() { return circuitName; }
    public void setCircuitName(String circuitName) { this.circuitName = circuitName; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public Integer getScreenCount() { return screenCount; }
    public void setScreenCount(Integer screenCount) { this.screenCount = screenCount; }

    public Long getOperatorOrganizationId() { return operatorOrganizationId; }
    public void setOperatorOrganizationId(Long operatorOrganizationId) { this.operatorOrganizationId = operatorOrganizationId; }

    public String getOperatorName() { return operatorName; }
    public void setOperatorName(String operatorName) { this.operatorName = operatorName; }

    public List<ScreenDto> getScreens() { return screens; }
    public void setScreens(List<ScreenDto> screens) { this.screens = screens; }

    public static class ScreenDto {
        private Long id;
        private String screenName;
        private Integer screenNumber;
        private Integer seatCapacity;
        private String soundSystem;
        private String projectionType;

        public ScreenDto() {}

        public ScreenDto(Long id, String screenName, Integer screenNumber, Integer seatCapacity, String soundSystem, String projectionType) {
            this.id = id;
            this.screenName = screenName;
            this.screenNumber = screenNumber;
            this.seatCapacity = seatCapacity;
            this.soundSystem = soundSystem;
            this.projectionType = projectionType;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getScreenName() { return screenName; }
        public void setScreenName(String screenName) { this.screenName = screenName; }

        public Integer getScreenNumber() { return screenNumber; }
        public void setScreenNumber(Integer screenNumber) { this.screenNumber = screenNumber; }

        public Integer getSeatCapacity() { return seatCapacity; }
        public void setSeatCapacity(Integer seatCapacity) { this.seatCapacity = seatCapacity; }

        public String getSoundSystem() { return soundSystem; }
        public void setSoundSystem(String soundSystem) { this.soundSystem = soundSystem; }

        public String getProjectionType() { return projectionType; }
        public void setProjectionType(String projectionType) { this.projectionType = projectionType; }
    }
}
