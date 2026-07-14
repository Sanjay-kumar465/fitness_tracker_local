package com.examly.springapp.entity;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class ProgressTracking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goal_id", nullable = false)
    private FitnessGoal fitnessGoal;
    
    private LocalDate date;
    private Double progressValue;
    private String notes;
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public FitnessGoal getFitnessGoal() { return fitnessGoal; }
    public void setFitnessGoal(FitnessGoal fitnessGoal) { this.fitnessGoal = fitnessGoal; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public Double getProgressValue() { return progressValue; }
    public void setProgressValue(Double progressValue) { this.progressValue = progressValue; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
