package com.careassist.repository;

import com.careassist.entity.Medication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicationRepository extends JpaRepository<Medication, Long> {

    List<Medication> findByPersonIdOrderByNameAsc(Long personId);
}
