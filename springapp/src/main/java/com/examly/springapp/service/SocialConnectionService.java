package com.examly.springapp.service;
import com.examly.springapp.entity.SocialConnection;
import com.examly.springapp.repository.SocialConnectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SocialConnectionService {
    @Autowired
    private SocialConnectionRepository socialConnectionRepository;
    
    public SocialConnection sendRequest(SocialConnection connection) {
        return socialConnectionRepository.save(connection);
    }
    
    public SocialConnection acceptRequest(Long connectionId) {
        SocialConnection connection = socialConnectionRepository.findById(connectionId).orElse(null);
        if (connection != null) {
            connection.setStatus(com.examly.springapp.enums.ConnectionStatus.ACCEPTED);
            return socialConnectionRepository.save(connection);
        }
        return null;
    }
    
    public List<SocialConnection> getUserConnections(Long userId) {
        return socialConnectionRepository.findByUserIdOrFriendId(userId, userId);
    }
}
