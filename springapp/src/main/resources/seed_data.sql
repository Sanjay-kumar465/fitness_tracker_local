-- ==============================================================================
-- FITNESS GOAL TRACKER - MYSQL WORKBENCH DATA SEED SCRIPT
-- Database: fitness_tracker
-- Execute this script directly in MySQL Workbench to populate all 14 tables!
-- ==============================================================================

USE fitness_tracker;

-- Ensure column sizes are wide enough for enum strings
ALTER TABLE fitness_goal MODIFY COLUMN goal_type VARCHAR(50);
ALTER TABLE fitness_goal MODIFY COLUMN status VARCHAR(50);
ALTER TABLE fitness_goal MODIFY COLUMN priority VARCHAR(50);

-- 1. USERS TABLE
INSERT INTO users (id, username, email, password_hash, role) VALUES
(1, 'admin', 'admin@fitsapp.com', '$2a$10$w/XbN8F4J6cZ4vY8zF1zO.1X5D6E7F8G9H0I1J2K3L4M5N6O7P8Q', 'ADMIN'),
(2, 'trainer', 'trainer@fitsapp.com', '$2a$10$w/XbN8F4J6cZ4vY8zF1zO.1X5D6E7F8G9H0I1J2K3L4M5N6O7P8Q', 'TRAINER'),
(3, 'nutritionist', 'nutritionist@fitsapp.com', '$2a$10$w/XbN8F4J6cZ4vY8zF1zO.1X5D6E7F8G9H0I1J2K3L4M5N6O7P8Q', 'NUTRITIONIST'),
(4, 'premiumuser', 'premium@fitsapp.com', '$2a$10$w/XbN8F4J6cZ4vY8zF1zO.1X5D6E7F8G9H0I1J2K3L4M5N6O7P8Q', 'PREMIUM_USER'),
(5, 'standarduser', 'user@fitsapp.com', '$2a$10$w/XbN8F4J6cZ4vY8zF1zO.1X5D6E7F8G9H0I1J2K3L4M5N6O7P8Q', 'STANDARD_USER'),
(6, 'alexrivera', 'alex@example.com', '$2a$10$w/XbN8F4J6cZ4vY8zF1zO.1X5D6E7F8G9H0I1J2K3L4M5N6O7P8Q', 'STANDARD_USER'),
(7, 'sarahrunner', 'sarah@example.com', '$2a$10$w/XbN8F4J6cZ4vY8zF1zO.1X5D6E7F8G9H0I1J2K3L4M5N6O7P8Q', 'PREMIUM_USER'),
(8, 'coachmarcus', 'marcus@example.com', '$2a$10$w/XbN8F4J6cZ4vY8zF1zO.1X5D6E7F8G9H0I1J2K3L4M5N6O7P8Q', 'TRAINER')
ON DUPLICATE KEY UPDATE username=VALUES(username);

-- 2. USER PROFILES TABLE
INSERT INTO user_profile (id, user_id, height, current_weight, target_weight, activity_level, health_conditions) VALUES
(1, 1, 180.0, 80.0, 75.0, 'HIGH', 'None'),
(2, 2, 182.0, 85.0, 82.0, 'VERY_ACTIVE', 'None'),
(3, 3, 170.0, 65.0, 62.0, 'MODERATE', 'None'),
(4, 4, 175.0, 74.0, 70.0, 'ACTIVE', 'Healthy'),
(5, 5, 178.0, 75.1, 70.0, 'MODERATE', 'Healthy'),
(6, 6, 176.0, 76.0, 72.0, 'ACTIVE', 'None'),
(7, 7, 168.0, 58.0, 55.0, 'VERY_ACTIVE', 'None'),
(8, 8, 185.0, 88.0, 85.0, 'VERY_ACTIVE', 'None')
ON DUPLICATE KEY UPDATE height=VALUES(height);

