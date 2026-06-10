package com.careassist.repository;

import com.careassist.entity.ReminderLog;
import com.careassist.entity.enums.ReminderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReminderLogRepository extends JpaRepository<ReminderLog, Long> {

    List<ReminderLog> findByDueAtBetweenOrderByDueAtAsc(LocalDateTime start, LocalDateTime end);

    Optional<ReminderLog> findByMedicationScheduleIdAndDueAt(Long medicationScheduleId, LocalDateTime dueAt);

    boolean existsByMedicationScheduleIdAndDueAt(Long medicationScheduleId, LocalDateTime dueAt);

    List<ReminderLog> findByStatusAndDueAtBetweenOrderByDueAtAsc(ReminderStatus status, LocalDateTime start, LocalDateTime end);
}
