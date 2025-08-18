package com.clubhub.entity.dto;

public class ActionResponseDTO {
    public boolean success;
    public String message;

    public ActionResponseDTO() {}

    public ActionResponseDTO(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}
