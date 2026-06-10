package com.careassist.service;

import com.careassist.dto.reminder.MarkReminderTakenRequest;
import com.careassist.dto.reminder.ReminderResponse;
import com.careassist.entity.MedicationSchedule;
import com.careassist.entity.ReminderLog;
import com.careassist.entity.enums.ReminderStatus;
import com.careassist.exception.ResourceNotFoundException;
import com.careassist.repository.MedicationScheduleRepository;
import com.careassist.repository.ReminderLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@Transactional
public class ReminderService {

    private final MedicationScheduleRepository medicationScheduleRepository;
    private final ReminderLogRepository reminderLogRepository;

    public ReminderService(
            MedicationScheduleRepository medicationScheduleRepository,
            ReminderLogRepository reminderLogRepository
    ) {
        this.medicationScheduleRepository = medicationScheduleRepository;
        this.reminderLogRepository = reminderLogRepository;
    }

    @Transactional(readOnly = true)
    public List<ReminderResponse> getTodayReminders() {
        LocalDate today = LocalDate.now();
        LocalDateTime now = LocalDateTime.now();

        return medicationScheduleRepository.findByActiveTrueOrderByScheduledTimeAsc().stream()
                .map(schedule -> toReminderResponse(schedule, today, now))
                .toList();
    }

    public ReminderResponse markTaken(Long reminderId, MarkReminderTakenRequest request) {
        ReminderLog reminderLog = reminderLogRepository.findById(reminderId)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found with id " + reminderId));

        reminderLog.setStatus(ReminderStatus.TAKEN);
        reminderLog.setTakenAt(LocalDateTime.now());
        reminderLog.setNote(request.note() == null ? reminderLog.getNote() : request.note().trim());

        return toReminderResponse(reminderLogRepository.save(reminderLog));
    }

    public void generateDueReminderLogs() {
        LocalTime now = LocalTime.now().withSecond(0).withNano(0);
        LocalDateTime dueAt = LocalDateTime.of(LocalDate.now(), now);

        List<MedicationSchedule> schedules = medicationScheduleRepository.findByActiveTrueAndScheduledTimeOrderByScheduledTimeAsc(now);
        for (MedicationSchedule schedule : schedules) {
            if (reminderLogRepository.existsByMedicationScheduleIdAndDueAt(schedule.getId(), dueAt)) {
                continue;
            }

            ReminderLog reminderLog = new ReminderLog();
            reminderLog.setMedicationSchedule(schedule);
            reminderLog.setDueAt(dueAt);
            reminderLog.setStatus(ReminderStatus.SENT);
            reminderLog.setSentAt(LocalDateTime.now());
            reminderLog.setNote("Automatically generated reminder");
            reminderLogRepository.save(reminderLog);

            System.out.println("Reminder: Take " + schedule.getMedication().getName()
                    + " for " + schedule.getMedication().getPerson().getName()
                    + " at " + schedule.getScheduledTime());
        }
    }

    private ReminderResponse toReminderResponse(MedicationSchedule schedule, LocalDate today, LocalDateTime now) {
        LocalDateTime dueAt = LocalDateTime.of(today, schedule.getScheduledTime());
        ReminderLog reminderLog = reminderLogRepository.findByMedicationScheduleIdAndDueAt(schedule.getId(), dueAt).orElse(null);

        ReminderStatus status;
        LocalDateTime sentAt = null;
        LocalDateTime takenAt = null;
        String note = null;

        if (reminderLog != null) {
            status = reminderLog.getStatus();
            sentAt = reminderLog.getSentAt();
            takenAt = reminderLog.getTakenAt();
            note = reminderLog.getNote();
        } else {
            status = dueAt.isBefore(now) ? ReminderStatus.MISSED : ReminderStatus.PENDING;
        }

        return new ReminderResponse(
                reminderLog != null ? reminderLog.getId() : null,
                schedule.getMedication().getId(),
                schedule.getMedication().getName(),
                schedule.getMedication().getPerson().getId(),
                schedule.getMedication().getPerson().getName(),
                schedule.getMedication().getDosageAmount(),
                schedule.getMedication().getDosageUnit(),
                schedule.getMedication().getInstructions(),
                schedule.getId(),
                dueAt,
                status,
                sentAt,
                takenAt,
                note
        );
    }

    private ReminderResponse toReminderResponse(ReminderLog reminderLog) {
        MedicationSchedule schedule = reminderLog.getMedicationSchedule();
        return new ReminderResponse(
                reminderLog.getId(),
                schedule.getMedication().getId(),
                schedule.getMedication().getName(),
                schedule.getMedication().getPerson().getId(),
                schedule.getMedication().getPerson().getName(),
                schedule.getMedication().getDosageAmount(),
                schedule.getMedication().getDosageUnit(),
                schedule.getMedication().getInstructions(),
                schedule.getId(),
                reminderLog.getDueAt(),
                reminderLog.getStatus(),
                reminderLog.getSentAt(),
                reminderLog.getTakenAt(),
                reminderLog.getNote()
        );
    }
}
