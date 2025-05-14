package com.skincare.api.controller;

import com.skincare.api.model.Interaction;
import com.skincare.service.InteractionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.skincare.api.dto.FollowUpCheckResponse;


import java.util.List;

@RestController
@RequestMapping("/api")
public class InteractionController {

    @Autowired
    private InteractionService interactionService;

    @PostMapping("/check-interactions")
    public List<Interaction> checkInteractions(@RequestBody List<String> ingredients) {
        return interactionService.checkInteractions(ingredients);
    }

    @PostMapping("/follow-up-check")
public List<FollowUpCheckResponse> getFollowUpQuestions(@RequestBody List<String> productIngredients) {
    return interactionService.getFollowUpChecks(productIngredients);
}

}
