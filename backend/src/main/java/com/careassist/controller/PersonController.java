package com.careassist.controller;

import com.careassist.dto.person.CreatePersonRequest;
import com.careassist.dto.person.PersonResponse;
import com.careassist.service.PersonService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/persons")
public class PersonController {

    private final PersonService personService;

    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @PostMapping
    public ResponseEntity<PersonResponse> create(@Valid @RequestBody CreatePersonRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(personService.create(request));
    }

    @GetMapping("/{personId}")
    public PersonResponse getById(@PathVariable Long personId) {
        return personService.getById(personId);
    }

    @GetMapping
    public List<PersonResponse> list(@RequestParam(required = false) Long userId) {
        if (userId == null) {
            return personService.listAll();
        }
        return personService.listByUserId(userId);
    }
}
