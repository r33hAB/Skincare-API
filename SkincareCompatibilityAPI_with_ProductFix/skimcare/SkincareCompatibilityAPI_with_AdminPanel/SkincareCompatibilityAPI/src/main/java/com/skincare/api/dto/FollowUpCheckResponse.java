package com.skincare.api.dto;

public class FollowUpCheckResponse {
    private String productIngredient; // e.g., "Retinol"
    private String potentialConflict; // e.g., "Vitamin C"
    private String warning;
    private String suggestion;

    public FollowUpCheckResponse(String productIngredient, String potentialConflict, String warning, String suggestion) {
        this.productIngredient = productIngredient;
        this.potentialConflict = potentialConflict;
        this.warning = warning;
        this.suggestion = suggestion;
    }

    public String getProductIngredient() {
        return productIngredient;
    }

    public String getPotentialConflict() {
        return potentialConflict;
    }

    public String getWarning() {
        return warning;
    }

    public String getSuggestion() {
        return suggestion;
    }
}
