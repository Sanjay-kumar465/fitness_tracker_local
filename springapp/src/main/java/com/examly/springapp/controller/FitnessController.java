
package com.examly.springapp.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.examly.springapp.model.FitnessEntry;
import com.examly.springapp.service.FitnessService;

@RestController
@RequestMapping("/api/fitness")
public class FitnessController {

    private final FitnessService service;

    public FitnessController(FitnessService service) {
        this.service = service;
    }

    @PostMapping
    public FitnessEntry saveEntry(@RequestBody FitnessEntry entry) {
        return service.saveEntry(entry);
    }

    @GetMapping("/{username}")
    public List<FitnessEntry> getEntries(@PathVariable String username) {
        return service.getEntriesByUsername(username);
    }
}
