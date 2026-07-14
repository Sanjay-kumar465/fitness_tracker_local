import os
import re

base = r"D:\Fitness-Tracker\Fitness-Goal-Tracker-App\springapp\src\main\java\com\examly\springapp"

def get_file_content(path):
    p = os.path.join(base, path)
    with open(p, 'r', encoding='utf-8') as f:
        return f.read()

def write_file_content(path, content):
    p = os.path.join(base, path)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(content)

# FitnessGoalController
c = get_file_content(r"controller\FitnessGoalController.java")
# The error was: getGoalsByUserId cannot find symbol.
# I need to see what methods actually exist in FitnessGoalService.
c = c.replace("fitnessGoalService.getGoalsByUserId", "fitnessGoalService.getFitnessGoalsByUserId")
c = c.replace("fitnessGoalService.updateGoal", "fitnessGoalService.updateFitnessGoal")
c = c.replace("fitnessGoalService.deleteGoal", "fitnessGoalService.deleteFitnessGoal")
write_file_content(r"controller\FitnessGoalController.java", c)

# ProgressTrackingController
c = get_file_content(r"controller\ProgressTrackingController.java")
c = c.replace("progressTrackingService.logProgress", "progressTrackingService.addProgress")
c = c.replace("progressTrackingService.getProgressByGoalId", "progressTrackingService.getProgressByFitnessGoalId")
write_file_content(r"controller\ProgressTrackingController.java", c)

# NutritionController
c = get_file_content(r"controller\NutritionController.java")
c = c.replace("nutritionService.getNutritionByUserId", "nutritionService.getNutritionEntriesByUserId")
write_file_content(r"controller\NutritionController.java", c)
