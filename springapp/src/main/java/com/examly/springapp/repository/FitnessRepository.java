
package com.examly.springapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.examly.springapp.model.FitnessEntry;

@Repository
public interface FitnessRepository extends JpaRepository<FitnessEntry, Long> {

    List<FitnessEntry> findByUsername(String username);

}
