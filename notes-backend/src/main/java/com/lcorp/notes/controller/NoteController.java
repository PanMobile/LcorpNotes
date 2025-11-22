package com.lcorp.notes.controller;

import com.lcorp.notes.dto.NoteRequest;
import com.lcorp.notes.dto.NoteResponse;
import com.lcorp.notes.model.Folder;
import com.lcorp.notes.model.Note;
import com.lcorp.notes.model.User;
import com.lcorp.notes.repository.FolderRepository;
import com.lcorp.notes.repository.NoteRepository;
import com.lcorp.notes.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final FolderRepository folderRepository;

    public NoteController(NoteRepository noteRepository,
                          UserRepository userRepository,
                          FolderRepository folderRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
        this.folderRepository = folderRepository;
    }

    private Long getCurrentUserId(Authentication auth) {
        return (Long) auth.getPrincipal();
    }

    @GetMapping
    public ResponseEntity<List<NoteResponse>> listNotes(@RequestParam(required = false) Long folderId,
                                                        Authentication auth) {
        Long userId = getCurrentUserId(auth);

        List<Note> notes;
        if (folderId != null) {
            notes = noteRepository.findByOwnerIdAndFolderIdOrderByUpdatedAtDesc(userId, folderId);
        } else {
            notes = noteRepository.findByOwnerIdOrderByUpdatedAtDesc(userId);
        }

        List<NoteResponse> response = notes.stream()
                .map(n -> new NoteResponse(
                        n.getId(),
                        n.getTitle(),
                        n.getContent(),
                        n.getIsFavorite(),
                        n.getFolder() != null ? n.getFolder().getId() : null,
                        n.getUpdatedAt()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createNote(@RequestBody NoteRequest request, Authentication auth) {
        Long userId = getCurrentUserId(auth);
        String title = request.getTitle() != null && !request.getTitle().trim().isEmpty()
                ? request.getTitle().trim()
                : "Untitled";
        String content = request.getContent() != null ? request.getContent() : "";
        Long folderId = request.getFolderId();

        User user = userRepository.findById(userId).orElseThrow();

        Note note = new Note();
        note.setTitle(title);
        note.setContent(content);
        note.setOwner(user);
        note.setIsFavorite(false);

        if (folderId != null) {
            Folder folder = folderRepository.findById(folderId).orElse(null);
            note.setFolder(folder);
        }

        note = noteRepository.save(note);

        NoteResponse response = new NoteResponse(
                note.getId(),
                note.getTitle(),
                note.getContent(),
                note.getIsFavorite(),
                note.getFolder() != null ? note.getFolder().getId() : null,
                note.getUpdatedAt()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{noteId}")
    public ResponseEntity<?> updateNote(@PathVariable Long noteId,
                                        @RequestBody NoteRequest request,
                                        Authentication auth) {
        Long userId = getCurrentUserId(auth);

        Note note = noteRepository.findByIdAndOwnerId(noteId, userId).orElse(null);

        if (note == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Not found"));
        }

        if (request.getTitle() != null) {
            String title = request.getTitle().trim();
            note.setTitle(title.isEmpty() ? note.getTitle() : title);
        }

        if (request.getContent() != null) {
            note.setContent(request.getContent());
        }

        if (request.getFolderId() != null || request.isFolderIdPresent()) {
            if (request.getFolderId() == null) {
                note.setFolder(null);
            } else {
                Folder folder = folderRepository.findById(request.getFolderId()).orElse(null);
                note.setFolder(folder);
            }
        }

        note = noteRepository.save(note);

        NoteResponse response = new NoteResponse(
                note.getId(),
                note.getTitle(),
                note.getContent(),
                note.getIsFavorite(),
                note.getFolder() != null ? note.getFolder().getId() : null,
                note.getUpdatedAt()
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<?> deleteNote(@PathVariable Long noteId, Authentication auth) {
        Long userId = getCurrentUserId(auth);

        Note note = noteRepository.findByIdAndOwnerId(noteId, userId).orElse(null);

        if (note == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Not found"));
        }

        noteRepository.delete(note);

        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }

    @PostMapping("/{noteId}/favorite")
    public ResponseEntity<?> toggleFavorite(@PathVariable Long noteId, Authentication auth) {
        Long userId = getCurrentUserId(auth);

        Note note = noteRepository.findByIdAndOwnerId(noteId, userId).orElse(null);

        if (note == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Not found"));
        }

        note.setIsFavorite(!note.getIsFavorite());
        note = noteRepository.save(note);

        return ResponseEntity.ok(Map.of("id", note.getId(), "is_favorite", note.getIsFavorite()));
    }
}