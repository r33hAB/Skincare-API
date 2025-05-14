package com.skincare.api.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String brand;
    private Integer ewgScore;
    private String concerns;
    private String ewgUrl;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductIngredient> ingredients;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public Integer getEwgScore() { return ewgScore; }
    public void setEwgScore(Integer ewgScore) { this.ewgScore = ewgScore; }

    public String getConcerns() { return concerns; }
    public void setConcerns(String concerns) { this.concerns = concerns; }

    public String getEwgUrl() { return ewgUrl; }
    public void setEwgUrl(String ewgUrl) { this.ewgUrl = ewgUrl; }

    public List<ProductIngredient> getIngredients() { return ingredients; }
    public void setIngredients(List<ProductIngredient> ingredients) { this.ingredients = ingredients; }
}