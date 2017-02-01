package com.xavierpandis.soundxtream.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import java.time.ZonedDateTime;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Track_count.
 */
@Entity
@Table(name = "track_count")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "track_count")
public class Track_count implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @Column(name = "ip_client", nullable = false)
    private String ip_client;
    
    @Column(name = "date_played")
    private ZonedDateTime date_played;
    
    @Column(name = "date_expire")
    private ZonedDateTime date_expire;
    
    @Column(name = "latitude")
    private Float latitude;
    
    @Column(name = "longitude")
    private Float longitude;
    
    @Column(name = "country")
    private String country;
    
    @Column(name = "city")
    private String city;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "song_id")
    private Song song;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIp_client() {
        return ip_client;
    }
    
    public void setIp_client(String ip_client) {
        this.ip_client = ip_client;
    }

    public ZonedDateTime getDate_played() {
        return date_played;
    }
    
    public void setDate_played(ZonedDateTime date_played) {
        this.date_played = date_played;
    }

    public ZonedDateTime getDate_expire() {
        return date_expire;
    }
    
    public void setDate_expire(ZonedDateTime date_expire) {
        this.date_expire = date_expire;
    }

    public Float getLatitude() {
        return latitude;
    }
    
    public void setLatitude(Float latitude) {
        this.latitude = latitude;
    }

    public Float getLongitude() {
        return longitude;
    }
    
    public void setLongitude(Float longitude) {
        this.longitude = longitude;
    }

    public String getCountry() {
        return country;
    }
    
    public void setCountry(String country) {
        this.country = country;
    }

    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Song getSong() {
        return song;
    }

    public void setSong(Song song) {
        this.song = song;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Track_count track_count = (Track_count) o;
        if(track_count.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, track_count.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Track_count{" +
            "id=" + id +
            ", ip_client='" + ip_client + "'" +
            ", date_played='" + date_played + "'" +
            ", date_expire='" + date_expire + "'" +
            ", latitude='" + latitude + "'" +
            ", longitude='" + longitude + "'" +
            ", country='" + country + "'" +
            ", city='" + city + "'" +
            '}';
    }
}
