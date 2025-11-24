package com.portfolio.backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth") // Esta es la base de la dirección
public class AuthController {

    // Este es el método que React está buscando (/login)
    @PostMapping("/login")
    public String login() {
        // Si la petición llega hasta aquí, significa que Spring Security
        // ya verificó la contraseña y dijo "OK".
        // Solo devolvemos un mensaje de éxito.
        return "Login exitoso";
    }
}