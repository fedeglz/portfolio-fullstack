package com.portfolio.backend.controller;

import com.portfolio.backend.model.Certificado;
import com.portfolio.backend.repository.CertificadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificados")
public class CertificadoController {

    @Autowired
    private CertificadoRepository certificadoRepository;

    @GetMapping
    public List<Certificado> findAll() {
        return certificadoRepository.findAll();
    }

    @PostMapping
    public Certificado crear(@RequestBody Certificado certificado) {
        return certificadoRepository.save(certificado);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        certificadoRepository.deleteById(id);
    }

}
