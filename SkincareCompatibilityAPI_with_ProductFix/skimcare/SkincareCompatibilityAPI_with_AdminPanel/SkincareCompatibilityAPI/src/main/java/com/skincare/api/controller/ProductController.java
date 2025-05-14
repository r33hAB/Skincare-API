package com.skincare.api.controller;

import com.skincare.api.model.Product;
import com.skincare.api.model.ProductIngredient;
import com.skincare.repository.ProductRepository;
import com.skincare.repository.ProductIngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductIngredientRepository ingredientRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        Product savedProduct = productRepository.save(product);
        if (product.getIngredients() != null) {
            for (ProductIngredient ingredient : product.getIngredients()) {
                ingredient.setProduct(savedProduct);
                ingredientRepository.save(ingredient);
            }
        }
        return savedProduct;
    }
}