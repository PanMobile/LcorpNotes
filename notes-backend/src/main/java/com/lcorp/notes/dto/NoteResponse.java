package com.lcorp.notes.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class NoteResponse {
    private Long id;
    private String title;
    private String content;

    @JsonProperty("isFavorite")
    private Boolean isFavorite;

    @JsonProperty("folderId")
    private Long folderId;

    @JsonProperty("updatedAt")
    private LocalDateTime updatedAt;
}