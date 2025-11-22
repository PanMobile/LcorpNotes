package com.lcorp.notes.controller;

import com.lcorp.notes.dto.FolderRequest;
import com.lcorp.notes.dto.FolderResponse;
import com.lcorp.notes.model.Folder;
import com.lcorp.notes.model.User;
import com.lcorp.notes.repository.FolderRepository;
import com.lcorp.notes.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/folders")
public class FolderController {

    private final FolderRepository folderRepository;
    private final UserRepository userRepository;

    public FolderController(FolderRepository folderRepository, UserRepository userRepository) {
        this.folderRepository = folderRepository;
        this.userRepository = userRepository;
    }

    private Long getCurrentUserId(Authentication auth) {
        return (Long) auth.getPrincipal();
    }

    @GetMapping
    public ResponseEntity<List<FolderResponse>> listFolders(Authentication auth) {
        Long userId = getCurrentUserId(auth);
        List<Folder> folders = folderRepository.findByOwnerIdOrderByCreatedAtDesc(userId);

        List<FolderResponse> response = folders.stream()
                .map(f -> new FolderResponse(f.getId(), f.getName(), f.getCreatedAt()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createFolder(@RequestBody FolderRequest request, Authentication auth) {
        Long userId = getCurrentUserId(auth);
        String name = request.getName() != null ? request.getName().trim() : "";

        if (name.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Name is required"));
        }

        User user = userRepository.findById(userId).orElseThrow();

        Folder folder = new Folder();
        folder.setName(name);
        folder.setOwner(user);

        folder = folderRepository.save(folder);

        FolderResponse response = new FolderResponse(folder.getId(), folder.getName(), folder.getCreatedAt());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{folderId}")
    public ResponseEntity<?> renameFolder(@PathVariable Long folderId,
                                          @RequestBody FolderRequest request,
                                          Authentication auth) {
        Long userId = getCurrentUserId(auth);
        String name = request.getName() != null ? request.getName().trim() : "";

        if (name.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Name is required"));
        }

        Folder folder = folderRepository.findByIdAndOwnerId(folderId, userId).orElse(null);

        if (folder == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Not found"));
        }

        folder.setName(name);
        folderRepository.save(folder);

        return ResponseEntity.ok(Map.of("message", "Updated"));
    }

    @DeleteMapping("/{folderId}")
    public ResponseEntity<?> deleteFolder(@PathVariable Long folderId, Authentication auth) {
        Long userId = getCurrentUserId(auth);

        Folder folder = folderRepository.findByIdAndOwnerId(folderId, userId).orElse(null);

        if (folder == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Not found"));
        }

        folderRepository.delete(folder);

        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }
}