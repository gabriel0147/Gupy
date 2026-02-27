package com.example.inventory.controller;

import com.example.inventory.dto.ProductProductionDTO;
import com.example.inventory.service.ProductionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/production")
@CrossOrigin(origins = "*")
public class ProductionController {

    private final ProductionService productionService;

    public ProductionController(ProductionService productionService) {
        this.productionService = productionService;
    }

    @GetMapping("/suggestion")
    public List<ProductProductionDTO> getProductionSuggestion() {
        return productionService.calculateProductionSuggestion();
    }
}