package com.portfolio.backend.service;

import com.portfolio.backend.model.Project;
import com.portfolio.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public void deleteProject(Long id) {projectRepository.deleteById(id);}

    public Project editProject(Long id, Project projectDetails) {
        Project project = projectRepository.findById(id).orElse(null);

        if (project != null) {
            project.setName(projectDetails.getName());
            project.setDescription(projectDetails.getDescription());
            project.setImageUrl(projectDetails.getImageUrl());
            project.setRepoUrl(projectDetails.getRepoUrl());
            project.setDemoUrl(projectDetails.getDemoUrl());
            return projectRepository.save(project);
        }
        return null;
    }


}
