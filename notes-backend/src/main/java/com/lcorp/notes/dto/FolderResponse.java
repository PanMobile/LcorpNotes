package com.lcorp.notes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class FolderResponse {
    private Long id;
    private String name;
    private LocalDateTime createdAt;
}