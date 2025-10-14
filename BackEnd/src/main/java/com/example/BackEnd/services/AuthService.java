package com.example.BackEnd.services;

import com.example.BackEnd.model.Users;
import com.example.BackEnd.repository.AuthRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AuthService {
    @Autowired
    private AuthRepo user;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public void SaveUser(Users newUser){
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        user.save(newUser);
    }

    public boolean CheckEmail(String email){
        return user.findByEmail(email) != null;
    }

    public Users login(String email, String password) {
        Users found = user.findByEmail(email);
        if (found != null && passwordEncoder.matches(password, found.getPassword())) {
            return found;
        }
        return null;
    }

}
