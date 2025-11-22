package com.lcorp.notes.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class NoteRequest {
    private String title;
    private String content;

    @JsonProperty("folder_id")
    private Long folderId;

    private boolean folderIdPresent;

    @JsonProperty("folder_id")
    public void setFolderId(Long folderId) {
        this.folderId = folderId;
        this.folderIdPresent = true;
    }
}