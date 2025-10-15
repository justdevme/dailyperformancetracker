package com.thejustdevme.demo.domain.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ChangePasswordRequest {
    String currentPassword;
   String newPassword;
   String confirmPassword;
}
