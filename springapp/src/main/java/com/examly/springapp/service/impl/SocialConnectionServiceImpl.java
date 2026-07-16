package com.examly.springapp.service.impl;

import com.examly.springapp.entity.SocialConnection;
import com.examly.springapp.repository.SocialConnectionRepository;
import com.examly.springapp.service.SocialConnectionService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SocialConnectionServiceImpl implements SocialConnectionService {

    private final SocialConnectionRepository socialConnectionRepository;

    public SocialConnectionServiceImpl(SocialConnectionRepository socialConnectionRepository) {
        this.socialConnectionRepository = socialConnectionRepository;
    }

    @Override
    public SocialConnection sendRequest(SocialConnection connection) {
        return socialConnectionRepository.save(connection);
    }

    @Override
    public SocialConnection acceptRequest(Long connectionId) {
        SocialConnection connection = socialConnectionRepository.findById(connectionId).orElse(null);
        if (connection != null) {
            connection.setStatus(com.examly.springapp.enums.ConnectionStatus.ACCEPTED);
            return socialConnectionRepository.save(connection);
        }
        return null;
    }

    @Override
    public List<SocialConnection> getUserConnections(Long userId) {
        return socialConnectionRepository.findByUserIdOrFriendId(userId, userId);
    }
}
