package com.xavierpandis.soundxtream.web.rest;

import com.xavierpandis.soundxtream.Application;
import com.xavierpandis.soundxtream.domain.Track_count;
import com.xavierpandis.soundxtream.repository.Track_countRepository;
import com.xavierpandis.soundxtream.repository.search.Track_countSearchRepository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.Matchers.hasItem;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * Test class for the Track_countResource REST controller.
 *
 * @see Track_countResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
@IntegrationTest
public class Track_countResourceIntTest {

    private static final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME.withZone(ZoneId.of("Z"));

    private static final String DEFAULT_IP_CLIENT = "AAAAA";
    private static final String UPDATED_IP_CLIENT = "BBBBB";

    private static final ZonedDateTime DEFAULT_DATE_PLAYED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneId.systemDefault());
    private static final ZonedDateTime UPDATED_DATE_PLAYED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);
    private static final String DEFAULT_DATE_PLAYED_STR = dateTimeFormatter.format(DEFAULT_DATE_PLAYED);

    private static final ZonedDateTime DEFAULT_DATE_EXPIRE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneId.systemDefault());
    private static final ZonedDateTime UPDATED_DATE_EXPIRE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);
    private static final String DEFAULT_DATE_EXPIRE_STR = dateTimeFormatter.format(DEFAULT_DATE_EXPIRE);

    @Inject
    private Track_countRepository track_countRepository;

    @Inject
    private Track_countSearchRepository track_countSearchRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restTrack_countMockMvc;

    private Track_count track_count;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        Track_countResource track_countResource = new Track_countResource();
        ReflectionTestUtils.setField(track_countResource, "track_countSearchRepository", track_countSearchRepository);
        ReflectionTestUtils.setField(track_countResource, "track_countRepository", track_countRepository);
        this.restTrack_countMockMvc = MockMvcBuilders.standaloneSetup(track_countResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        track_count = new Track_count();
        track_count.setIp_client(DEFAULT_IP_CLIENT);
        track_count.setDate_played(DEFAULT_DATE_PLAYED);
        track_count.setDate_expire(DEFAULT_DATE_EXPIRE);
    }

    @Test
    @Transactional
    public void createTrack_count() throws Exception {
        int databaseSizeBeforeCreate = track_countRepository.findAll().size();

        // Create the Track_count

        restTrack_countMockMvc.perform(post("/api/track_counts")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(track_count)))
                .andExpect(status().isCreated());

        // Validate the Track_count in the database
        List<Track_count> track_counts = track_countRepository.findAll();
        assertThat(track_counts).hasSize(databaseSizeBeforeCreate + 1);
        Track_count testTrack_count = track_counts.get(track_counts.size() - 1);
        assertThat(testTrack_count.getIp_client()).isEqualTo(DEFAULT_IP_CLIENT);
        assertThat(testTrack_count.getDate_played()).isEqualTo(DEFAULT_DATE_PLAYED);
        assertThat(testTrack_count.getDate_expire()).isEqualTo(DEFAULT_DATE_EXPIRE);
    }

    @Test
    @Transactional
    public void checkIp_clientIsRequired() throws Exception {
        int databaseSizeBeforeTest = track_countRepository.findAll().size();
        // set the field null
        track_count.setIp_client(null);

        // Create the Track_count, which fails.

        restTrack_countMockMvc.perform(post("/api/track_counts")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(track_count)))
                .andExpect(status().isBadRequest());

        List<Track_count> track_counts = track_countRepository.findAll();
        assertThat(track_counts).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllTrack_counts() throws Exception {
        // Initialize the database
        track_countRepository.saveAndFlush(track_count);

        // Get all the track_counts
        restTrack_countMockMvc.perform(get("/api/track_counts?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(track_count.getId().intValue())))
                .andExpect(jsonPath("$.[*].ip_client").value(hasItem(DEFAULT_IP_CLIENT.toString())))
                .andExpect(jsonPath("$.[*].date_played").value(hasItem(DEFAULT_DATE_PLAYED_STR)))
                .andExpect(jsonPath("$.[*].date_expire").value(hasItem(DEFAULT_DATE_EXPIRE_STR)));
    }

    @Test
    @Transactional
    public void getTrack_count() throws Exception {
        // Initialize the database
        track_countRepository.saveAndFlush(track_count);

        // Get the track_count
        restTrack_countMockMvc.perform(get("/api/track_counts/{id}", track_count.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(track_count.getId().intValue()))
            .andExpect(jsonPath("$.ip_client").value(DEFAULT_IP_CLIENT.toString()))
            .andExpect(jsonPath("$.date_played").value(DEFAULT_DATE_PLAYED_STR))
            .andExpect(jsonPath("$.date_expire").value(DEFAULT_DATE_EXPIRE_STR));
    }

    @Test
    @Transactional
    public void getNonExistingTrack_count() throws Exception {
        // Get the track_count
        restTrack_countMockMvc.perform(get("/api/track_counts/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTrack_count() throws Exception {
        // Initialize the database
        track_countRepository.saveAndFlush(track_count);

		int databaseSizeBeforeUpdate = track_countRepository.findAll().size();

        // Update the track_count
        track_count.setIp_client(UPDATED_IP_CLIENT);
        track_count.setDate_played(UPDATED_DATE_PLAYED);
        track_count.setDate_expire(UPDATED_DATE_EXPIRE);

        restTrack_countMockMvc.perform(put("/api/track_counts")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(track_count)))
                .andExpect(status().isOk());

        // Validate the Track_count in the database
        List<Track_count> track_counts = track_countRepository.findAll();
        assertThat(track_counts).hasSize(databaseSizeBeforeUpdate);
        Track_count testTrack_count = track_counts.get(track_counts.size() - 1);
        assertThat(testTrack_count.getIp_client()).isEqualTo(UPDATED_IP_CLIENT);
        assertThat(testTrack_count.getDate_played()).isEqualTo(UPDATED_DATE_PLAYED);
        assertThat(testTrack_count.getDate_expire()).isEqualTo(UPDATED_DATE_EXPIRE);
    }

    @Test
    @Transactional
    public void deleteTrack_count() throws Exception {
        // Initialize the database
        track_countRepository.saveAndFlush(track_count);

		int databaseSizeBeforeDelete = track_countRepository.findAll().size();

        // Get the track_count
        restTrack_countMockMvc.perform(delete("/api/track_counts/{id}", track_count.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Track_count> track_counts = track_countRepository.findAll();
        assertThat(track_counts).hasSize(databaseSizeBeforeDelete - 1);
    }
}
