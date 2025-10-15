package com.thejustdevme.demo.domain.dto;

public record ErrorResponse(
        int status,
        String message,
        String details
) {
}
