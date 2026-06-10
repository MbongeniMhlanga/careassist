package com.careassist.dto.medication;

import java.time.LocalTime;

public record MedicationScheduleResponse(
        Long id,
        LocalTime scheduledTime,
        boolean active
) {
}
