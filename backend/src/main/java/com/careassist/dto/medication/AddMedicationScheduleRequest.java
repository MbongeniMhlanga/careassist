package com.careassist.dto.medication;

import jakarta.validation.constraints.NotNull;

import java.time.LocalTime;

public record AddMedicationScheduleRequest(
        @NotNull LocalTime scheduledTime
) {
}
