package com.lcorp.notes.repository;

import com.lcorp.notes.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByOwnerIdOrderByUpdatedAtDesc(Long ownerId);
    List<Note> findByOwnerIdAndFolderIdOrderByUpdatedAtDesc(Long ownerId, Long folderId);
    Optional<Note> findByIdAndOwnerId(Long id, Long ownerId);
}