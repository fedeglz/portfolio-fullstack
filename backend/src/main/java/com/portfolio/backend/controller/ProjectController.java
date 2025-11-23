package com.portfolio.backend.controller;

import com.portfolio.backend.model.Project;
import com.portfolio.backend.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects") // Define la URL base...
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    //Pedimos la lista de los proyectos
    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    //Guarda un nuevo proyecto
    @PostMapping
    public Project create(@RequestBody Project project) {
        return projectService.saveProject(project);
    }

    //Borra un proyecto
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { projectService.deleteProject(id);}



}
