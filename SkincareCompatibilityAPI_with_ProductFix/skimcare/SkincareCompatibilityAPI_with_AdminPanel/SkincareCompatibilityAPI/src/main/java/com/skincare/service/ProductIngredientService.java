package com.skincare.service;

import com.skincare.api.model.ProductIngredient;
import com.skincare.repository.ProductIngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductIngredientService {

    @Autowired
    private ProductIngredientRepository repo;

    public List<ProductIngredient> getAll() {
        return repo.findAll();
    }

    public ProductIngredient add(ProductIngredient pi) {
        return repo.save(pi);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}