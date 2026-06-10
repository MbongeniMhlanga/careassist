package com.careassist.controller;

import com.careassist.dto.medication.AddMedicationScheduleRequest;
import com.careassist.dto.medication.CreateMedicationRequest;
import com.careassist.dto.medication.MedicationResponse;
import com.careassist.dto.medication.MedicationScheduleResponse;
import com.careassist.service.MedicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/medications")
public class MedicationController {

    private final MedicationService medicationService;

    public MedicationController(MedicationService medicationService) {
        this.medicationService = medicationService;
    }

    @PostMapping
    public ResponseEntity<MedicationResponse> create(@Valid @RequestBody CreateMedicationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(medicationService.create(request));
    }

    @GetMapping("/{medicationId}")
    public MedicationResponse getById(@PathVariable Long medicationId) {
        return medicationService.getById(medicationId);
    }

    @GetMapping("/{medicationId}/schedules")
    public List<MedicationScheduleResponse> listSchedules(@PathVariable Long medicationId) {
        return medicationService.listSchedules(medicationId);
    }

    @PostMapping("/{medicationId}/schedules")
    public ResponseEntity<MedicationScheduleResponse> addSchedule(
            @PathVariable Long medicationId,
            @Valid @RequestBody AddMedicationScheduleRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(medicationService.createSchedule(medicationId, request));
    }

    @PutMapping("/{medicationId}/schedules/{scheduleId}")
    public MedicationScheduleResponse updateSchedule(
            @PathVariable Long medicationId,
            @PathVariable Long scheduleId,
            @Valid @RequestBody AddMedicationScheduleRequest request
    ) {
        return medicationService.updateSchedule(medicationId, scheduleId, request);
    }

    @GetMapping("/person/{personId}")
    public List<MedicationResponse> listByPerson(@PathVariable Long personId) {
        return medicationService.listByPerson(personId);
    }
}
