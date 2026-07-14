package com.examly.springapp.repository;
import com.examly.springapp.entity.SocialConnection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface SocialConnectionRepository extends JpaRepository<SocialConnection, Long> {
    List<SocialConnection> findByUserIdOrFriendId(Long userId, Long friendId);
}
