package com.xavierpandis.soundxtream.repository;

import com.xavierpandis.soundxtream.domain.Track_count;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.method.P;

import java.util.List;

/**
 * Spring Data JPA repository for the Track_count entity.
 */
public interface Track_countRepository extends JpaRepository<Track_count,Long> {

    @Query("select track_count from Track_count track_count where track_count.user.login = ?#{principal.username}")
    List<Track_count> findByUserIsCurrentUser();

    @Query("select track_count from Track_count track_count where track_count.user.login = :login AND track_count.ip_client = :ip AND track_count.song.id = :id")
    List<Track_count> findPlayTrack(@Param("login") String login, @Param("ip") String ip, @Param("id") Long id);

    @Query("select COUNT(track_count) from Track_count track_count where track_count.song.id = :id")
    int findNumberPlaysSong(@Param("id") Long id);

    @Query("select track_count from Track_count track_count where track_count.song.id = :id")
    List<Track_count> findAllPlays(@Param("id") Long id);

}
