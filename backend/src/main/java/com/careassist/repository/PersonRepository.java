package com.careassist.repository;

import com.careassist.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PersonRepository extends JpaRepository<Person, Long> {

    List<Person> findByUserIdOrderByNameAsc(Long userId);
}
