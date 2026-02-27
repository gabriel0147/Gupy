package com.example.inventory.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductProductionDTO {

    private Long productId;
    private String productName;
    private BigDecimal unitPrice;
    private Integer maxQuantityToProduce;
    private BigDecimal totalValue;
}