package com.xavierpandis.soundxtream.web.rest.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.xavierpandis.soundxtream.domain.Track_count;

import java.time.LocalDate;

/**
 * Created by Xavi on 23/01/2017.
 */
public class TrackCountDTO {

    @JsonIgnore
    private Track_count track_count;
    private LocalDate playedDate;
    private Long countPlays;

    public TrackCountDTO(LocalDate playedDate, Long countPlays) {
        this.playedDate = playedDate;
        this.countPlays = countPlays;
    }

    public TrackCountDTO(Track_count track_count, LocalDate playedDate) {
        this.track_count = track_count;
        this.playedDate = playedDate;
    }

    public Long getCountPlays() {
        return countPlays;
    }

    public Track_count getTrack_count() {
        return track_count;
    }

    public LocalDate getPlayedDate() {
        return playedDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TrackCountDTO that = (TrackCountDTO) o;

        if (track_count != null ? !track_count.equals(that.track_count) : that.track_count != null) return false;
        return playedDate != null ? playedDate.equals(that.playedDate) : that.playedDate == null;

    }

    @Override
    public int hashCode() {
        int result = track_count != null ? track_count.hashCode() : 0;
        result = 31 * result + (playedDate != null ? playedDate.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "TrackCountDTO{" +
            "track_count=" + track_count +
            ", playedDate=" + playedDate +
            '}';
    }
}
