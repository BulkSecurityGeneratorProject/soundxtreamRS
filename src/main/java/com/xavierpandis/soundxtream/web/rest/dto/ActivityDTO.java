package com.xavierpandis.soundxtream.web.rest.dto;

import com.xavierpandis.soundxtream.domain.ActivityUser;
import com.xavierpandis.soundxtream.domain.Playlist;
import com.xavierpandis.soundxtream.domain.Song;
import com.xavierpandis.soundxtream.domain.Song_user;

import java.time.ZonedDateTime;

/**
 * Created by Xavi on 20/04/2016.
 */
public class ActivityDTO implements ActivityUser {
    private String type;
    private Playlist playlist;
    private SongDTO song;
    private ZonedDateTime dateAction;
    private Song_user shareTrack;

    @Override
    public ZonedDateTime dateAction() {
        return getDate();
    }

    public Song_user getShareTrack() {
        return shareTrack;
    }

    public void setShareTrack(Song_user shareTrack) {
        this.shareTrack = shareTrack;
    }

    public ZonedDateTime getDate() {
        return dateAction;
    }

    public void setDate(ZonedDateTime date) {
        this.dateAction = date;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Playlist getPlaylist() {
        return playlist;
    }

    public void setPlaylist(Playlist playlist) {
        this.playlist = playlist;
    }

    public SongDTO getSong() {
        return song;
    }

    public void setSong(SongDTO song) {
        this.song = song;
    }
}
