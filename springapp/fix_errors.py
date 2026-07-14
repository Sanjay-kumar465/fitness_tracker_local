import os
import re

base = r"D:\Fitness-Tracker\Fitness-Goal-Tracker-App\springapp\src\main\java\com\examly\springapp"

files = {
    r"security\JwtTokenProvider.java": """package com.examly.springapp.security;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {
    @Value("${jwt.secret}")
    private String jwtSecret;
    @Value("${jwt.expiration}")
    private int jwtExpirationMs;
    
    private Key key() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }
    
    public String generateTokenWithRole(Authentication authentication, String role) {
        String username = authentication.getName();
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    public String getUsernameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }
    
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(authToken);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
""",
    r"service\NotificationService.java": """package com.examly.springapp.service;
import com.examly.springapp.entity.Notification;
import com.examly.springapp.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;
    
    public Notification sendNotification(Notification notification) {
        return notificationRepository.save(notification);
    }
    
    public List<Notification> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserId(userId);
    }
}
""",
    r"service\WorkoutService.java": """package com.examly.springapp.service;
import com.examly.springapp.entity.Workout;
import com.examly.springapp.entity.WorkoutExercise;
import com.examly.springapp.repository.WorkoutRepository;
import com.examly.springapp.repository.WorkoutExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class WorkoutService {
    @Autowired
    private WorkoutRepository workoutRepository;
    
    @Autowired
    private WorkoutExerciseRepository workoutExerciseRepository;
    
    public Workout createWorkout(Workout workout) {
        return workoutRepository.save(workout);
    }
    
    public List<Workout> getWorkoutsByUserId(Long userId) {
        return workoutRepository.findByUserId(userId);
    }
    
    public List<WorkoutExercise> getExercisesByWorkoutId(Long workoutId) {
        Workout workout = workoutRepository.findById(workoutId).orElse(null);
        return workout != null ? workout.getExercises() : null;
    }
}
""",
    r"service\SocialConnectionService.java": """package com.examly.springapp.service;
import com.examly.springapp.entity.SocialConnection;
import com.examly.springapp.repository.SocialConnectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SocialConnectionService {
    @Autowired
    private SocialConnectionRepository socialConnectionRepository;
    
    public SocialConnection sendRequest(SocialConnection connection) {
        return socialConnectionRepository.save(connection);
    }
    
    public SocialConnection acceptRequest(Long connectionId) {
        SocialConnection connection = socialConnectionRepository.findById(connectionId).orElse(null);
        if (connection != null) {
            connection.setStatus(com.examly.springapp.enums.ConnectionStatus.ACCEPTED);
            return socialConnectionRepository.save(connection);
        }
        return null;
    }
    
    public List<SocialConnection> getUserConnections(Long userId) {
        return socialConnectionRepository.findByRequesterIdOrReceiverId(userId, userId);
    }
}
"""
}

# Create missing files
for rel_path, file_content in files.items():
    full_path = os.path.join(base, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(file_content)

# File modifications to fix compile errors
def replace_in_file(rel_path, old, new):
    p = os.path.join(base, rel_path)
    if os.path.exists(p):
        with open(p, 'r', encoding='utf-8') as f:
            c = f.read()
        c = c.replace(old, new)
        with open(p, 'w', encoding='utf-8') as f:
            f.write(c)

# User entity password -> passwordHash
replace_in_file(r"entity\User.java", "private String password;", "private String passwordHash;")
replace_in_file(r"entity\User.java", "public String getPassword() { return password; }", "public String getPasswordHash() { return passwordHash; }")
replace_in_file(r"entity\User.java", "public void setPassword(String password) { this.password = password; }", "public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }")

# AuthService
replace_in_file(r"service\AuthService.java", "Role.STANDARD_USER", "Role.USER")

# UserRepository
replace_in_file(r"repository\UserRepository.java", 
                "Optional<User> findByEmail(String email);", 
                "Optional<User> findByEmail(String email);\n    boolean existsByUsername(String username);\n    boolean existsByEmail(String email);")

# AuthController
replace_in_file(r"controller\AuthController.java", "authService.loginUser", "authService.login")

# FitnessGoalService
replace_in_file(r"service\FitnessGoalService.java", "GoalStatus.ACTIVE", "GoalStatus.IN_PROGRESS")
# FitnessGoal entity
replace_in_file(r"entity\FitnessGoal.java", "GoalStatus.ACTIVE", "GoalStatus.IN_PROGRESS")

# NutritionService / Controller
replace_in_file(r"controller\NutritionController.java", "nutritionService.getNutritionByUserId", "nutritionService.getNutritionEntriesByUserId")

# ProgressTrackingService
replace_in_file(r"service\ProgressTrackingService.java", "progressTrackingRepository.findByUserId(userId)", "progressTrackingRepository.findByFitnessGoalId(userId)")
replace_in_file(r"service\ProgressTrackingService.java", "entry.getGoal()", "entry.getFitnessGoal()")
replace_in_file(r"service\ProgressTrackingService.java", "entry.getValue()", "entry.getProgressValue()")

print("Fixes applied.")
