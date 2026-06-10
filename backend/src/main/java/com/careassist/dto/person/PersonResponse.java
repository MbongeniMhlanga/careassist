package com.careassist.dto.person;

import com.careassist.entity.enums.RelationshipType;

public record PersonResponse(
        Long id,
        String name,
        RelationshipType relationshipType,
        Long userId,
        String userName,
        String userEmail
) {
}
