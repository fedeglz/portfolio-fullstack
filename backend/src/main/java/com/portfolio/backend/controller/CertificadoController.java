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

    @PutMapping("/{id}")
    public Certificado editar(@PathVariable Long id, @RequestBody Certificado certDetails) {
        Certificado cert = certificadoRepository.findById(id).orElse(null);

        if (cert != null) {
            cert.setTitulo(certDetails.getTitulo());
            cert.setInstitucion(certDetails.getInstitucion());
            cert.setDescripcion(certDetails.getDescripcion());
            cert.setImagenUrl(certDetails.getImagenUrl());
            return certificadoRepository.save(cert);
        }
        return null;
    }

}
