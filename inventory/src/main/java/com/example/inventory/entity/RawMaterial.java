package com.example.inventory.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "raw_material")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RawMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Integer quantityInStock;
}