-- 3. EXERCISES TABLE
INSERT INTO exercise (id, name, category, muscle_groups, equipment, instructions, difficulty_level) VALUES
(1, 'Barbell Bench Press', 'STRENGTH', 'Chest, Triceps', 'Barbell, Bench', 'Keep feet flat, lower bar to mid-chest, press up.', 'INTERMEDIATE'),
(2, 'Barbell Squat', 'STRENGTH', 'Quadriceps, Glutes, Core', 'Barbell, Squat Rack', 'Keep spine neutral, squat below parallel, drive through heels.', 'INTERMEDIATE'),
(3, 'Outdoor Running', 'CARDIO', 'Legs, Cardiovascular', 'Running Shoes', 'Maintain cadence of 170-180 bpm with upright stance.', 'BEGINNER'),
(4, 'Forearm Plank', 'CORE', 'Abdominals, Lower Back', 'Mat', 'Hold straight line from shoulders to heels.', 'BEGINNER'),
(5, 'Wide-Grip Pull-Up', 'STRENGTH', 'Lats, Biceps', 'Pull-Up Bar', 'Pull chest to bar with controlled eccentric phase.', 'ADVANCED')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. FITNESS GOALS TABLE
INSERT INTO fitness_goal (id, user_id, goal_type, target_value, current_value, start_date, target_date, status, priority, created_date) VALUES
(1, 5, 'WATER', 5.0, 3.2, '2026-09-01', '2026-09-30', 'IN_PROGRESS', 'HIGH', NOW()),
(2, 5, 'WEIGHT_LOSS', 70.0, 75.1, '2026-08-15', '2026-10-15', 'IN_PROGRESS', 'HIGH', NOW()),
(3, 7, 'RUN', 10.0, 10.0, '2026-09-01', '2026-09-15', 'ACHIEVED', 'MEDIUM', NOW()),
(4, 4, 'MUSCLE_GAIN', 5.0, 3.5, '2026-09-01', '2026-12-01', 'IN_PROGRESS', 'HIGH', NOW()),
(5, 5, 'STEPS', 10000.0, 8500.0, '2026-09-17', '2026-09-17', 'IN_PROGRESS', 'LOW', NOW())
ON DUPLICATE KEY UPDATE target_value=VALUES(target_value);

-- 5. WORKOUTS TABLE
INSERT INTO workout (id, user_id, date, duration, notes) VALUES
(1, 5, '2026-09-16', 45, 'Morning Park Trail Run - strong pace throughout'),
(2, 5, '2026-09-15', 60, 'Upper Body Power Session - Bench Press and Pull-Ups'),
(3, 6, '2026-09-14', 35, 'High Intensity Fat Burner & Tabata'),
(4, 7, '2026-09-12', 50, '10k Marathon Pace Run & Leg Day'),
(5, 4, '2026-09-11', 40, 'Full Body Mobility & Yoga Flow')
ON DUPLICATE KEY UPDATE duration=VALUES(duration);

-- 6. WORKOUT EXERCISES TABLE
INSERT INTO workout_exercise (id, workout_id, exercise_id, sets, reps, weight) VALUES
(1, 1, 3, 1, 1, 0.0),
(2, 2, 1, 4, 10, 75.0),
(3, 2, 5, 4, 8, 0.0),
(4, 3, 4, 3, 60, 0.0),
(5, 4, 2, 4, 8, 50.0),
(6, 5, 4, 4, 45, 0.0)
ON DUPLICATE KEY UPDATE sets=VALUES(sets);

-- 7. NUTRITION ENTRIES TABLE
INSERT INTO nutrition_entry (id, user_id, food_item, quantity, calories, macronutrients, meal_type, date) VALUES
(1, 5, 'Oatmeal with Blueberries & Whey', 1.5, 450.0, 'C:60g, P:30g, F:10g', 'BREAKFAST', '2026-09-16 08:30:00'),
(2, 5, 'Grilled Chicken Quinoa Salad', 1.0, 580.0, 'C:50g, P:45g, F:15g', 'LUNCH', '2026-09-16 13:00:00'),
(3, 6, 'Baked Salmon & Roasted Veggies', 1.0, 650.0, 'C:30g, P:48g, F:22g', 'DINNER', '2026-09-15 19:30:00'),
(4, 7, 'Greek Yogurt & Almonds', 1.0, 220.0, 'C:15g, P:20g, F:8g', 'SNACK', '2026-09-15 16:00:00'),
(5, 4, 'Avocado Toast with Poached Eggs', 1.0, 420.0, 'C:35g, P:22g, F:18g', 'BREAKFAST', '2026-09-14 08:00:00')
ON DUPLICATE KEY UPDATE food_item=VALUES(food_item);

-- 8. PROGRESS TRACKING TABLE
INSERT INTO progress_tracking (id, goal_id, date, progress_value, notes) VALUES
(1, 2, '2026-08-15', 78.5, 'Initial weight measurement'),
(2, 2, '2026-08-22', 77.2, 'First week progress - energy levels high'),
(3, 2, '2026-09-01', 76.0, 'Hydration and cardio paying off'),
(4, 2, '2026-09-10', 75.1, 'Approaching milestone target!')
ON DUPLICATE KEY UPDATE progress_value=VALUES(progress_value);

