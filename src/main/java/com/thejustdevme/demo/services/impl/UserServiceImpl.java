package com.thejustdevme.demo.services.impl;

import com.thejustdevme.demo.domain.dto.ChangePasswordRequest;
import com.thejustdevme.demo.domain.entities.User;
import com.thejustdevme.demo.repositories.UserRepository;
import com.thejustdevme.demo.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void changePassword(ChangePasswordRequest request, Principal connectedUser) {
        User user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        //check if the current password is correct
        if(!passwordEncoder.matches(request.getCurrentPassword(),  user.getPassword())) {
            throw new IllegalStateException("Incorrect password");
        }
        // check if the two new passwords are the same
        if(!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalStateException("Incorrect confirm password");
        }
        //update the password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        //save the new password
        userRepository.save(user);
    }
}
