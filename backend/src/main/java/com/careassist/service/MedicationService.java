package com.careassist.service;

import com.careassist.dto.medication.AddMedicationScheduleRequest;
import com.careassist.dto.medication.CreateMedicationRequest;
import com.careassist.dto.medication.MedicationResponse;
import com.careassist.dto.medication.MedicationScheduleResponse;
import com.careassist.entity.Medication;
import com.careassist.entity.MedicationSchedule;
import com.careassist.entity.Person;
import com.careassist.exception.ResourceNotFoundException;
import com.careassist.repository.MedicationRepository;
import com.careassist.repository.MedicationScheduleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;

@Service
@Transactional
public class MedicationService {

    private final MedicationRepository medicationRepository;
    private final MedicationScheduleRepository medicationScheduleRepository;
    private final PersonService personService;

    public MedicationService(
            MedicationRepository medicationRepository,
            MedicationScheduleRepository medicationScheduleRepository,
            PersonService personService
    ) {
        this.medicationRepository = medicationRepository;
        this.medicationScheduleRepository = medicationScheduleRepository;
        this.personService = personService;
    }

    public MedicationResponse create(CreateMedicationRequest request) {
        Person person = personService.findEntityById(request.personId());

        Medication medication = new Medication();
        medication.setPerson(person);
        medication.setName(request.name().trim());
        medication.setDosageAmount(request.dosageAmount());
        medication.setDosageUnit(request.dosageUnit().trim());
        medication.setInstructions(request.instructions() == null ? null : request.instructions().trim());
        medication.setActive(true);

        Medication savedMedication = medicationRepository.save(medication);

        if (request.scheduleTimes() != null) {
            request.scheduleTimes().forEach(time -> createSchedule(savedMedication.getId(), new AddMedicationScheduleRequest(time)));
        }

        return getById(savedMedication.getId());
    }

    public MedicationScheduleResponse createSchedule(Long medicationId, AddMedicationScheduleRequest request) {
        Medication medication = findEntityById(medicationId);

        MedicationSchedule schedule = new MedicationSchedule();
        schedule.setMedication(medication);
        schedule.setScheduledTime(request.scheduledTime());
        schedule.setActive(true);

        return toScheduleResponse(medicationScheduleRepository.save(schedule));
    }

    @Transactional(readOnly = true)
    public MedicationResponse getById(Long medicationId) {
        Medication medication = findEntityById(medicationId);
        List<MedicationScheduleResponse> schedules = medicationScheduleRepository.findByMedicationIdOrderByScheduledTimeAsc(medicationId)
                .stream()
                .map(this::toScheduleResponse)
                .toList();
        return toResponse(medication, schedules);
    }

    @Transactional(readOnly = true)
    public List<MedicationResponse> listByPerson(Long personId) {
        return medicationRepository.findByPersonIdOrderByNameAsc(personId).stream()
                .map(medication -> {
                    List<MedicationScheduleResponse> schedules = medicationScheduleRepository.findByMedicationIdOrderByScheduledTimeAsc(medication.getId())
                            .stream()
                            .map(this::toScheduleResponse)
                            .toList();
                    return toResponse(medication, schedules);
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MedicationScheduleResponse> listSchedules(Long medicationId) {
        findEntityById(medicationId);
        return medicationScheduleRepository.findByMedicationIdOrderByScheduledTimeAsc(medicationId)
                .stream()
                .map(this::toScheduleResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Medication findEntityById(Long id) {
        return medicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medication not found with id " + id));
    }

    private MedicationResponse toResponse(Medication medication, List<MedicationScheduleResponse> schedules) {
        return new MedicationResponse(
                medication.getId(),
                medication.getPerson().getId(),
                medication.getPerson().getName(),
                medication.getName(),
                medication.getDosageAmount(),
                medication.getDosageUnit(),
                medication.getInstructions(),
                medication.isActive(),
                schedules
        );
    }

    private MedicationScheduleResponse toScheduleResponse(MedicationSchedule schedule) {
        return new MedicationScheduleResponse(schedule.getId(), schedule.getScheduledTime(), schedule.isActive());
    }
}
