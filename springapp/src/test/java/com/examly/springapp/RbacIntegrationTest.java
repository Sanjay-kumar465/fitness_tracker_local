package com.examly.springapp;

import com.examly.springapp.dto.RegisterRequest;
import com.examly.springapp.entity.User;
import com.examly.springapp.enums.FitnessLevel;
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
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class RbacIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private FitnessGoalRepository fitnessGoalRepository;

    @Autowired
    private ProgressTrackingRepository progressTrackingRepository;

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private WorkoutExerciseRepository workoutExerciseRepository;

    @Autowired
    private NutritionEntryRepository nutritionEntryRepository;

    @Autowired
    private SocialConnectionRepository socialConnectionRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private DietPlanRepository dietPlanRepository;

    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        dietPlanRepository.deleteAll();
        workoutPlanRepository.deleteAll();
        progressTrackingRepository.deleteAll();
        workoutExerciseRepository.deleteAll();
        workoutRepository.deleteAll();
        nutritionEntryRepository.deleteAll();
        fitnessGoalRepository.deleteAll();
        socialConnectionRepository.deleteAll();
        notificationRepository.deleteAll();
        userProfileRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    public void testTrainerProfileRegistrationCreatesTrainerRole() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "trainerjohn",
                "trainer@example.com",
                "Password123!",
                LocalDate.of(1990, 1, 1),
                FitnessLevel.ADVANCED,
                Role.TRAINER
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("TRAINER"));

        User dbUser = userRepository.findByUsername("trainerjohn").orElse(null);
        assertThat(dbUser).isNotNull();
        assertThat(dbUser.getRole()).isEqualTo(Role.TRAINER);
    }

    @Test
    public void testNutritionistProfileRegistrationCreatesNutritionistRole() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "nutrisarah",
                "nutri@example.com",
                "Password123!",
                LocalDate.of(1992, 5, 15),
                FitnessLevel.INTERMEDIATE,
                Role.NUTRITIONIST
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("NUTRITIONIST"));

        User dbUser = userRepository.findByUsername("nutrisarah").orElse(null);
        assertThat(dbUser).isNotNull();
        assertThat(dbUser.getRole()).isEqualTo(Role.NUTRITIONIST);
    }

    @Test
    public void testPublicRegistrationPreventsAdminRoleEscalation() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "fakeadmin",
                "fakeadmin@example.com",
                "Password123!",
                LocalDate.of(1985, 3, 20),
                FitnessLevel.ADVANCED,
                Role.ADMIN
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is4xxClientError());
    }

    @Test
    public void testTrainerLoginAndEndpointAccess() throws Exception {
        RegisterRequest registerReq = new RegisterRequest(
                "traineralex",
                "alex@example.com",
                "Password123!",
                LocalDate.of(1988, 10, 10),
                FitnessLevel.ADVANCED,
                Role.TRAINER
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isOk());

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("username", "traineralex", "password", "Password123!"))))
                .andExpect(status().isOk())
                .andReturn();

        String token = loginResult.getResponse().getContentAsString();
        assertThat(token).isNotEmpty();

        User alex = userRepository.findByUsername("traineralex").orElseThrow();

        // Trainer accessing goals endpoint should succeed (200)
        mockMvc.perform(get("/api/goals/user/" + alex.getId())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "standard_user", roles = {"STANDARD_USER"})
    public void testStandardUserAccessingAdminEndpointReturnsForbidden() throws Exception {
        User user = new User();
        user.setUsername("target_user");
        user.setEmail("target@example.com");
        user.setPasswordHash("hash");
        user.setRole(Role.STANDARD_USER);
        userRepository.save(user);

        mockMvc.perform(put("/api/users/" + user.getId() + "/role")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("role", "ADMIN"))))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin_user", roles = {"ADMIN"})
    public void testAdminUpdatingUserRoleSucceeds() throws Exception {
        User user = new User();
        user.setUsername("user_to_promote");
        user.setEmail("promote@example.com");
        user.setPasswordHash("hash");
        user.setRole(Role.STANDARD_USER);
        userRepository.save(user);

        mockMvc.perform(put("/api/users/" + user.getId() + "/role")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("role", "PREMIUM_USER"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("PREMIUM_USER"));

        User updatedUser = userRepository.findById(user.getId()).orElseThrow();
        assertThat(updatedUser.getRole()).isEqualTo(Role.PREMIUM_USER);
    }
}
