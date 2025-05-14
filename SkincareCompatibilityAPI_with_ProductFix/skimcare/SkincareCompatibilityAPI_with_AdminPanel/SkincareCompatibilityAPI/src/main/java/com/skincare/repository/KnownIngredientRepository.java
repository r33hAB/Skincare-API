package com.skincare.repository;

import com.skincare.api.model.KnownIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KnownIngredientRepository extends JpaRepository<KnownIngredient, Long> {
}