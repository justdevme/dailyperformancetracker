package com.thejustdevme.demo;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thejustdevme.demo.domain.dto.AuthenticationRequest;
import com.thejustdevme.demo.domain.dto.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthenticationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void registerUser_ShouldReturnOk() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setFirstname("Minh");
        req.setLastname("Nguyen");
        req.setEmail("minh@test.com");
        req.setPassword("123456");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }

    @Test
    void authenticate_ShouldReturnOk() throws Exception {
        AuthenticationRequest req = new AuthenticationRequest();
        req.setEmail("minh@test.com");
        req.setPassword("123456");

        mockMvc.perform(post("/api/v1/auth/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }
}