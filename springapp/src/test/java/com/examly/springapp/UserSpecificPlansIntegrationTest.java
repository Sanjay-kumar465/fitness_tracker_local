package com.examly.springapp;

import com.examly.springapp.dto.DietPlanDto;
import com.examly.springapp.dto.DietPlanFoodDto;
import com.examly.springapp.dto.WorkoutPlanDto;
import com.examly.springapp.dto.WorkoutPlanExerciseDto;
import com.examly.springapp.entity.User;
import com.examly.springapp.enums.MealType;
import com.examly.springapp.enums.Role;
import com.examly.springapp.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UserSpecificPlansIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DietPlanRepository dietPlanRepository;

    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;

    @Autowired
    private FitnessGoalRepository fitnessGoalRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private User targetUser;
    private User nutritionistUser;
    private User trainerUser;
    private User unauthorizedUser;

    @BeforeEach
    public void setup() {
        dietPlanRepository.deleteAll();
        workoutPlanRepository.deleteAll();
        fitnessGoalRepository.deleteAll();
        userProfileRepository.deleteAll();
        userRepository.deleteAll();

        targetUser = new User();
        targetUser.setUsername("client_user");
        targetUser.setEmail("client@fits.com");
        targetUser.setPasswordHash("hash");
        targetUser.setRole(Role.STANDARD_USER);
        targetUser = userRepository.save(targetUser);

        nutritionistUser = new User();
        nutritionistUser.setUsername("nutritionist_doc");
        nutritionistUser.setEmail("doc@fits.com");
        nutritionistUser.setPasswordHash("hash");
        nutritionistUser.setRole(Role.NUTRITIONIST);
        nutritionistUser = userRepository.save(nutritionistUser);

        trainerUser = new User();
        trainerUser.setUsername("coach_mike");
        trainerUser.setEmail("mike@fits.com");
        trainerUser.setPasswordHash("hash");
        trainerUser.setRole(Role.TRAINER);
        trainerUser = userRepository.save(trainerUser);

        unauthorizedUser = new User();
        unauthorizedUser.setUsername("other_user");
        unauthorizedUser.setEmail("other@fits.com");
        unauthorizedUser.setPasswordHash("hash");
        unauthorizedUser.setRole(Role.STANDARD_USER);
        unauthorizedUser = userRepository.save(unauthorizedUser);
    }

    @Test
    @WithMockUser(username = "nutritionist_doc", roles = {"NUTRITIONIST"})
    public void testNutritionistCanCreateDietPlanForSpecificUser() throws Exception {
        DietPlanDto dto = new DietPlanDto();
        dto.setUserId(targetUser.getId());
        dto.setPlanName("Keto Weight Loss Plan");
        dto.setGoal("Weight Loss");
        dto.setDailyCalories(1800.0);
        dto.setProteinTarget(140.0);
        dto.setCarbsTarget(50.0);
        dto.setFatTarget(90.0);
        dto.setStartDate(LocalDate.now());

        DietPlanFoodDto food = new DietPlanFoodDto();
        food.setFoodName("Avocado & Eggs");
        food.setMealType(MealType.BREAKFAST);
        food.setCalories(450.0);
        dto.setFoods(List.of(food));

        mockMvc.perform(post("/api/diet-plans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.planName").value("Keto Weight Loss Plan"))
                .andExpect(jsonPath("$.userId").value(targetUser.getId()))
                .andExpect(jsonPath("$.nutritionistName").value("nutritionist_doc"));

        assertThat(dietPlanRepository.findByUserId(targetUser.getId())).hasSize(1);
    }

    @Test
    @WithMockUser(username = "coach_mike", roles = {"TRAINER"})
    public void testTrainerCannotCreateDietPlanReturnsForbidden() throws Exception {
        DietPlanDto dto = new DietPlanDto();
        dto.setUserId(targetUser.getId());
        dto.setPlanName("Illegal Trainer Diet Plan");

        mockMvc.perform(post("/api/diet-plans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "other_user", roles = {"STANDARD_USER"})
    public void testStandardUserCannotCreateDietPlanReturnsForbidden() throws Exception {
        DietPlanDto dto = new DietPlanDto();
        dto.setUserId(targetUser.getId());
        dto.setPlanName("Illegal Standard User Plan");

        mockMvc.perform(post("/api/diet-plans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "coach_mike", roles = {"TRAINER"})
    public void testTrainerCanCreateWorkoutPlanForSpecificUser() throws Exception {
        WorkoutPlanDto dto = new WorkoutPlanDto();
        dto.setUserId(targetUser.getId());
        dto.setName("Marathon Training Routine");
        dto.setGoal("Endurance");
        dto.setStartDate(LocalDate.now());

        WorkoutPlanExerciseDto ex = new WorkoutPlanExerciseDto();
        ex.setExerciseName("5km Tempo Run");
        ex.setSets(3);
        ex.setRepetitions(1);
        ex.setDuration(30);
        dto.setExercises(List.of(ex));

        mockMvc.perform(post("/api/workout-plans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Marathon Training Routine"))
                .andExpect(jsonPath("$.userId").value(targetUser.getId()))
                .andExpect(jsonPath("$.trainerName").value("coach_mike"));

        assertThat(workoutPlanRepository.findByUserId(targetUser.getId())).hasSize(1);
    }

    @Test
    @WithMockUser(username = "nutritionist_doc", roles = {"NUTRITIONIST"})
    public void testNutritionistCannotCreateWorkoutPlanReturnsForbidden() throws Exception {
        WorkoutPlanDto dto = new WorkoutPlanDto();
        dto.setUserId(targetUser.getId());
        dto.setName("Illegal Nutritionist Workout Plan");

        mockMvc.perform(post("/api/workout-plans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "other_user", roles = {"STANDARD_USER"})
    public void testUserCannotAccessOtherUsersDietPlansReturnsForbidden() throws Exception {
        mockMvc.perform(get("/api/diet-plans/user/" + targetUser.getId()))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "nutritionist_doc", roles = {"NUTRITIONIST"})
    public void testCannotAssignDietPlanToStaffRoleReturnsBadRequest() throws Exception {
        DietPlanDto dto = new DietPlanDto();
        dto.setUserId(trainerUser.getId());
        dto.setPlanName("Illegal Staff Diet Plan");
        dto.setDailyCalories(2000.0);

        mockMvc.perform(post("/api/diet-plans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Diet plans can only be assigned to standard or premium client users, not staff roles."));
    }

    @Test
    @WithMockUser(username = "coach_mike", roles = {"TRAINER"})
    public void testCannotAssignWorkoutPlanToStaffRoleReturnsBadRequest() throws Exception {
        WorkoutPlanDto dto = new WorkoutPlanDto();
        dto.setUserId(nutritionistUser.getId());
        dto.setName("Illegal Staff Workout Plan");

        mockMvc.perform(post("/api/workout-plans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Workout plans can only be assigned to standard or premium client users, not staff roles."));
    }
}
