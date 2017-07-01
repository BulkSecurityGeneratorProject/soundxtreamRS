package com.xavierpandis.soundxtream.repository;

import com.xavierpandis.soundxtream.domain.Song;
import com.xavierpandis.soundxtream.domain.Track_count;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Song entity.
 */
public interface SongRepository extends JpaRepository<Song, Long> {

    @Query("select song from Song song where song.user.login = ?#{principal.username}")
    Page<Song> findByUserIsCurrentUser(Pageable pageable);

    @Query("select song from Song song where song.user.login = :login ORDER BY song.id desc")
    Page<Song> findByUserTracks(@Param("login") String login, Pageable pageable);

    @Query("select distinct song from Song song left join fetch song.styles")
    List<Song> findAllWithEagerRelationships();

    @Query("select song from Song song left join fetch song.styles where song.id =:id")
    Song findOneWithEagerRelationships(@Param("id") Long id);

    @Query("select song from Song song left join fetch song.styles where song.access_url =:url and song.user.login =:user")
    Song findOneByAccessUrl(@Param("url") String url, @Param("user") String user);

    @Query("select song from Song song where song.user.login = ?#{principal.username} ORDER BY song.date_posted DESC")
    List<Song> findByUserIsCurrentUser();

    @Query("select song from Song song where song.user.login = :login")
    List<Song> findUserTrack(@Param("login") String login);

    @Query("select track_count.song from Track_count track_count GROUP BY track_count.song ORDER BY count(track_count) desc")
    List<Song> find15FirstMostPlayedSongs();

    @Query("select track_count.song from Track_count track_count WHERE track_count.song.user.login =:login GROUP BY track_count.song ORDER BY count(track_count) desc")
    List<Song> findMostPlayedTracksUser(@Param("login") String login);
}
