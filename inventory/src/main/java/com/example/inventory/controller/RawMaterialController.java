package com.example.inventory.controller;

import com.example.inventory.entity.RawMaterial;
import com.example.inventory.repository.RawMaterialRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/raw-materials")
@CrossOrigin(origins = "*")
public class RawMaterialController {

    private final RawMaterialRepository repository;

    public RawMaterialController(RawMaterialRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<RawMaterial> findAll() {
        return repository.findAll();
    }

    @PostMapping
    public RawMaterial create(@RequestBody RawMaterial rawMaterial) {
        return repository.save(rawMaterial);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RawMaterial> update(@PathVariable Long id,
                                             @RequestBody RawMaterial rawMaterial) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        rawMaterial.setId(id);
        return ResponseEntity.ok(repository.save(rawMaterial));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}