-- 9. NOTIFICATIONS TABLE
INSERT INTO notification (id, user_id, message, type, is_read, created_date, scheduled_date) VALUES
(1, 5, 'Goal Milestone Achieved: Reached 10km Run Target!', 'ACHIEVEMENT', TRUE, NOW(), NULL),
(2, 5, 'Workout Streak Alert: You have logged workouts for 7 consecutive days!', 'REMINDER', FALSE, NOW(), NULL),
(3, 5, 'Hydration Reminder: Log your daily water intake to reach your goal.', 'REMINDER', FALSE, NOW(), NULL),
(4, 6, 'Connection Accepted: You are now fitness partners with standarduser.', 'SOCIAL', TRUE, NOW(), NULL)
ON DUPLICATE KEY UPDATE message=VALUES(message);

-- 10. SOCIAL CONNECTIONS TABLE
INSERT INTO social_connection (id, user_id, friend_id, connection_type, status, created_date) VALUES
(1, 5, 6, 'WORKOUT_PARTNER', 'ACCEPTED', NOW()),
(2, 5, 7, 'FRIEND', 'ACCEPTED', NOW()),
(3, 8, 5, 'COACH', 'PENDING', NOW())
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- 11. DIET PLANS TABLE
INSERT INTO diet_plans (id, user_id, nutritionist_id, plan_name, description, goal, daily_calories, protein_target, carbs_target, fat_target, start_date, end_date, status, created_at, updated_at) VALUES
(1, 5, 3, 'High Protein Muscle Rebuilding Plan', 'Targeted caloric surplus with rich macronutrient profile.', 'Muscle Gain & Fat Reduction', 2400.0, 175.0, 210.0, 65.0, '2026-09-01', '2026-10-01', 'ACTIVE', NOW(), NOW()),
(2, 7, 3, 'Endurance & Carb Loading Diet', 'Carbohydrate loading for long distance marathon running.', 'Marathon Endurance', 2800.0, 140.0, 380.0, 70.0, '2026-09-05', '2026-10-05', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE plan_name=VALUES(plan_name);

-- 12. DIET PLAN FOODS TABLE
INSERT INTO diet_plan_foods (id, diet_plan_id, food_name, meal_type, quantity, calories, protein, carbohydrates, fats) VALUES
(1, 1, 'Oatmeal & Protein Shake', 'BREAKFAST', 1.0, 500.0, 40.0, 60.0, 10.0),
(2, 1, 'Chicken Breast & Brown Rice', 'LUNCH', 1.0, 650.0, 55.0, 70.0, 15.0),
(3, 1, 'Grilled Salmon & Quinoa', 'DINNER', 1.0, 700.0, 50.0, 50.0, 25.0),
(4, 2, 'Whole Wheat Pasta & Turkey', 'LUNCH', 1.0, 850.0, 45.0, 120.0, 18.0)
ON DUPLICATE KEY UPDATE food_name=VALUES(food_name);

-- 13. WORKOUT PLANS TABLE
INSERT INTO workout_plans (id, user_id, trainer_id, name, description, goal, start_date, end_date, status, created_at, updated_at) VALUES
(1, 5, 2, '5-Day Hypertrophy & Strength Split', 'Progressive overload program designed by certified trainer.', 'Hypertrophy', '2026-09-01', '2026-10-01', 'ACTIVE', NOW(), NOW()),
(2, 7, 2, 'Endurance Cardio & Core Blast', 'High cadence interval training to improve VO2 max.', 'Endurance & Speed', '2026-09-05', '2026-10-05', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 14. WORKOUT PLAN EXERCISES TABLE
INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, exercise_name, sets, repetitions, duration, rest_time, notes) VALUES
(1, 1, 1, 'Barbell Bench Press', 4, 10, 15, 90, 'Explosive concentric phase'),
(2, 1, 2, 'Barbell Squat', 4, 8, 20, 120, 'Squat below parallel'),
(3, 2, 3, 'Outdoor Sprint Intervals', 6, 1, 20, 60, 'Max effort 400m sprints'),
(4, 2, 4, 'Forearm Plank Hold', 4, 1, 10, 45, 'Brace core tightly')
ON DUPLICATE KEY UPDATE exercise_name=VALUES(exercise_name);
