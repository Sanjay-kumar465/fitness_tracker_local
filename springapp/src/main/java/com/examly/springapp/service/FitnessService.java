
package com.examly.springapp.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.examly.springapp.model.FitnessEntry;
import com.examly.springapp.repository.FitnessRepository;

@Service
public class FitnessService {

    private final FitnessRepository repository;

    public FitnessService(FitnessRepository repository) {
        this.repository = repository;
    }

    public FitnessEntry saveEntry(FitnessEntry entry) {
        return repository.save(entry);
    }

    public List<FitnessEntry> getEntriesByUsername(String username) {
        return repository.findByUsername(username);
    }
}
