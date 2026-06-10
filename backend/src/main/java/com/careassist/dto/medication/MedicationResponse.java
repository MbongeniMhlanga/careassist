package com.careassist.dto.medication;

import java.util.List;

public record MedicationResponse(
        Long id,
        Long personId,
        String personName,
        String name,
        Integer dosageAmount,
        String dosageUnit,
        String instructions,
        boolean active,
        List<MedicationScheduleResponse> schedules
) {
}
