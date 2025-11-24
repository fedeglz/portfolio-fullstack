package com.portfolio.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "persona")
public class Persona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String titulo;

    @Column(length = 1000)
    private String sobreMi;

    private String fotoUrl;
    private String bannerUrl;
}
