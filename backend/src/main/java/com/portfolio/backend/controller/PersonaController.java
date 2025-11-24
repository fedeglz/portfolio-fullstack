package com.portfolio.backend.controller;

import com.portfolio.backend.model.Persona;
import com.portfolio.backend.repository.PersonaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/persona")
public class PersonaController {

    @Autowired
    private PersonaRepository personaRepository;

    // Obtener tus datos (Siempre devolvemos el primero que encontremos)
    @GetMapping
    public Persona obtenerPerfil() {
        return personaRepository.findAll().stream().findFirst().orElse(null);
    }

    // Guardar o Actualizar tus datos
    @PostMapping
    public Persona guardarPerfil(@RequestBody Persona persona) {
        // Si ya existe un perfil (ID 1), lo actualizamos. Si no, creamos uno nuevo.
        Persona perfilExistente = personaRepository.findAll().stream().findFirst().orElse(null);

        if (perfilExistente != null) {
            perfilExistente.setNombre(persona.getNombre());
            perfilExistente.setTitulo(persona.getTitulo());
            perfilExistente.setSobreMi(persona.getSobreMi());
            perfilExistente.setFotoUrl(persona.getFotoUrl());
            return personaRepository.save(perfilExistente);
        } else {
            return personaRepository.save(persona);
        }
    }

}
