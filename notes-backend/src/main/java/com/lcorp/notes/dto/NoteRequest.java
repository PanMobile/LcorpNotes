package com.lcorp.notes.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class NoteRequest {
    private String title;
    private String content;

    @JsonProperty("folderId")
    private Long folderId;

    private boolean folderIdPresent;

    @JsonProperty("folderId")
    public void setFolderId(Long folderId) {
        this.folderId = folderId;
        this.folderIdPresent = true;
    }
}