package com.careassist.repository;

import com.careassist.entity.MedicationSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalTime;
import java.util.List;

public interface MedicationScheduleRepository extends JpaRepository<MedicationSchedule, Long> {

    List<MedicationSchedule> findByActiveTrueAndScheduledTimeOrderByScheduledTimeAsc(LocalTime scheduledTime);

    List<MedicationSchedule> findByMedicationIdOrderByScheduledTimeAsc(Long medicationId);

    List<MedicationSchedule> findByActiveTrueOrderByScheduledTimeAsc();
}
