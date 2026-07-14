package com.examly.springapp.service;
import com.examly.springapp.entity.Notification;
import com.examly.springapp.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;
    
    public Notification sendNotification(Notification notification) {
        return notificationRepository.save(notification);
    }
    
    public List<Notification> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserId(userId);
    }
}
