package com.example.inventory.service;

import com.example.inventory.dto.ProductProductionDTO;
import com.example.inventory.entity.Product;
import com.example.inventory.entity.ProductRawMaterial;
import com.example.inventory.entity.RawMaterial;
import com.example.inventory.repository.ProductRawMaterialRepository;
import com.example.inventory.repository.ProductRepository;
import com.example.inventory.repository.RawMaterialRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductionService {

    private final ProductRepository productRepository;
    private final ProductRawMaterialRepository prRepository;
    private final RawMaterialRepository rawMaterialRepository;

    public ProductionService(ProductRepository productRepository,
                             ProductRawMaterialRepository prRepository,
                             RawMaterialRepository rawMaterialRepository) {
        this.productRepository = productRepository;
        this.prRepository = prRepository;
        this.rawMaterialRepository = rawMaterialRepository;
    }

    public List<ProductProductionDTO> calculateProductionSuggestion() {

        // 1) snapshot do estoque atual de todas as matérias-primas
        Map<Long, Integer> remainingStock = rawMaterialRepository.findAll()
                .stream()
                .collect(Collectors.toMap(
                        RawMaterial::getId,
                        RawMaterial::getQuantityInStock
                ));

        // 2) carregar todos os produtos
        List<Product> products = productRepository.findAll();

        // 3) ordenar produtos por preço unitário (maior -> menor)
        products.sort(Comparator.comparing(Product::getPrice).reversed());

        List<ProductProductionDTO> result = new ArrayList<>();

        // 4) para cada produto, nessa ordem, ver quanto dá pra produzir
        for (Product product : products) {

            List<ProductRawMaterial> components = prRepository.findByProduct(product);

            // se não tem composição definida, ignora
            if (components.isEmpty()) {
                continue;
            }

            Integer maxUnits = null;

            // 4a) calcula quantas unidades dá pra produzir com o ESTOQUE ATUAL
            for (ProductRawMaterial comp : components) {
                Long rmId = comp.getRawMaterial().getId();
                int stock = remainingStock.getOrDefault(rmId, 0);
                int required = comp.getQuantityRequired();

                if (required <= 0) {
                    continue;
                }

                int possible = stock / required; // divisão inteira

                if (maxUnits == null || possible < maxUnits) {
                    maxUnits = possible;
                }
            }

            // se não dá pra produzir nada desse produto com o estoque restante, pula
            if (maxUnits == null || maxUnits <= 0) {
                continue;
            }

            // 4b) "consome" o estoque em memória, simulando produção real
            for (ProductRawMaterial comp : components) {
                Long rmId = comp.getRawMaterial().getId();
                int required = comp.getQuantityRequired();
                int totalUsed = required * maxUnits;

                int currentStock = remainingStock.getOrDefault(rmId, 0);
                remainingStock.put(rmId, Math.max(0, currentStock - totalUsed));
            }

            // 4c) monta o DTO com a sugestão para esse produto
            BigDecimal totalValue = product.getPrice()
                    .multiply(BigDecimal.valueOf(maxUnits));

            ProductProductionDTO dto = ProductProductionDTO.builder()
                    .productId(product.getId())
                    .productName(product.getName())
                    .unitPrice(product.getPrice())
                    .maxQuantityToProduce(maxUnits)
                    .totalValue(totalValue)
                    .build();

            result.add(dto);
        }

        // já está ordenado do mais caro pro mais barato pela ordem de processamento
        return result;
    }
}