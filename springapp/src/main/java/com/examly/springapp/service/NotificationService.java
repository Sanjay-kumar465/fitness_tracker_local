package com.examly.springapp.service;

import com.examly.springapp.entity.Notification;
import java.util.List;

public interface NotificationService {
    Notification sendNotification(Notification notification);
    List<Notification> getNotificationsByUserId(Long userId);
}
