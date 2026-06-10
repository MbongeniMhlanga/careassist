package com.careassist.dto.medication;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalTime;
import java.util.List;

public record CreateMedicationRequest(
        @NotNull Long personId,
        @NotBlank String name,
        @NotNull @Min(1) Integer dosageAmount,
        @NotBlank String dosageUnit,
        String instructions,
        List<LocalTime> scheduleTimes
) {
}
