import os

base = r"D:\Fitness-Tracker\Fitness-Goal-Tracker-App\springapp\src\main\java\com\examly\springapp"

def get_file(rel): return os.path.join(base, rel)

# Fix NutritionController
nut_c = get_file(r"controller\NutritionController.java")
with open(nut_c, 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace("nutritionService.getNutritionByUserId", "nutritionService.getUserNutritionEntries")
with open(nut_c, 'w', encoding='utf-8') as f:
    f.write(c)

# Fix ProgressTrackingController
pt_c = get_file(r"controller\ProgressTrackingController.java")
with open(pt_c, 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace("progressTrackingService.logProgress", "progressTrackingService.addProgressEntry")
with open(pt_c, 'w', encoding='utf-8') as f:
    f.write(c)

# Fix ProgressTrackingService
pt_s = get_file(r"service\ProgressTrackingService.java")
with open(pt_s, 'r', encoding='utf-8') as f:
    c = f.read()
if "getProgressByGoalId" not in c:
    c = c.replace("}", """    public java.util.List<com.examly.springapp.entity.ProgressTracking> getProgressByGoalId(Long goalId) {
        return progressTrackingRepository.findByFitnessGoalId(goalId);
    }
}""")
    with open(pt_s, 'w', encoding='utf-8') as f:
        f.write(c)

# Fix FitnessGoalController
fg_c = get_file(r"controller\FitnessGoalController.java")
with open(fg_c, 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace("fitnessGoalService.getGoalsByUserId", "fitnessGoalService.getUserGoals")
with open(fg_c, 'w', encoding='utf-8') as f:
    f.write(c)

# Fix FitnessGoalService
fg_s = get_file(r"service\FitnessGoalService.java")
with open(fg_s, 'r', encoding='utf-8') as f:
    c = f.read()
if "deleteGoal" not in c:
    c = c.replace("}", """    public com.examly.springapp.entity.FitnessGoal updateGoal(Long id, com.examly.springapp.entity.FitnessGoal updatedGoal) {
        com.examly.springapp.entity.FitnessGoal existing = fitnessGoalRepository.findById(id).orElseThrow(() -> new com.examly.springapp.exception.ResourceNotFoundException("Goal not found"));
        existing.setType(updatedGoal.getType());
        existing.setTargetValue(updatedGoal.getTargetValue());
        existing.setTargetDate(updatedGoal.getTargetDate());
        return fitnessGoalRepository.save(existing);
    }
    public void deleteGoal(Long id) {
        fitnessGoalRepository.deleteById(id);
    }
}""")
    with open(fg_s, 'w', encoding='utf-8') as f:
        f.write(c)

print("Services and Controllers fixed.")
