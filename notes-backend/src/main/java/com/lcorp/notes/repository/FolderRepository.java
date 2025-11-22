package com.lcorp.notes.repository;

import com.lcorp.notes.model.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);
    Optional<Folder> findByIdAndOwnerId(Long id, Long ownerId);
}