package com.skincare.api.controller;

import com.skincare.api.model.ProductIngredient;
import com.skincare.service.ProductIngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = "*")
public class ProductIngredientController {

    @Autowired
    private ProductIngredientService service;

    @GetMapping
    public List<ProductIngredient> getAll() {
        return service.getAll();
    }

    @PostMapping
    public ProductIngredient add(@RequestBody ProductIngredient pi) {
        return service.add(pi);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}