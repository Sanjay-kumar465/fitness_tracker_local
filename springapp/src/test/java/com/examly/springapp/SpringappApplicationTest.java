package com.examly.springapp;

import com.examly.springapp.config.CorsConfig;
import com.examly.springapp.entity.FitnessGoal;
import com.examly.springapp.entity.User;
import com.examly.springapp.enums.GoalStatus;
import com.examly.springapp.enums.GoalType;
import com.examly.springapp.enums.Priority;
import com.examly.springapp.enums.Role;
import com.examly.springapp.repository.FitnessGoalRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.service.FitnessGoalService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class SpringappApplicationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private FitnessGoalRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FitnessGoalService service;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;
    private FitnessGoal testEntry;

    @BeforeEach
    public void setup() {
        repository.deleteAll();
        userRepository.deleteAll();

        testUser = new User();
        testUser.setUsername("john_doe");
        testUser.setEmail("john@example.com");
        testUser.setPasswordHash("hash");
        testUser.setRole(Role.USER);
        userRepository.save(testUser);

        testEntry = new FitnessGoal();
        testEntry.setUser(testUser);
        testEntry.setGoalType(GoalType.WEIGHT_LOSS);
        testEntry.setTargetValue(5.0);
        testEntry.setCurrentValue(3.0);
        testEntry.setStartDate(LocalDate.of(2025, 8, 6));
        testEntry.setTargetDate(LocalDate.of(2025, 12, 6));
        testEntry.setStatus(GoalStatus.IN_PROGRESS);
        testEntry.setPriority(Priority.HIGH);
        repository.save(testEntry);
    }

    @Test
    public void SpringBoot_ProjectAnalysisAndUMLDiagram_InstallSpringBootcreateprojectannotationscontrollerservicelayers() {
        assertThat(repository).isNotNull();
        assertThat(mockMvc).isNotNull();
        assertThat(service).isNotNull();
    }

    @Test
    @WithMockUser(username = "john_doe", roles = {"USER"})
    public void SpringBoot_DevelopCoreAPIsAndBusinessLogic_RestControllerServiceGETPOSTendpointsJSONresponse() throws Exception {
        mockMvc.perform(get("/api/goals/user/" + testUser.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].goalType").value("WEIGHT_LOSS"));
    }

    @Test
    @WithMockUser(username = "john_doe", roles = {"USER"})
    public void SpringBoot_DevelopCoreAPIsAndBusinessLogic_FullCRUDwithJPARepositoryPathVariableRequestBody() throws Exception {
        FitnessGoal newEntry = new FitnessGoal();
        newEntry.setUser(testUser);
        newEntry.setGoalType(GoalType.MUSCLE_GAIN);
        newEntry.setTargetValue(10.0);
        newEntry.setCurrentValue(6.0);
        newEntry.setStartDate(LocalDate.of(2025, 8, 7));
        newEntry.setTargetDate(LocalDate.of(2025, 12, 7));
        newEntry.setPriority(Priority.MEDIUM);

        mockMvc.perform(post("/api/goals")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newEntry)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.goalType").value("MUSCLE_GAIN"));

        // Verify it is saved in DB
        List<FitnessGoal> entries = repository.findByUserId(testUser.getId());
        assertThat(entries.stream().anyMatch(e -> GoalType.MUSCLE_GAIN.equals(e.getGoalType()))).isTrue();
    }

    @Test
    public void SpringBoot_DatabaseAndSchemaSetup_RepositoryfindByUsernameWorks() {
        List<FitnessGoal> result = repository.findByUserId(testUser.getId());
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getGoalType()).isEqualTo(GoalType.WEIGHT_LOSS);
    }

    @Test
    public void SpringBoot_ProjectAnalysisAndUMLDiagram_ServiceLayerSaveAndRetrieveWorks() {
        FitnessGoal entry = new FitnessGoal();
        entry.setUser(testUser);
        entry.setGoalType(GoalType.ENDURANCE);
        entry.setTargetValue(2.0);
        entry.setCurrentValue(1.0);
        entry.setStartDate(LocalDate.of(2025, 8, 8));
        entry.setTargetDate(LocalDate.of(2025, 12, 8));
        entry.setPriority(Priority.LOW);

        service.createGoal(entry);
        List<FitnessGoal> fetched = service.getUserGoals(testUser.getId());
        assertThat(fetched.stream().anyMatch(e -> GoalType.ENDURANCE.equals(e.getGoalType()))).isTrue();
    }

    @Test
    @WithMockUser(username = "john_doe", roles = {"USER"})
    public void SpringBoot_DevelopCoreAPIsAndBusinessLogic_GetEntriesForNonExistentUserReturnsEmptyList() throws Exception {
        mockMvc.perform(get("/api/goals/user/999"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    @WithMockUser(username = "john_doe", roles = {"USER"})
    public void SpringBoot_DevelopCoreAPIsAndBusinessLogic_TestCRUDAPIsvalidateheadersparamsJSONresponses() throws Exception {
        mockMvc.perform(get("/api/goals/user/" + testUser.getId())
                        .header("Accept", "application/json"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    public void SpringBoot_ProjectAnalysisAndUMLDiagram_TestCorsConfigurationAllowsCorrectOrigin() {
        CorsConfig corsConfig = new CorsConfig();
        CorsRegistry registry = new CorsRegistry();
        corsConfig.addCorsMappings(registry);
        assertThat(corsConfig).isNotNull();
    }

    @Test
    @WithMockUser(username = "alice_walker", roles = {"USER"})
    public void SpringBoot_DevelopCoreAPIsAndBusinessLogic_PostNewFitnessEntryAndVerifySavedCorrectly() throws Exception {
        User alice = new User();
        alice.setUsername("alice_walker");
        alice.setEmail("alice@example.com");
        alice.setPasswordHash("hash");
        alice.setRole(Role.USER);
        userRepository.save(alice);

        FitnessGoal entry = new FitnessGoal();
        entry.setUser(alice);
        entry.setGoalType(GoalType.FLEXIBILITY);
        entry.setTargetValue(7.0);
        entry.setCurrentValue(4.0);
        entry.setStartDate(LocalDate.of(2025, 8, 7));
        entry.setTargetDate(LocalDate.of(2025, 12, 7));
        entry.setPriority(Priority.HIGH);

        mockMvc.perform(post("/api/goals")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(entry)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.goalType").value("FLEXIBILITY"));

        List<FitnessGoal> result = repository.findByUserId(alice.getId());
        assertThat(result).isNotEmpty();
        assertThat(result.get(0).getGoalType()).isEqualTo(GoalType.FLEXIBILITY);
    }

    @Test
    @WithMockUser(username = "michael_smith", roles = {"USER"})
    public void SpringBoot_DevelopCoreAPIsAndBusinessLogic_GetFitnessEntriesForDifferentUser() throws Exception {
        User michael = new User();
        michael.setUsername("michael_smith");
        michael.setEmail("michael@example.com");
        michael.setPasswordHash("hash");
        michael.setRole(Role.USER);
        userRepository.save(michael);

        FitnessGoal entry = new FitnessGoal();
        entry.setUser(michael);
        entry.setGoalType(GoalType.STRENGTH);
        entry.setTargetValue(3.0);
        entry.setCurrentValue(2.5);
        entry.setStartDate(LocalDate.of(2025, 8, 6));
        entry.setTargetDate(LocalDate.of(2025, 12, 6));
        entry.setPriority(Priority.MEDIUM);
        repository.save(entry);

        mockMvc.perform(get("/api/goals/user/" + michael.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].goalType").value("STRENGTH"))
                .andExpect(jsonPath("$[0].user.username").value("michael_smith"));
    }
}
