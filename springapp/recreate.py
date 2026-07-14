import os

base = r"D:\Fitness-Tracker\Fitness-Goal-Tracker-App\springapp\src\main\java\com\examly\springapp"

files = {
    r"enums\Role.java": """package com.examly.springapp.enums;
public enum Role { USER, ADMIN }
""",
    r"enums\GoalStatus.java": """package com.examly.springapp.enums;
public enum GoalStatus { NOT_STARTED, IN_PROGRESS, ACHIEVED }
""",
    r"exception\ResourceNotFoundException.java": """package com.examly.springapp.exception;
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) { super(message); }
}
""",
    r"exception\GlobalExceptionHandler.java": """package com.examly.springapp.exception;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(ResourceNotFoundException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
""",
    r"repository\UserRepository.java": """package com.examly.springapp.repository;
import com.examly.springapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}
""",
    r"repository\FitnessGoalRepository.java": """package com.examly.springapp.repository;
import com.examly.springapp.entity.FitnessGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface FitnessGoalRepository extends JpaRepository<FitnessGoal, Long> {
    List<FitnessGoal> findByUserId(Long userId);
}
""",
    r"repository\ProgressTrackingRepository.java": """package com.examly.springapp.repository;
import com.examly.springapp.entity.ProgressTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ProgressTrackingRepository extends JpaRepository<ProgressTracking, Long> {
    List<ProgressTracking> findByFitnessGoalId(Long goalId);
}
""",
    r"repository\SocialConnectionRepository.java": """package com.examly.springapp.repository;
import com.examly.springapp.entity.SocialConnection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface SocialConnectionRepository extends JpaRepository<SocialConnection, Long> {
    List<SocialConnection> findByRequesterIdOrReceiverId(Long requesterId, Long receiverId);
}
""",
    r"repository\WorkoutExerciseRepository.java": """package com.examly.springapp.repository;
import com.examly.springapp.entity.WorkoutExercise;
import org.springframework.data.jpa.repository.JpaRepository;
public interface WorkoutExerciseRepository extends JpaRepository<WorkoutExercise, Long> {
}
""",
    r"entity\User.java": """package com.examly.springapp.entity;
import com.examly.springapp.enums.Role;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Enumerated(EnumType.STRING)
    private Role role;
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
""",
    r"entity\Workout.java": """package com.examly.springapp.entity;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Workout {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    private LocalDate date;
    private Integer duration;
    private String notes;
    
    @OneToMany(mappedBy = "workout", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorkoutExercise> exercises = new ArrayList<>();
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public List<WorkoutExercise> getExercises() { return exercises; }
    public void setExercises(List<WorkoutExercise> exercises) { this.exercises = exercises; }
}
""",
    r"entity\WorkoutExercise.java": """package com.examly.springapp.entity;
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
""",
    r"entity\ProgressTracking.java": """package com.examly.springapp.entity;
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
""",
    r"controller\AuthController.java": """package com.examly.springapp.controller;
import com.examly.springapp.entity.User;
import com.examly.springapp.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.ok(authService.registerUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> request) {
        String token = authService.loginUser(request.get("username"), request.get("password"));
        return ResponseEntity.ok(token);
    }
}
""",
    r"controller\UserController.java": """package com.examly.springapp.controller;
import com.examly.springapp.entity.User;
import com.examly.springapp.entity.UserProfile;
import com.examly.springapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/{id}/profile")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<UserProfile> getUserProfile(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserProfile(id));
    }

    @PutMapping("/{id}/profile")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<UserProfile> updateUserProfile(@PathVariable Long id, @RequestBody UserProfile updatedProfile) {
        return ResponseEntity.ok(userService.updateUserProfile(id, updatedProfile));
    }
}
""",
    r"controller\FitnessGoalController.java": """package com.examly.springapp.controller;
import com.examly.springapp.entity.FitnessGoal;
import com.examly.springapp.service.FitnessGoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class FitnessGoalController {
    @Autowired
    private FitnessGoalService fitnessGoalService;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<FitnessGoal> createGoal(@RequestBody FitnessGoal goal) {
        return ResponseEntity.ok(fitnessGoalService.createGoal(goal));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<FitnessGoal>> getGoalsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(fitnessGoalService.getGoalsByUserId(userId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<FitnessGoal> updateGoal(@PathVariable Long id, @RequestBody FitnessGoal updatedGoal) {
        return ResponseEntity.ok(fitnessGoalService.updateGoal(id, updatedGoal));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        fitnessGoalService.deleteGoal(id);
        return ResponseEntity.noContent().build();
    }
}
""",
    r"controller\NutritionController.java": """package com.examly.springapp.controller;
import com.examly.springapp.entity.NutritionEntry;
import com.examly.springapp.service.NutritionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/nutrition")
public class NutritionController {
    @Autowired
    private NutritionService nutritionService;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<NutritionEntry> createNutritionEntry(@RequestBody NutritionEntry entry) {
        return ResponseEntity.ok(nutritionService.createNutritionEntry(entry));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<NutritionEntry>> getNutritionByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(nutritionService.getNutritionByUserId(userId));
    }
}
""",
    r"controller\ProgressTrackingController.java": """package com.examly.springapp.controller;
import com.examly.springapp.entity.ProgressTracking;
import com.examly.springapp.service.ProgressTrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class ProgressTrackingController {
    @Autowired
    private ProgressTrackingService progressTrackingService;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ProgressTracking> logProgress(@RequestBody ProgressTracking progress) {
        return ResponseEntity.ok(progressTrackingService.logProgress(progress));
    }

    @GetMapping("/goal/{goalId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<ProgressTracking>> getProgressByGoalId(@PathVariable Long goalId) {
        return ResponseEntity.ok(progressTrackingService.getProgressByGoalId(goalId));
    }
}
"""
}

for rel_path, file_content in files.items():
    full_path = os.path.join(base, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(file_content)
    print(f"Created {full_path}")
