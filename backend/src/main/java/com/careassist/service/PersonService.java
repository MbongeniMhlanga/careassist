package com.careassist.service;

import com.careassist.dto.person.CreatePersonRequest;
import com.careassist.dto.person.PersonResponse;
import com.careassist.entity.AppUser;
import com.careassist.entity.Person;
import com.careassist.exception.ResourceNotFoundException;
import com.careassist.repository.PersonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PersonService {

    private final PersonRepository personRepository;
    private final UserService userService;

    public PersonService(PersonRepository personRepository, UserService userService) {
        this.personRepository = personRepository;
        this.userService = userService;
    }

    public PersonResponse create(CreatePersonRequest request) {
        AppUser user = userService.findEntityById(request.userId());

        Person person = new Person();
        person.setName(request.name().trim());
        person.setRelationshipType(request.relationshipType());
        person.setUser(user);

        return toResponse(personRepository.save(person));
    }

    @Transactional(readOnly = true)
    public PersonResponse getById(Long id) {
        return toResponse(findEntityById(id));
    }

    @Transactional(readOnly = true)
    public List<PersonResponse> listByUserId(Long userId) {
        return personRepository.findByUserIdOrderByNameAsc(userId).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<PersonResponse> listAll() {
        return personRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public Person findEntityById(Long id) {
        return personRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Person not found with id " + id));
    }

    private PersonResponse toResponse(Person person) {
        return new PersonResponse(
                person.getId(),
                person.getName(),
                person.getRelationshipType(),
                person.getUser().getId(),
                person.getUser().getName(),
                person.getUser().getEmail()
        );
    }
}
