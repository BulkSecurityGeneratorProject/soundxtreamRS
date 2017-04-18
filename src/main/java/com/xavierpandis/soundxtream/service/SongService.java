package com.xavierpandis.soundxtream.service;

import com.xavierpandis.soundxtream.domain.Song;
import com.xavierpandis.soundxtream.domain.Song_user;
import com.xavierpandis.soundxtream.domain.User;
import com.xavierpandis.soundxtream.repository.*;
import com.xavierpandis.soundxtream.repository.search.SongSearchRepository;
import com.xavierpandis.soundxtream.security.SecurityUtils;
import com.xavierpandis.soundxtream.web.rest.dto.SongDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Xavi on 27/10/2016.
 */

@Service
@Transactional
public class SongService {

    @Inject
    private SongRepository songRepository;

    @Inject
    private SongSearchRepository songSearchRepository;

    @Inject
    private UserRepository userRepository;

    @Inject
    private Song_userRepository song_userRepository;

    @Inject
    private DateDiffService dateDiffService;

    @Inject
    private PlaylistRepository playlistRepository;

    @Inject
    private Track_countRepository track_countRepository;


    public List<SongDTO> getInfoSong(List<Song> songs) {
        List<SongDTO> listSongDTO = new ArrayList<>();
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
        ZonedDateTime now = ZonedDateTime.now();

        for(Song song:songs){
            Song_user song_user = song_userRepository.findExistUserLiked(song.getId(),user.getLogin());
            SongDTO songDTO = new SongDTO();

            songDTO.setTimeAfterUpload(dateDiffService.diffDatesMap(now, song.getDate_posted()));

            songDTO.setSong(song);

            if(song_user == null || song_user.getLiked() == null || !song_user.getLiked()){
                songDTO.setLiked(false);
            }
            else{
                songDTO.setLiked(true);
            }

            if(song_user == null || song_user.getShared() == null || !song_user.getShared()){
                songDTO.setShared(false);
            }
            else{
                songDTO.setShared(true);
            }

            int countLikes = song_userRepository.findTotalLikes(song.getId());
            int countShares = song_userRepository.findTotalShares(song.getId());
            songDTO.setTotalLikes(countLikes);
            songDTO.setTotalShares(countShares);

            int countPlays = track_countRepository.findNumberPlaysSong(song.getId());
            songDTO.setPlays(countPlays);
            listSongDTO.add(songDTO);
        }

        return listSongDTO;
    }
}
