package com.portfolio.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data // Lombok: Genera getters, setters, toString, etc.
@Entity // JPA: Indica que esta clase es una tabla en la BD
@Table(name = "projects") // Nombre exacto de la tabla en MySQL
public class Project {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incrementable
        private Long id;

        @Column(nullable = false)
        private String name;

        @Column(length = 2000) // Aumentamos el largo para descripciones detalladas
        private String description;

        private String imageUrl; // Link a la imagen de portada
        private String repoUrl;  // Link a GitHub
        private String demoUrl;  // Link al proyecto en vivo
}

