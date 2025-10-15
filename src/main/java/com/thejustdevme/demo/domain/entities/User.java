package com.thejustdevme.demo.domain.entities;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
@Slf4j
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String firstname;
    private String lastname;
    @Column(unique = true)
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    @JsonIgnore
    @ToString.Exclude
    private List<Token> tokens;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + role.name()));
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

// {
//    "access_token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtaW5oQGV4YW1wbGUuY29tIiwiaWF0IjoxNzYwNTQ2MTExLCJleHAiOjE3NjA2MzI1MTF9.aRg918orI1lG0XIbNRW1A_al6HpPUGLiCnEIYcD_Coc",
//    "refresh_token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtaW5oQGV4YW1wbGUuY29tIiwiaWF0IjoxNzYwNTQ2MTExLCJleHAiOjE3NjExNTA5MTF9.4e4u2iR4B32ZFHPDbCqurqwslIJ0sh8LUSH38RyZVqc"
//}
//{// user minh nguyen
//    "access_token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtaW5oQGV4YW1wbGUuY29tIiwiaWF0IjoxNzYwNTQ2MjA5LCJleHAiOjE3NjA2MzI2MDl9.MvvYZVOkzXa0GUe-2aYAARv9wwux6xsfnsN-pFPNLZ8",
//    "refresh_token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtaW5oQGV4YW1wbGUuY29tIiwiaWF0IjoxNzYwNTQ2MjA5LCJleHAiOjE3NjExNTEwMDl9.TwILZJpXY6PqQuqzo0AxqVq3tWuc8GRNpkb7nL60y0U"
//}