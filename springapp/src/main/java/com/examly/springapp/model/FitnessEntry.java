
package com.examly.springapp.model;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
public class FitnessEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String goalType;
    private double targetAmount;
    private double achievedAmount;
    private LocalDate date;

    public FitnessEntry() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getGoalType() {
        return goalType;
    }

    public void setGoalType(String goalType) {
        this.goalType = goalType;
    }

    public double getTargetAmount() {
        return targetAmount;
    }

    public void setTargetAmount(double targetAmount) {
        this.targetAmount = targetAmount;
    }

    public double getAchievedAmount() {
        return achievedAmount;
    }

    public void setAchievedAmount(double achievedAmount) {
        this.achievedAmount = achievedAmount;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
