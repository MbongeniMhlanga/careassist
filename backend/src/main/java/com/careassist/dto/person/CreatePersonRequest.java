package com.careassist.dto.person;

import com.careassist.entity.enums.RelationshipType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreatePersonRequest(
        @NotBlank String name,
        @NotNull RelationshipType relationshipType,
        @NotNull Long userId
) {
}
