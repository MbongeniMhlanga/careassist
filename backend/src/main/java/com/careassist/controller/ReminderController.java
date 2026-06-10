package com.careassist.controller;

import com.careassist.dto.reminder.MarkReminderTakenRequest;
import com.careassist.dto.reminder.ReminderResponse;
import com.careassist.service.ReminderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {

    private final ReminderService reminderService;

    public ReminderController(ReminderService reminderService) {
        this.reminderService = reminderService;
    }

    @GetMapping("/today")
    public List<ReminderResponse> today() {
        return reminderService.getTodayReminders();
    }

    @PostMapping("/{reminderId}/taken")
    public ReminderResponse markTaken(
            @PathVariable Long reminderId,
            @Valid @RequestBody(required = false) MarkReminderTakenRequest request
    ) {
        MarkReminderTakenRequest safeRequest = request == null ? new MarkReminderTakenRequest(null) : request;
        return reminderService.markTaken(reminderId, safeRequest);
    }
}
