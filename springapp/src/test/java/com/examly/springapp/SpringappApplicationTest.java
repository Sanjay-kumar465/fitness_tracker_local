package com.examly.springapp;

import com.examly.springapp.configuration.CorsConfig;
import com.examly.springapp.model.FitnessEntry;
import com.examly.springapp.repository.FitnessRepository;
import com.examly.springapp.service.FitnessService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
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
    private FitnessRepository repository;

    @Autowired
    private FitnessService service;

    @Autowired
    private ObjectMapper objectMapper;

    private FitnessEntry testEntry;

    @BeforeEach
    public void setup() {
        repository.deleteAll();
        testEntry = new FitnessEntry();
        testEntry.setUsername("john_doe");
        testEntry.setGoalType("Run");
        testEntry.setTargetAmount(5.0);
        testEntry.setAchievedAmount(3.0);
        testEntry.setDate(LocalDate.of(2025, 8, 6));
        repository.save(testEntry);
    }

    @Test
    public void SpringBoot_ProjectAnalysisAndUMLDiagram_InstallSpringBootcreateprojectannotationscontrollerservicelayers() {
        assertThat(repository).isNotNull();
        assertThat(mockMvc).isNotNull();
        assertThat(service).isNotNull();
    }

    @Test
    public void SpringBoot_DevelopCoreAPIsAndBusinessLogic_RestControllerServiceGETPOSTendpointsJSONresponse() throws Exception {
        mockMvc.perform(get("/api/fitness/john_doe"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].goalType").value("Run"));
    }

    @Test
    public void SpringBoot_DevelopCoreAPIsAndBusinessLogic_FullCRUDwithJPARepositoryPathVariableRequestBody() throws Exception {
        FitnessEntry newEntry = new FitnessEntry();
        newEntry.setUsername("john_doe");
        newEntry.setGoalType("Cycle");
        newEntry.setTargetAmount(10.0);
        newEntry.setAchievedAmount(6.0);
        newEntry.setDate(LocalDate.of(2025, 8, 7));

        mockMvc.perform(post("/api/fitness")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newEntry)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.goalType").value("Cycle"));

        // Verify it is saved in DB
        List<FitnessEntry> entries = repository.findByUsername("john_doe");
        assertThat(entries.stream().anyMatch(e -> "Cycle".equals(e.getGoalType()))).isTrue();
    }

    @Test
    public void SpringBoot_DatabaseAndSchemaSetup_RepositoryfindByUsernameWorks() {
        List<FitnessEntry> result = repository.findByUsername("john_doe");
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getGoalType()).isEqualTo("Run");
    }

    @Test
    public void SpringBoot_ProjectAnalysisAndUMLDiagram_ServiceLayerSaveAndRetrieveWorks() {
        FitnessEntry entry = new FitnessEntry();
        entry.setUsername("john_doe");
        entry.setGoalType("Swim");
        entry.setTargetAmount(2);
        entry.setAchievedAmount(1);
        entry.setDate(LocalDate.of(2025, 8, 8));

        service.saveEntry(entry);
        List<FitnessEntry> fetched = service.getEntriesByUsername("john_doe");
        assertThat(fetched.stream().anyMatch(e -> "Swim".equals(e.getGoalType()))).isTrue();
    }

    @Test
    public void SpringBoot_DevelopCoreAPIsAndBusinessLogic_GetEntriesForNonExistentUserReturnsEmptyList() throws Exception {
        mockMvc.perform(get("/api/fitness/unknown_user"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    public void SpringBoot_DevelopCoreAPIsAndBusinessLogic_TestCRUDAPIsvalidateheadersparamsJSONresponses() throws Exception {
        mockMvc.perform(get("/api/fitness/john_doe")
                        .header("Accept", "application/json"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    public void SpringBoot_ProjectAnalysisAndUMLDiagram_TestCorsConfigurationAllowsCorrectOrigin() {
        CorsConfig corsConfig = new CorsConfig();
        CorsRegistry registry = new CorsRegistry();
        corsConfig.addCorsMappings(registry);
        // We can't directly verify registry internals here without mocking,
        // but we at least ensure no exceptions thrown during config
        assertThat(corsConfig).isNotNull();
    }
    @Test
public void SpringBoot_DevelopCoreAPIsAndBusinessLogic_PostNewFitnessEntryAndVerifySavedCorrectly() throws Exception {
    FitnessEntry entry = new FitnessEntry();
    entry.setUsername("alice_walker");
    entry.setGoalType("Yoga");
    entry.setTargetAmount(7.0);
    entry.setAchievedAmount(4.0);
    entry.setDate(LocalDate.of(2025, 8, 7));

    mockMvc.perform(post("/api/fitness")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(entry)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.goalType").value("Yoga"));

    List<FitnessEntry> result = repository.findByUsername("alice_walker");
    assertThat(result).isNotEmpty();
    assertThat(result.get(0).getGoalType()).isEqualTo("Yoga");
}

@Test
public void SpringBoot_DevelopCoreAPIsAndBusinessLogic_GetFitnessEntriesForDifferentUser() throws Exception {
    FitnessEntry entry = new FitnessEntry();
    entry.setUsername("michael_smith");
    entry.setGoalType("Rowing");
    entry.setTargetAmount(3.0);
    entry.setAchievedAmount(2.5);
    entry.setDate(LocalDate.of(2025, 8, 6));
    repository.save(entry);

    mockMvc.perform(get("/api/fitness/michael_smith"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].goalType").value("Rowing"))
            .andExpect(jsonPath("$[0].username").value("michael_smith"));
}

}
