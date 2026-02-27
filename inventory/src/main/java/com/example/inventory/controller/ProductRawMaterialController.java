package com.example.inventory.controller;

import com.example.inventory.entity.Product;
import com.example.inventory.entity.ProductRawMaterial;
import com.example.inventory.entity.RawMaterial;
import com.example.inventory.repository.ProductRawMaterialRepository;
import com.example.inventory.repository.ProductRepository;
import com.example.inventory.repository.RawMaterialRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-materials")
@CrossOrigin(origins = "*")
public class ProductRawMaterialController {

    private final ProductRawMaterialRepository prRepository;
    private final ProductRepository productRepository;
    private final RawMaterialRepository rawMaterialRepository;

    public ProductRawMaterialController(ProductRawMaterialRepository prRepository,
                                        ProductRepository productRepository,
                                        RawMaterialRepository rawMaterialRepository) {
        this.prRepository = prRepository;
        this.productRepository = productRepository;
        this.rawMaterialRepository = rawMaterialRepository;
    }

    @GetMapping
    public List<ProductRawMaterial> findAll() {
        return prRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<ProductRawMaterial> create(@RequestParam Long productId,
                                                     @RequestParam Long rawMaterialId,
                                                     @RequestParam Integer quantityRequired) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        RawMaterial rawMaterial = rawMaterialRepository.findById(rawMaterialId)
                .orElseThrow(() -> new RuntimeException("Raw material not found"));

        ProductRawMaterial pr = ProductRawMaterial.builder()
                .product(product)
                .rawMaterial(rawMaterial)
                .quantityRequired(quantityRequired)
                .build();

        return ResponseEntity.ok(prRepository.save(pr));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!prRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        prRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}