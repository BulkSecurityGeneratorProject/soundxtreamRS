package com.xavierpandis.soundxtream.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.xavierpandis.soundxtream.domain.Song;
import com.xavierpandis.soundxtream.domain.Track_count;
import com.xavierpandis.soundxtream.domain.User;
import com.xavierpandis.soundxtream.repository.SongRepository;
import com.xavierpandis.soundxtream.repository.Track_countRepository;
import com.xavierpandis.soundxtream.repository.UserRepository;
import com.xavierpandis.soundxtream.repository.search.Track_countSearchRepository;
import com.xavierpandis.soundxtream.security.SecurityUtils;
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

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Track_count.
 */
@RestController
@RequestMapping("/api")
public class Track_countResource {

    public static final int MINUTES_BEFORE_EXPIRATION = 30;
    private final Logger log = LoggerFactory.getLogger(Track_countResource.class);

    @Inject
    private UserRepository userRepository;

    @Inject
    private SongRepository songRepository;

    @Inject
    private Track_countRepository track_countRepository;

    @Inject
    private Track_countSearchRepository track_countSearchRepository;

    /**
     * POST  /track_counts -> Create a new track_count.
     */
    @RequestMapping(value = "/track_counts",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Track_count> createTrack_count(@Valid @RequestBody Track_count track_count) throws URISyntaxException {
        log.debug("REST request to save Track_count : {}", track_count);
        if (track_count.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("track_count", "idexists", "A new track_count cannot already have an ID")).body(null);
        }

        Track_count result = track_countRepository.save(track_count);
        track_countSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/track_counts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("track_count", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /track_counts -> Updates an existing track_count.
     */
    @RequestMapping(value = "/track_counts",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Track_count> updateTrack_count(@Valid @RequestBody Track_count track_count) throws URISyntaxException {
        log.debug("REST request to update Track_count : {}", track_count);
        if (track_count.getId() == null) {
            return createTrack_count(track_count);
        }
        Track_count result = track_countRepository.save(track_count);
        track_countSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("track_count", track_count.getId().toString()))
            .body(result);
    }

    /**
     * GET  /track_counts -> get all the track_counts.
     */
    @RequestMapping(value = "/track_counts",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Track_count>> getAllTrack_counts(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Track_counts");
        Page<Track_count> page = track_countRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/track_counts");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /track_counts/:id -> get the "id" track_count.
     */
    @RequestMapping(value = "/track_counts/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Track_count> getTrack_count(@PathVariable Long id) {
        log.debug("REST request to get Track_count : {}", id);
        Track_count track_count = track_countRepository.findOne(id);
        return Optional.ofNullable(track_count)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /track_counts/:id -> delete the "id" track_count.
     */
    @RequestMapping(value = "/track_counts/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteTrack_count(@PathVariable Long id) {
        log.debug("REST request to delete Track_count : {}", id);
        track_countRepository.delete(id);
        track_countSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("track_count", id.toString())).build();
    }

    /**
     * SEARCH  /_search/track_counts/:query -> search for the track_count corresponding
     * to the query.
     */
    @RequestMapping(value = "/_search/track_counts/{query:.+}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Track_count> searchTrack_counts(@PathVariable String query) {
        log.debug("REST request to search Track_counts for query {}", query);
        return StreamSupport
            .stream(track_countSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    @RequestMapping(value = "/statsPlay/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Track_count>> getStats(@PathVariable Long id) throws URISyntaxException {

        List<Track_count> statsPlay = track_countRepository.findAllPlays(id);

        return new ResponseEntity<>(statsPlay, HttpStatus.OK);
    }


    @RequestMapping(value = "/playCount/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Track_count> countPlay(@PathVariable Long id, HttpServletRequest request) throws URISyntaxException {

        String ip = request.getRemoteAddr();

        Track_count track_count = new Track_count();

        track_count.setIp_client((String) ip);

        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();

        Song song = songRepository.findOne(id);

        List<Track_count> res = track_countRepository.findPlayTrack(user.getLogin(), ip, song.getId());
        Track_count track_count1 = null;
        if(res.size() == 1){
            track_count1 = res.get(0);
        }
        else{
            if(res.size() > 1){
                track_count1 = res.get(res.size()-1);
            }
        }

        ZonedDateTime now2 = ZonedDateTime.now();
        ZonedDateTime now = now2.withZoneSameInstant(ZoneOffset.UTC);
        track_count.setSong(song);
        track_count.setUser(user);

        if(track_count1 == null){

            ZonedDateTime expire = now.plusMinutes(MINUTES_BEFORE_EXPIRATION);

            track_count.setDate_played(now);
            track_count.setDate_expire(expire);
        }
        else{
            if(track_count1.getDate_expire().equals(now) || track_count1.getDate_expire().isBefore(now)){
                ZonedDateTime expire = now.plusMinutes(MINUTES_BEFORE_EXPIRATION);
                track_count.setDate_played(now);
                track_count.setDate_expire(expire);
            }
            else{
                return ResponseEntity.accepted().headers(HeaderUtil.createAlert("Played track with user and ip", null)).body(null);
            }
        }

        Track_count result = track_countRepository.save(track_count);
        track_countSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/track_counts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("track_count", result.getId().toString()))
            .body(result);
    }
}
