package com.examly.springapp.service;

import com.examly.springapp.entity.SocialConnection;
import java.util.List;

public interface SocialConnectionService {
    SocialConnection sendRequest(SocialConnection connection);
    SocialConnection acceptRequest(Long connectionId);
    List<SocialConnection> getUserConnections(Long userId);
}
