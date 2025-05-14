package com.skincare.repository;

import com.skincare.api.model.Interaction;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface InteractionRepository extends CrudRepository<Interaction, Long> {

    @Query("SELECT i FROM Interaction i WHERE " +
           "(LOWER(i.ingredient1) = LOWER(?1) AND LOWER(i.ingredient2) = LOWER(?2)) OR " +
           "(LOWER(i.ingredient1) = LOWER(?2) AND LOWER(i.ingredient2) = LOWER(?1))")
    Optional<Interaction> findByIngredientPair(String ingredient1, String ingredient2);

    @Query("SELECT i FROM Interaction i WHERE LOWER(i.ingredient1) IN :ingredients")
    List<Interaction> findByIngredient1In(@Param("ingredients") List<String> ingredients);
}
