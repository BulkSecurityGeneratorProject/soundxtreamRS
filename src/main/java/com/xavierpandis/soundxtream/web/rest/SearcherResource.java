package com.xavierpandis.soundxtream.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.xavierpandis.soundxtream.domain.*;
import com.xavierpandis.soundxtream.repository.*;
import com.xavierpandis.soundxtream.repository.search.PlaylistSearchRepository;
import com.xavierpandis.soundxtream.repository.search.SongSearchRepository;
import com.xavierpandis.soundxtream.repository.search.UserSearchRepository;
import com.xavierpandis.soundxtream.security.SecurityUtils;
import com.xavierpandis.soundxtream.web.rest.dto.ActivityDTO;
import com.xavierpandis.soundxtream.web.rest.dto.PlaylistDTO;
import com.xavierpandis.soundxtream.web.rest.util.HeaderUtil;
import com.xavierpandis.soundxtream.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import javax.inject.Inject;
import javax.validation.Valid;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * REST controller for managing Playlist.
 */
@RestController
@RequestMapping("/api")
public class SearcherResource {

    private final Logger log = LoggerFactory.getLogger(SearcherResource.class);

    @Inject
    private UserRepository userRepository;

    @Inject
    private PlaylistRepository playlistRepository;

    @Inject
    private SongRepository songRepository;

    /**
     * SEARCH  /_search/playlists/:query -> search for the playlist corresponding
     * to the query.
     */

    public List<Playlist> searchPlaylists(String query) {
        log.debug("REST request to search Playlists for query {}", query);
        return playlistRepository.findAll()
            .stream()
            .filter(playlist -> playlist.getName().toLowerCase().contains(query))
            .collect(Collectors.toList());
    }

    public List<User> searchUsers(String query) {
        log.debug("REST request to search Playlists for query {}", query);
        return userRepository.findAll()
            .stream()
            .filter(user -> user.getLogin().toLowerCase().contains(query))
            .collect(Collectors.toList());
    }

    public List<Song> searchSong(String query) {
        log.debug("REST request to search Playlists for query {}", query);
        return songRepository.findAll()
            .stream().filter(song -> song.getName().toLowerCase().contains(query))
            .collect(Collectors.toList());
    }

    @RequestMapping(value = "/_search/{query:.+}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public Set<Object> search(@PathVariable String query) {
        log.debug("REST request to search Playlists for query {}", query);

        query = query.toLowerCase();

        List<User> users = searchUsers(query);
        List<Playlist> playlists = searchPlaylists(query);
        List<Song> songs = searchSong(query);

        Set<Object> res = new HashSet<>();

        res.addAll(searchPlaylists(query));
        res.addAll(searchUsers(query));
        res.addAll(searchSong(query));

        return res;
    }

    @RequestMapping(value = "/_search/categories/{query:.+}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public HashMap<String, Object> searchCategories(@PathVariable String query) {
        log.debug("REST request to search Playlists for query {}", query);

        query = query.toLowerCase();

        List<User> users = searchUsers(query);
        List<Playlist> playlists = searchPlaylists(query);
        List<Song> songs = searchSong(query);

        Set<Object> res = new HashSet<>();

        users.removeIf(user -> user.getLogin().equals("anonymousUser"));

        HashMap map = new HashMap();

        map.put("playlists",searchPlaylists(query));
        map.put("users", searchUsers(query));
        map.put("songs", searchSong(query));

        /*res.addAll(searchPlaylists(query));
        res.addAll(searchUsers(query));
        res.addAll(searchSong(query));*/

        return map;
    }

}
