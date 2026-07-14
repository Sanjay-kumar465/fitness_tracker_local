package com.examly.springapp.repository;

import com.examly.springapp.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserId(Long userId);
    List<Notification> findByUserIdAndIsReadFalse(Long userId);
    List<Notification> findByScheduledDateBeforeAndIsReadFalse(LocalDateTime date);
}
