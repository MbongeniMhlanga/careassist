package com.careassist.dto.reminder;

import com.careassist.entity.enums.ReminderStatus;

import java.time.LocalDateTime;

public record ReminderResponse(
        Long id,
        Long medicationId,
        String medicationName,
        Long personId,
        String personName,
        Integer dosageAmount,
        String dosageUnit,
        String instructions,
        Long scheduleId,
        LocalDateTime dueAt,
        ReminderStatus status,
        LocalDateTime sentAt,
        LocalDateTime takenAt,
        String note
) {
}
