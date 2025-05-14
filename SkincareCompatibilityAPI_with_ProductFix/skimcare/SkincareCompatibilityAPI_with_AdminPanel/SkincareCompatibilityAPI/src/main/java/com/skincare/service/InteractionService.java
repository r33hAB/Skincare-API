package com.skincare.service;

import com.skincare.api.dto.FollowUpCheckResponse;
import com.skincare.api.model.Interaction;
import com.skincare.repository.InteractionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class InteractionService {

    @Autowired
    private InteractionRepository interactionRepository;

    public List<Interaction> checkInteractions(List<String> ingredients) {
        // Gjør ingrediensene lowercase for sammenligning
        List<String> lowercased = ingredients.stream()
                .map(String::toLowerCase)
                .collect(Collectors.toList());

        List<Interaction> results = new ArrayList<>();

        for (int i = 0; i < lowercased.size(); i++) {
            for (int j = i + 1; j < lowercased.size(); j++) {
                String ing1 = lowercased.get(i);
                String ing2 = lowercased.get(j);

                Optional<Interaction> match = interactionRepository
                        .findByIngredientPair(ing1, ing2);

                match.ifPresent(results::add);
            }
        }

        return results;
    }

    public List<FollowUpCheckResponse> getFollowUpChecks(List<String> productIngredients) {
        // Gjør input lowercase
        List<String> lowercased = productIngredients.stream()
                .map(String::toLowerCase)
                .toList();

        List<Interaction> interactions = interactionRepository.findByIngredient1In(lowercased);
        List<FollowUpCheckResponse> responses = new ArrayList<>();

        for (Interaction i : interactions) {
            responses.add(new FollowUpCheckResponse(
                i.getIngredient1(),
                i.getIngredient2(),
                i.getWarningMessage(),
                i.getSuggestion()
            ));
        }

        return responses;
    }
}
