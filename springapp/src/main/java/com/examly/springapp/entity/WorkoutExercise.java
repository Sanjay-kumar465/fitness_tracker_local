package com.examly.springapp.entity;
import jakarta.persistence.*;

@Entity
public class WorkoutExercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_id", nullable = false)
    private Workout workout;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;
    
    private Integer sets;
    private Integer reps;
    private Double weight;
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Workout getWorkout() { return workout; }
    public void setWorkout(Workout workout) { this.workout = workout; }
    public Exercise getExercise() { return exercise; }
    public void setExercise(Exercise exercise) { this.exercise = exercise; }
    public Integer getSets() { return sets; }
    public void setSets(Integer sets) { this.sets = sets; }
    public Integer getReps() { return reps; }
    public void setReps(Integer reps) { this.reps = reps; }
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
}
