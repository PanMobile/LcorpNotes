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

    @JsonProperty("is_favorite")
    private Boolean isFavorite;

    @JsonProperty("folder_id")
    private Long folderId;

    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;
}