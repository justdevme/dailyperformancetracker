package com.thejustdevme.demo.services;

import com.thejustdevme.demo.domain.dto.ChangePasswordRequest;

import java.security.Principal;

public interface UserService {
    void changePassword(ChangePasswordRequest request, Principal connectedUser) ;
}
