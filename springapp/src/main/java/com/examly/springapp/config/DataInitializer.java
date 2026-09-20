package com.examly.springapp.config;

import com.examly.springapp.entity.*;
import com.examly.springapp.enums.*;
import com.examly.springapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private UserProfileRepository userProfileRepository;
    @Autowired private FitnessGoalRepository fitnessGoalRepository;
    @Autowired private WorkoutRepository workoutRepository;
    @Autowired private ExerciseRepository exerciseRepository;
    @Autowired private WorkoutExerciseRepository workoutExerciseRepository;
    @Autowired private NutritionEntryRepository nutritionEntryRepository;
    @Autowired private ProgressTrackingRepository progressTrackingRepository;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private SocialConnectionRepository socialConnectionRepository;
    @Autowired private DietPlanRepository dietPlanRepository;
    @Autowired private DietPlanFoodRepository dietPlanFoodRepository;
    @Autowired private WorkoutPlanRepository workoutPlanRepository;
    @Autowired private WorkoutPlanExerciseRepository workoutPlanExerciseRepository;

    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        // Alter column capacity to prevent MySQL varchar truncation errors
        try {
            jdbcTemplate.execute("ALTER TABLE fitness_goal MODIFY COLUMN goal_type VARCHAR(50)");
            jdbcTemplate.execute("ALTER TABLE fitness_goal MODIFY COLUMN status VARCHAR(50)");
            jdbcTemplate.execute("ALTER TABLE fitness_goal MODIFY COLUMN priority VARCHAR(50)");
        } catch (Exception ignored) {}
        // 1. System & Demo Accounts + User Profiles
        User admin = createAccountIfNotFound("admin", "admin@fitsapp.com", "Password123!", Role.ADMIN);
        User trainer = createAccountIfNotFound("trainer", "trainer@fitsapp.com", "Password123!", Role.TRAINER);
        User nutritionist = createAccountIfNotFound("nutritionist", "nutritionist@fitsapp.com", "Password123!", Role.NUTRITIONIST);
        User premiumuser = createAccountIfNotFound("premiumuser", "premium@fitsapp.com", "Password123!", Role.PREMIUM_USER);
        User standarduser = createAccountIfNotFound("standarduser", "user@fitsapp.com", "Password123!", Role.STANDARD_USER);
        User mainUser = createAccountIfNotFound("user", "user2@fitsapp.com", "Password123!", Role.STANDARD_USER);

        User alex = createAccountIfNotFound("alexrivera", "alex@example.com", "Password123!", Role.STANDARD_USER);
        User sarah = createAccountIfNotFound("sarahrunner", "sarah@example.com", "Password123!", Role.PREMIUM_USER);
        User marcus = createAccountIfNotFound("coachmarcus", "marcus@example.com", "Password123!", Role.TRAINER);

        // Update user profiles with rich data if empty/default
        seedUserProfiles(standarduser, mainUser, premiumuser, alex, sarah);

        // 2. Exercises Table
        Exercise benchPress, squat, outdoorRun, plank, pullUps;
        if (exerciseRepository.count() == 0) {
            benchPress = seedExercise("Barbell Bench Press", "STRENGTH", "Chest, Triceps", "Barbell, Bench", "Keep feet flat, lower bar to mid-chest, press up.", "INTERMEDIATE");
            squat = seedExercise("Barbell Squat", "STRENGTH", "Quadriceps, Glutes, Core", "Barbell, Squat Rack", "Keep spine neutral, squat below parallel, drive through heels.", "INTERMEDIATE");
            outdoorRun = seedExercise("Outdoor Running", "CARDIO", "Legs, Cardiovascular", "Running Shoes", "Maintain cadence of 170-180 bpm with upright stance.", "BEGINNER");
            plank = seedExercise("Forearm Plank", "CORE", "Abdominals, Lower Back", "Mat", "Hold straight line from shoulders to heels.", "BEGINNER");
            pullUps = seedExercise("Wide-Grip Pull-Up", "STRENGTH", "Lats, Biceps", "Pull-Up Bar", "Pull chest to bar with controlled eccentric phase.", "ADVANCED");
        } else {
            List<Exercise> all = exerciseRepository.findAll();
            benchPress = all.size() > 0 ? all.get(0) : null;
            squat = all.size() > 1 ? all.get(1) : benchPress;
            outdoorRun = all.size() > 2 ? all.get(2) : benchPress;
            plank = all.size() > 3 ? all.get(3) : benchPress;
            pullUps = all.size() > 4 ? all.get(4) : benchPress;
        }

        // 3. Fitness Goals Table
        FitnessGoal waterGoal = seedGoal(standarduser, GoalType.WATER, 5.0, 3.2, LocalDate.now().minusDays(10), LocalDate.now().plusDays(20), GoalStatus.IN_PROGRESS, Priority.HIGH);
        FitnessGoal weightLossGoal = seedGoal(standarduser, GoalType.WEIGHT_LOSS, 70.0, 75.1, LocalDate.now().minusDays(30), LocalDate.now().plusDays(30), GoalStatus.IN_PROGRESS, Priority.HIGH);
        FitnessGoal runGoal = seedGoal(sarah, GoalType.RUN, 10.0, 10.0, LocalDate.now().minusDays(15), LocalDate.now().minusDays(2), GoalStatus.ACHIEVED, Priority.MEDIUM);
        FitnessGoal muscleGoal = seedGoal(premiumuser, GoalType.MUSCLE_GAIN, 5.0, 3.5, LocalDate.now().minusDays(15), LocalDate.now().plusDays(45), GoalStatus.IN_PROGRESS, Priority.HIGH);
        FitnessGoal stepsGoal = seedGoal(mainUser, GoalType.STEPS, 10000.0, 8500.0, LocalDate.now(), LocalDate.now(), GoalStatus.IN_PROGRESS, Priority.LOW);

        // 4. Workouts & Workout Exercises Tables
        if (workoutRepository.count() == 0) {
            Workout runWorkout = new Workout();
            runWorkout.setUser(standarduser);
            runWorkout.setDate(LocalDate.now().minusDays(1));
            runWorkout.setDuration(45);
            runWorkout.setNotes("Morning Park Trail Run - strong pace throughout");
            runWorkout = workoutRepository.save(runWorkout);
            seedWorkoutExercise(runWorkout, outdoorRun, 1, 1, 0.0);

            Workout strengthWorkout = new Workout();
            strengthWorkout.setUser(standarduser);
            strengthWorkout.setDate(LocalDate.now().minusDays(2));
            strengthWorkout.setDuration(60);
            strengthWorkout.setNotes("Upper Body Power Session");
            strengthWorkout = workoutRepository.save(strengthWorkout);
            seedWorkoutExercise(strengthWorkout, benchPress, 4, 10, 75.0);
            seedWorkoutExercise(strengthWorkout, pullUps, 4, 8, 0.0);

            Workout alexWorkout = new Workout();
            alexWorkout.setUser(alex);
            alexWorkout.setDate(LocalDate.now().minusDays(3));
            alexWorkout.setDuration(35);
            alexWorkout.setNotes("High Intensity Fat Burner & Tabata");
            alexWorkout = workoutRepository.save(alexWorkout);
            seedWorkoutExercise(alexWorkout, plank, 3, 60, 0.0);

            Workout sarahWorkout = new Workout();
            sarahWorkout.setUser(sarah);
            sarahWorkout.setDate(LocalDate.now().minusDays(4));
            sarahWorkout.setDuration(50);
            sarahWorkout.setNotes("10k Marathon Pace Run & Leg Day");
            sarahWorkout = workoutRepository.save(sarahWorkout);
            seedWorkoutExercise(sarahWorkout, squat, 4, 8, 50.0);

            Workout premiumWorkout = new Workout();
            premiumWorkout.setUser(premiumuser);
            premiumWorkout.setDate(LocalDate.now().minusDays(5));
            premiumWorkout.setDuration(40);
            premiumWorkout.setNotes("Full Body Mobility & Yoga Flow");
            premiumWorkout = workoutRepository.save(premiumWorkout);
            seedWorkoutExercise(premiumWorkout, plank, 4, 45, 0.0);
        }

        // 5. Nutrition Entries Table
        if (nutritionEntryRepository.count() == 0) {
            seedNutrition(standarduser, "Oatmeal with Blueberries & Whey", 1.5, 450.0, "C:60g, P:30g, F:10g", MealType.BREAKFAST, LocalDateTime.now().minusDays(1).withHour(8));
            seedNutrition(standarduser, "Grilled Chicken Quinoa Salad", 1.0, 580.0, "C:50g, P:45g, F:15g", MealType.LUNCH, LocalDateTime.now().minusDays(1).withHour(13));
            seedNutrition(alex, "Baked Salmon & Roasted Veggies", 1.0, 650.0, "C:30g, P:48g, F:22g", MealType.DINNER, LocalDateTime.now().minusDays(2).withHour(19));
            seedNutrition(sarah, "Greek Yogurt & Almonds", 1.0, 220.0, "C:15g, P:20g, F:8g", MealType.SNACK, LocalDateTime.now().minusDays(1).withHour(16));
            seedNutrition(premiumuser, "Avocado Toast with Poached Eggs", 1.0, 420.0, "C:35g, P:22g, F:18g", MealType.BREAKFAST, LocalDateTime.now().minusDays(3).withHour(8));
        }

        // 6. Progress Tracking Table
        if (progressTrackingRepository.count() == 0 && weightLossGoal != null) {
            seedProgress(weightLossGoal, LocalDate.now().minusDays(30), 78.5, "Initial weight measurement");
            seedProgress(weightLossGoal, LocalDate.now().minusDays(21), 77.2, "First week progress - energy levels high");
            seedProgress(weightLossGoal, LocalDate.now().minusDays(14), 76.0, "Hydration and cardio paying off");
            seedProgress(weightLossGoal, LocalDate.now().minusDays(7), 75.1, "Approaching milestone target!");
        }

        // 7. Notifications Table
        if (notificationRepository.count() == 0) {
            seedNotification(standarduser, "Goal Milestone Achieved: Reached 10km Run Target!", "ACHIEVEMENT", true, LocalDateTime.now().minusDays(1));
            seedNotification(standarduser, "Workout Streak Alert: You have logged workouts for 7 consecutive days!", "REMINDER", false, LocalDateTime.now().minusHours(5));
            seedNotification(standarduser, "Hydration Reminder: Log your daily water intake to reach your goal.", "REMINDER", false, LocalDateTime.now().minusHours(2));
            seedNotification(alex, "Connection Accepted: You are now fitness partners with standarduser.", "SOCIAL", true, LocalDateTime.now().minusDays(2));
        }

        // 8. Social Connections Table
        if (socialConnectionRepository.count() == 0) {
            seedSocial(standarduser, alex, "WORKOUT_PARTNER", ConnectionStatus.ACCEPTED);
            seedSocial(standarduser, sarah, "FRIEND", ConnectionStatus.ACCEPTED);
            seedSocial(marcus, standarduser, "COACH", ConnectionStatus.PENDING);
        }

        // 9. Diet Plans & Diet Plan Foods Tables
        if (dietPlanRepository.count() == 0) {
            DietPlan musclePlan = new DietPlan();
            musclePlan.setUser(standarduser);
            musclePlan.setNutritionist(nutritionist);
            musclePlan.setPlanName("High Protein Muscle Rebuilding Plan");
            musclePlan.setDescription("Targeted caloric surplus with rich macronutrient profile.");
            musclePlan.setGoal("Muscle Gain & Fat Reduction");
            musclePlan.setDailyCalories(2400.0);
            musclePlan.setProteinTarget(175.0);
            musclePlan.setCarbsTarget(210.0);
            musclePlan.setFatTarget(65.0);
            musclePlan.setStartDate(LocalDate.now().minusDays(10));
            musclePlan.setEndDate(LocalDate.now().plusDays(20));
            musclePlan.setStatus("ACTIVE");
            musclePlan = dietPlanRepository.save(musclePlan);

            seedDietFood(musclePlan, "Oatmeal & Protein Shake", MealType.BREAKFAST, 1.0, 500.0, 40.0, 60.0, 10.0);
            seedDietFood(musclePlan, "Chicken Breast & Brown Rice", MealType.LUNCH, 1.0, 650.0, 55.0, 70.0, 15.0);
            seedDietFood(musclePlan, "Grilled Salmon & Quinoa", MealType.DINNER, 1.0, 700.0, 50.0, 50.0, 25.0);

            DietPlan endurancePlan = new DietPlan();
            endurancePlan.setUser(sarah);
            endurancePlan.setNutritionist(nutritionist);
            endurancePlan.setPlanName("Endurance & Carb Loading Diet");
            endurancePlan.setDescription("Carbohydrate loading for long distance marathon running.");
            endurancePlan.setGoal("Marathon Endurance");
            endurancePlan.setDailyCalories(2800.0);
            endurancePlan.setProteinTarget(140.0);
            endurancePlan.setCarbsTarget(380.0);
            endurancePlan.setFatTarget(70.0);
            endurancePlan.setStartDate(LocalDate.now().minusDays(5));
            endurancePlan.setEndDate(LocalDate.now().plusDays(25));
            endurancePlan.setStatus("ACTIVE");
            endurancePlan = dietPlanRepository.save(endurancePlan);

            seedDietFood(endurancePlan, "Whole Wheat Pasta & Turkey", MealType.LUNCH, 1.0, 850.0, 45.0, 120.0, 18.0);
        }

        // 10. Workout Plans & Workout Plan Exercises Tables
        if (workoutPlanRepository.count() == 0) {
            WorkoutPlan splitPlan = new WorkoutPlan();
            splitPlan.setUser(standarduser);
            splitPlan.setTrainer(trainer);
            splitPlan.setName("5-Day Hypertrophy & Strength Split");
            splitPlan.setDescription("Progressive overload program designed by certified trainer.");
            splitPlan.setGoal("Hypertrophy");
            splitPlan.setStartDate(LocalDate.now().minusDays(10));
            splitPlan.setEndDate(LocalDate.now().plusDays(20));
            splitPlan.setStatus("ACTIVE");
            splitPlan = workoutPlanRepository.save(splitPlan);

            seedWorkoutPlanExercise(splitPlan, benchPress, "Barbell Bench Press", 4, 10, 15, 90, "Explosive concentric phase");
            seedWorkoutPlanExercise(splitPlan, squat, "Barbell Squat", 4, 8, 20, 120, "Squat below parallel");

            WorkoutPlan cardioPlan = new WorkoutPlan();
            cardioPlan.setUser(sarah);
            cardioPlan.setTrainer(trainer);
            cardioPlan.setName("Endurance Cardio & Core Blast");
            cardioPlan.setDescription("High cadence interval training to improve VO2 max.");
            cardioPlan.setGoal("Endurance & Speed");
            cardioPlan.setStartDate(LocalDate.now().minusDays(5));
            cardioPlan.setEndDate(LocalDate.now().plusDays(25));
            cardioPlan.setStatus("ACTIVE");
            cardioPlan = workoutPlanRepository.save(cardioPlan);

            seedWorkoutPlanExercise(cardioPlan, outdoorRun, "Outdoor Sprint Intervals", 6, 1, 20, 60, "Max effort 400m sprints");
            seedWorkoutPlanExercise(cardioPlan, plank, "Forearm Plank Hold", 4, 1, 10, 45, "Brace core tightly");
        }
    }

    private User createAccountIfNotFound(String username, String email, String rawPassword, Role role) {
        return userRepository.findByUsername(username).orElseGet(() -> {
            User user = new User();
            user.setUsername(username);
            user.setEmail(email != null ? email.replace("ignitefit.com", "fitsapp.com") : email);
            user.setPasswordHash(passwordEncoder.encode(rawPassword));
            user.setRole(role);
            User savedUser = userRepository.save(user);

            UserProfile profile = new UserProfile();
            profile.setUser(savedUser);
            profile.setHeight(175.0);
            profile.setCurrentWeight(75.0);
            profile.setTargetWeight(70.0);
            profile.setActivityLevel("MODERATE");
            profile.setHealthConditions("None");
            userProfileRepository.save(profile);
            return savedUser;
        });
    }

    private void seedUserProfiles(User... users) {
        for (User u : users) {
            if (u == null || u.getId() == null) continue;
            userProfileRepository.findByUserId(u.getId()).orElseGet(() -> {
                UserProfile p = new UserProfile();
                p.setUser(u);
                p.setHeight(178.0);
                p.setCurrentWeight(75.1);
                p.setTargetWeight(70.0);
                p.setActivityLevel("ACTIVE");
                p.setHealthConditions("Healthy");
                return userProfileRepository.save(p);
            });
        }
    }

    private Exercise seedExercise(String name, String category, String muscleGroups, String equipment, String instructions, String difficultyLevel) {
        Exercise e = new Exercise();
        e.setName(name);
        e.setCategory(category);
        e.setMuscleGroups(muscleGroups);
        e.setEquipment(equipment);
        e.setInstructions(instructions);
        e.setDifficultyLevel(difficultyLevel);
        return exerciseRepository.save(e);
    }

    private FitnessGoal seedGoal(User user, GoalType type, Double target, Double current, LocalDate start, LocalDate targetDate, GoalStatus status, Priority priority) {
        List<FitnessGoal> existing = fitnessGoalRepository.findByUserId(user.getId());
        for (FitnessGoal g : existing) {
            if (g.getGoalType() == type) return g;
        }
        FitnessGoal goal = new FitnessGoal();
        goal.setUser(user);
        goal.setGoalType(type);
        goal.setTargetValue(target);
        goal.setCurrentValue(current);
        goal.setStartDate(start);
        goal.setTargetDate(targetDate);
        goal.setStatus(status);
        goal.setPriority(priority);
        goal.setCreatedDate(LocalDateTime.now());
        return fitnessGoalRepository.save(goal);
    }

    private void seedWorkoutExercise(Workout workout, Exercise exercise, Integer sets, Integer reps, Double weight) {
        WorkoutExercise we = new WorkoutExercise();
        we.setWorkout(workout);
        we.setExercise(exercise);
        we.setSets(sets);
        we.setReps(reps);
        we.setWeight(weight);
        workoutExerciseRepository.save(we);
    }

    private void seedNutrition(User user, String foodItem, Double qty, Double calories, String macros, MealType mealType, LocalDateTime date) {
        NutritionEntry n = new NutritionEntry();
        n.setUser(user);
        n.setFoodItem(foodItem);
        n.setQuantity(qty);
        n.setCalories(calories);
        n.setMacronutrients(macros);
        n.setMealType(mealType);
        n.setDate(date);
        nutritionEntryRepository.save(n);
    }

    private void seedProgress(FitnessGoal goal, LocalDate date, Double val, String notes) {
        ProgressTracking p = new ProgressTracking();
        p.setFitnessGoal(goal);
        p.setDate(date);
        p.setProgressValue(val);
        p.setNotes(notes);
        progressTrackingRepository.save(p);
    }

    private void seedNotification(User user, String msg, String type, boolean read, LocalDateTime created) {
        Notification n = new Notification();
        n.setUser(user);
        n.setMessage(msg);
        n.setType(type);
        n.setIsRead(read);
        n.setCreatedDate(created);
        notificationRepository.save(n);
    }

    private void seedSocial(User req, User target, String type, ConnectionStatus status) {
        SocialConnection conn = new SocialConnection();
        conn.setUser(req);
        conn.setFriend(target);
        conn.setConnectionType(type);
        conn.setStatus(status);
        conn.setCreatedDate(LocalDateTime.now());
        socialConnectionRepository.save(conn);
    }

    private void seedDietFood(DietPlan plan, String name, MealType mealType, Double qty, Double calories, Double protein, Double carbs, Double fats) {
        DietPlanFood f = new DietPlanFood();
        f.setDietPlan(plan);
        f.setFoodName(name);
        f.setMealType(mealType);
        f.setQuantity(qty);
        f.setCalories(calories);
        f.setProtein(protein);
        f.setCarbohydrates(carbs);
        f.setFats(fats);
        dietPlanFoodRepository.save(f);
    }

    private void seedWorkoutPlanExercise(WorkoutPlan plan, Exercise exercise, String exerciseName, Integer sets, Integer reps, Integer duration, Integer restTime, String notes) {
        WorkoutPlanExercise wpe = new WorkoutPlanExercise();
        wpe.setWorkoutPlan(plan);
        wpe.setExercise(exercise);
        wpe.setExerciseName(exerciseName);
        wpe.setSets(sets);
        wpe.setRepetitions(reps);
        wpe.setDuration(duration);
        wpe.setRestTime(restTime);
        wpe.setNotes(notes);
        workoutPlanExerciseRepository.save(wpe);
    }
}

