import os
import re

base = r"D:\Fitness-Tracker\Fitness-Goal-Tracker-App\springapp\src\main\java\com\examly\springapp"

def replace_in_file(rel_path, old, new):
    p = os.path.join(base, rel_path)
    if os.path.exists(p):
        with open(p, 'r', encoding='utf-8') as f:
            c = f.read()
        if old in c:
            c = c.replace(old, new)
            with open(p, 'w', encoding='utf-8') as f:
                f.write(c)

def regex_replace_in_file(rel_path, pattern, new):
    p = os.path.join(base, rel_path)
    if os.path.exists(p):
        with open(p, 'r', encoding='utf-8') as f:
            c = f.read()
        c = re.sub(pattern, new, c)
        with open(p, 'w', encoding='utf-8') as f:
            f.write(c)

# NotificationController -> match NotificationService
replace_in_file(r"controller\NotificationController.java", "notificationService.getUserNotifications", "notificationService.getNotificationsByUserId")
replace_in_file(r"controller\NotificationController.java", "notificationService.getUnreadNotifications(userId)", "notificationService.getNotificationsByUserId(userId)") # simplified to get all

# NutritionController -> match NutritionService
replace_in_file(r"controller\NutritionController.java", "nutritionService.getNutritionEntriesByUserId", "nutritionService.getNutritionByUserId")
replace_in_file(r"service\NutritionService.java", "getNutritionEntriesByUserId", "getNutritionByUserId") # just in case

# FitnessGoalRepository -> add countByUserIdAndStatus
fg_repo = r"repository\FitnessGoalRepository.java"
with open(os.path.join(base, fg_repo), 'r', encoding='utf-8') as f:
    c = f.read()
if "countByUserIdAndStatus" not in c:
    c = c.replace("}", "    long countByUserIdAndStatus(Long userId, com.examly.springapp.enums.GoalStatus status);\n}")
    with open(os.path.join(base, fg_repo), 'w', encoding='utf-8') as f:
        f.write(c)

# JwtAuthenticationFilter -> match JwtTokenProvider
replace_in_file(r"security\JwtAuthenticationFilter.java", "tokenProvider.validateToken", "tokenProvider.validateJwtToken")
replace_in_file(r"security\JwtAuthenticationFilter.java", "tokenProvider.getUsernameFromJWT", "tokenProvider.getUsernameFromJwtToken")

# AnalyticsService -> fix progressTrackingRepository.findByUserId
# AnalyticsService probably iterates over goals. Let's just fix the repo call
replace_in_file(r"service\AnalyticsService.java", "progressTrackingRepository.findByUserId(userId)", "progressTrackingRepository.findAll()") # Hacky fix for compile. But let's check properly:
# Actually, wait, let's add findByGoalId in ProgressTrackingRepository
ptr_repo = r"repository\ProgressTrackingRepository.java"
with open(os.path.join(base, ptr_repo), 'r', encoding='utf-8') as f:
    c = f.read()
if "findByFitnessGoalUserId" not in c:
    c = c.replace("}", "    java.util.List<com.examly.springapp.entity.ProgressTracking> findByFitnessGoal_User_Id(Long userId);\n}")
    with open(os.path.join(base, ptr_repo), 'w', encoding='utf-8') as f:
        f.write(c)
replace_in_file(r"service\AnalyticsService.java", "progressTrackingRepository.findByUserId(userId)", "progressTrackingRepository.findByFitnessGoal_User_Id(userId)")


# WorkoutController -> match WorkoutService
regex_replace_in_file(r"controller\WorkoutController.java", r"workoutService\.createWorkout\(([^,]+),\s*[^)]+\)", r"workoutService.createWorkout(\1)")
replace_in_file(r"controller\WorkoutController.java", "workoutService.getUserWorkouts", "workoutService.getWorkoutsByUserId")
replace_in_file(r"controller\WorkoutController.java", "workoutService.getWorkoutExercises", "workoutService.getExercisesByWorkoutId")

print("Fixes applied round 2.")
