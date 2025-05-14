package com.skincare.api.controller;

import com.skincare.api.model.KnownIngredient;
import com.skincare.repository.KnownIngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/known-ingredients")
@CrossOrigin(origins = "*")
public class KnownIngredientController {

    @Autowired
    private KnownIngredientRepository repository;

    @GetMapping
    public List<KnownIngredient> getAll() {
        return repository.findAll();
    }
}