package com.examly.springapp.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum GoalType {
    WEIGHT_LOSS,
    WEIGHT_GAIN,
    MUSCLE_GAIN,
    ENDURANCE,
    STRENGTH,
    FLEXIBILITY,
    WATER,
    RUN,
    SWIM,
    CYCLE,
    CARDIO,
    STEPS,
    CALORIES,
    OTHER;

    @JsonCreator
    public static GoalType fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            return OTHER;
        }
        String normalized = value.trim().toUpperCase().replace(" ", "_");
        for (GoalType type : GoalType.values()) {
            if (type.name().equalsIgnoreCase(normalized)) {
                return type;
            }
        }
        return OTHER;
    }
}

