package com.cineledger.dto;

import jakarta.validation.constraints.NotBlank;

public class DisputeCommentRequest {

    @NotBlank(message = "Comment text is required")
    private String commentText;

    public DisputeCommentRequest() {}

    public DisputeCommentRequest(String commentText) {
        this.commentText = commentText;
    }

    public String getCommentText() { return commentText; }
    public void setCommentText(String commentText) { this.commentText = commentText; }
}
