package com.xavierpandis.soundxtream.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.xavierpandis.soundxtream.domain.*;
import com.xavierpandis.soundxtream.repository.*;
import com.xavierpandis.soundxtream.repository.search.SongSearchRepository;
import com.xavierpandis.soundxtream.security.SecurityUtils;
import com.xavierpandis.soundxtream.service.DateDiffService;
import com.xavierpandis.soundxtream.service.SongService;
import com.xavierpandis.soundxtream.web.rest.dto.SongDTO;
import com.xavierpandis.soundxtream.web.rest.util.HeaderUtil;
import com.xavierpandis.soundxtream.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import javax.validation.Valid;
import java.io.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * REST controller for managing Song.
 */
@RestController
@RequestMapping("/api")
public class SongResource {

    private final Logger log = LoggerFactory.getLogger(SongResource.class);

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

    @Inject
    private SongService songService;

    public boolean checkExistAccess(String name, String login){

        Song exist = songRepository.findOneByAccessUrl(name, login);

        if(exist == null) {
            return false;
        }

        return true;
    }

    /**
     * POST  /songs -> Create a new song.
     */
    @RequestMapping(value = "/songs",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Song> createSong(@Valid @RequestBody Song song) throws URISyntaxException {
        log.debug("REST request to save Song : {}", song);
        if (song.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("song", "idexists", "A new song cannot already have an ID")).body(null);
        }
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();

        int i = 0;

        /*do{
            song.setAccess_url(song.getAccess_url().concat("-"+i));
        }
        while(checkExistAccess(song.getName(), user.getLogin()));*/

        String nameFinal = checkAccessURL(song.getAccess_url(), song);

        song.setAccess_url(nameFinal);

        if(song.getArtwork() == null){
            song.setArtwork("/assets/images/default_image.jpg");
        }

        song.setUser(user);
        ZonedDateTime today = ZonedDateTime.now();
        song.setDate_posted(today);
        if(song.getArtwork() == null){
            song.setArtwork("uploads/no_image.jpg");
        }
        Song result = songRepository.save(song);
        songSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/songs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("song", result.getId().toString()))
            .body(result);
    }

    public String checkAccessURL(String name,Song song){
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();

        Song exist = songRepository.findOneByAccessUrl(song.getAccess_url(), user.getLogin());

        if(exist != null){
            String nextCheck = song.getAccess_url()+"1";
            song.setAccess_url(nextCheck);
            checkAccessURL(nextCheck,song);
        }
        return song.getAccess_url();
    }

    /**
     * PUT  /songs -> Updates an existing song.
     */
    @RequestMapping(value = "/songs",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Song> updateSong(@Valid @RequestBody Song song) throws URISyntaxException {
        log.debug("REST request to update Song : {}", song);
        if (song.getId() == null) {
            return createSong(song);
        }
        if(song.getArtwork() == null){
            song.setArtwork("uploads/no_image.jpg");
        }
        ZonedDateTime today = ZonedDateTime.now();
        song.setDate_posted(today);
        Song result = songRepository.save(song);
        songSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("song", song.getId().toString()))
            .body(result);
    }

    @RequestMapping(value = "/songsApp",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<SongDTO>> getSongsApp(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Songs");
        Page<Song> page = songRepository.findAll(pageable);

        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();

        List<SongDTO> listSongDTO = new ArrayList<>();

        for(Song song:page.getContent()){
            listSongDTO.add(getInfoSong(song,user));
        }


        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/songs");
        return new ResponseEntity<>(listSongDTO, headers, HttpStatus.OK);
    }

    /**
     * GET  /songs -> get all the songs.
     */
    @RequestMapping(value = "/songs",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<SongDTO>> getAllSongs(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Songs");
        Page<Song> page = songRepository.findByUserIsCurrentUser(pageable);

        List<SongDTO> listSongDTO = new ArrayList<>();
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
        ZonedDateTime now = ZonedDateTime.now();

        listSongDTO = songService.getInfoSong(page.getContent());

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/songs");
        return new ResponseEntity<>(listSongDTO, headers, HttpStatus.OK);
    }

    /**
     * GET  /songs/:id -> get the "id" song.
     */
    @RequestMapping(value = "/songs/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<SongDTO> getSong(@PathVariable Long id) {
        log.debug("REST request to get Song : {}", id);
        Song song = songRepository.findOne(id);

        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
        SongDTO songDTO = new SongDTO();
        songDTO.setSong(song);

        Song_user song_user = song_userRepository.findExistUserLiked(song.getId(),user.getLogin());

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

        return Optional.ofNullable(songDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /songs/:id -> delete the "id" song.
     */
    @RequestMapping(value = "/songs/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteSong(@PathVariable Long id) {
        log.debug("REST request to delete Song : {}", id);
        Song song = songRepository.findOne(id);
        try{
            String rootDir = "./src/main/webapp/";

            File file2 = new File(rootDir + song.getArtwork());
            File file1 = new File(rootDir + song.getUrl());

            if(file1.delete()){
                log.debug("SONG FILE " + file1.getName() + " is deleted!");
            }else{
                log.debug("Delete operation is failed.");
            }
            if(file2.delete()){
                log.debug("SONG ARTWORK" + file2.getName() + " is deleted!");
            }
            else{
                log.debug("Delete operation is failed.");
            }

        }catch(Exception e){

            e.printStackTrace();

        }

        List<Playlist> playlists = playlistRepository.findAllWithEagerRelationships();
        List<Playlist> playlistWithSong = new ArrayList<>();

        for(Playlist playlist:playlists){

            List<Song> songsPlaylist = playlist.getSongs();

            songsPlaylist.removeIf(song1 -> song.getId().equals(id));
            for(Song song2:playlist.getSongs()){
                if(song.getId() == id){
                    playlistWithSong.add(playlist);
                }
            }

            playlist.setSongs(songsPlaylist);
            playlistRepository.save(playlist);
        }

        songRepository.delete(id);
        songSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("song", id.toString())).build();
    }


    /**
     * SEARCH  /_search/songs/:query -> search for the song corresponding
     * to the query.
     */
    @RequestMapping(value = "/_search/songs/{query:.+}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Song> searchSongs(@PathVariable String query) {
        log.debug("REST request to search Songs for query {}", query);
        return StreamSupport
            .stream(songSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    public File convert(MultipartFile file) throws IOException {
        File trackFile = new File(file.getOriginalFilename());
        trackFile.createNewFile();
        FileOutputStream fos = new FileOutputStream(trackFile);
        fos.write(file.getBytes());
        fos.close();
        return trackFile;
    }

    @RequestMapping(value = "/upload",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public void handleFileUpload(@RequestParam("file") MultipartFile file, @RequestParam("name") String name) {
        log.debug("REST request to handleFileUpload");

        File theDir = new File("./src/main/webapp/uploads");

        byte[] bytes;

        String nameSong = "";

        try {

            if (!theDir.exists()) {
                System.out.println("creating directory: /uploads");
                boolean result = false;

                try{
                    theDir.mkdir();
                    result = true;
                }
                catch(SecurityException se){
                    //handle it
                }
                if(result) {
                    System.out.println("DIR created");
                }
            }

            //Get name of file
            nameSong = name;

            //Create new file in path
            BufferedOutputStream stream =
                new BufferedOutputStream(new FileOutputStream(new File("./src/main/webapp/uploads/"+nameSong)));

            stream.write(file.getBytes());
            stream.close();
            log.debug("You successfully uploaded " + file.getName() + "!");
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public SongDTO getInfoSong(Song song, User user){
        SongDTO songDTO = new SongDTO();
        songDTO.setSong(song);

        Song_user song_user = song_userRepository.findExistUserLiked(song.getId(),user.getLogin());

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

        return songDTO;
    }

    @RequestMapping(value = "/songs/newest/user/{login}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<SongDTO>> firstNineSongs(@PathVariable String login)
        throws URISyntaxException {
        log.debug("REST request to get a page of Songs");
        Pageable topTen = new PageRequest(0, 9);
        Page<Song> page = songRepository.findByUserTracks(login,topTen);

        List<SongDTO> listSongDTO = new ArrayList<>();
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();

        listSongDTO = songService.getInfoSong(page.getContent());

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/songs");
        return new ResponseEntity<>(listSongDTO, headers, HttpStatus.OK);
    }

    /**
     * GET  /songs/{login} -> get all the songs of user.
     */
    @RequestMapping(value = "/songs/user/{login}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<SongDTO>> getAllSongs(@PathVariable String login, Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Songs");
        Page<Song> page = songRepository.findByUserTracks(login,pageable);

        List<SongDTO> listSongDTO = new ArrayList<>();
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();

        listSongDTO = songService.getInfoSong(page.getContent());

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/songs");
        return new ResponseEntity<>(listSongDTO, headers, HttpStatus.OK);
    }

    @RequestMapping(value = "/filter-tracks",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<SongDTO>> getSongsFiltered(@RequestBody List<String> filters){

        List<SongDTO> listSongDTO = new ArrayList<>();
        return new ResponseEntity<>(listSongDTO, null, HttpStatus.OK);
    }

    /*private static final int BUFFER_LENGTH = 1024 * 1024 * 10;
    private static final long EXPIRE_TIME = 1000 * 60 * 60 * 24;
    private static final Pattern RANGE_PATTERN = Pattern.compile("bytes=(?<start>\\d*)-(?<end>\\d*)");

    @RequestMapping(value = "/player/track/{id}",
        method = RequestMethod.GET)
    @Timed
    public void getDownload2(HttpServletRequest request, HttpServletResponse response, @PathVariable Long id) throws IOException{

        Song song = songRepository.findOne(id);

        String songName = song.getName()+".mp3";

        Path video = Paths.get("./src/main/webapp/"+song.getUrl());

        int length = (int) Files.size(video);
        int start = 0;
        int end = length - 1;

        String range = request.getHeader("range");

        if(range == null){
            range = "bytes="+start+"-"+end/5;
        }

        Matcher matcher = RANGE_PATTERN.matcher(range);

        if (matcher.matches()) {
            String startGroup = matcher.group("start");
            start = startGroup.isEmpty() ? start : Integer.valueOf(startGroup);
            start = start < 0 ? 0 : start;

            String endGroup = matcher.group("end");
            end = endGroup.isEmpty() ? end : Integer.valueOf(endGroup);
            end = end > length - 1 ? length - 1 : end;
        }

        int contentLength = end - start + 1;

        response.reset();
        response.setBufferSize(BUFFER_LENGTH);
        response.setHeader("Content-Disposition", String.format("inline;filename=\"%s\"", songName));
        response.setHeader("Accept-Ranges", "bytes");
        response.setDateHeader("Last-Modified", Files.getLastModifiedTime(video).toMillis());
        response.setDateHeader("Expires", System.currentTimeMillis() + EXPIRE_TIME);
        response.setContentType(Files.probeContentType(video));
        response.setHeader("Content-Range", String.format("bytes %s-%s/%s", start, end, length));
        response.setHeader("Content-Length", String.format("%s", contentLength));
        response.setStatus(HttpServletResponse.SC_PARTIAL_CONTENT);

        int bytesRead;
        int bytesLeft = contentLength;
        ByteBuffer buffer = ByteBuffer.allocate(BUFFER_LENGTH);

        try (SeekableByteChannel input = Files.newByteChannel(video);
             OutputStream output = response.getOutputStream()) {

            input.position(start);

            while ((bytesRead = input.read(buffer)) != -1 && bytesLeft > 0) {
                buffer.clear();
                output.write(buffer.array(), 0, bytesLeft < bytesRead ? bytesLeft : bytesRead);
                bytesLeft -= bytesRead;
            }
        }
    }*/


    @RequestMapping(value = "/trackUrl/{accessUrl}/by/{user}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<SongDTO> getTrackByAccessUrl(@PathVariable String accessUrl, @PathVariable String user) throws Exception {
        log.debug("REST request to get Track : {}", accessUrl);
        Song song = songRepository.findOneByAccessUrl(accessUrl,user);

        if(song == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        int plays = track_countRepository.findNumberPlaysSong(song.getId());

        User userIn = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();

        SongDTO songDTO = new SongDTO();
        songDTO.setSong(song);
        songDTO.setPlays(plays);

        Song_user song_user = song_userRepository.findExistUserLiked(song.getId(),userIn.getLogin());

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

        return new ResponseEntity<>(songDTO, HttpStatus.OK);
    }

    @RequestMapping(value = "/trackByUser",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Song>> getTracksByUser()
        throws URISyntaxException {
        log.debug("REST request to get a page of Tracks");
        List<Song> page = songRepository.findByUserIsCurrentUser();
        return new ResponseEntity<>(page, HttpStatus.OK);
    }

    @RequestMapping(value = "/tracksPlayer/user/logged",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<SongDTO>> tracksPlayerUser(){
        List<Song> listPlayer = songRepository.findByUserIsCurrentUser();

        List<SongDTO> listSongDTO = new ArrayList<>();
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
        ZonedDateTime now = ZonedDateTime.now();

        for(Song song:listPlayer){
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

            listSongDTO.add(songDTO);

            int countLikes = song_userRepository.findTotalLikes(song.getId());
            int countShares = song_userRepository.findTotalShares(song.getId());
            songDTO.setTotalLikes(countLikes);
            songDTO.setTotalShares(countShares);
        }

        return new ResponseEntity<>(listSongDTO, HttpStatus.OK);
    }


    /*@RequestMapping(value = "/player/track/{id}",
        method = RequestMethod.GET,
        produces = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Timed
    public void getDownload2(HttpServletRequest request, HttpServletResponse response, @PathVariable Long id) throws Exception {
        Song song = songRepository.findOne(id);

        String songName = song.getName()+".mp3";

        Path video = Paths.get("./src/main/webapp/"+song.getUrl());

        MultipartFileSender.fromPath(video)
            .with(request)
            .with(response)
            .serveResource();

    }*/


    @RequestMapping(value = "your/songs/filtered/by",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<SongDTO>> getOwnSongsFilteredBy(
        @RequestParam(name = "name",required = false) String name,
        @RequestParam(name = "type", required = false) String type,
        @RequestParam(name = "label", required = false) String label,
        @RequestParam(name = "style", required = false) String style) throws Exception{

        List<Song> songs = songRepository.findByUserIsCurrentUser();

        if(name != null){
            songs = songs.stream().filter(song -> song.getName().toLowerCase().contains(name.toLowerCase())).collect(Collectors.toList());
        }
        if(type != null){
            songs = songs.stream().filter(song -> song.getTypeSong().toLowerCase().contains(type.toLowerCase())).collect(Collectors.toList());;
        }
        if(label != null){
            songs = songs.stream().filter(song -> song.getLabel().toLowerCase().contains(label.toLowerCase())).collect(Collectors.toList());
        }

        List<SongDTO> listSongDTO = new ArrayList<>();
        ZonedDateTime now = ZonedDateTime.now();

        listSongDTO = songService.getInfoSong(songs);

        return new ResponseEntity<>(listSongDTO, HttpStatus.OK);
    }

    @RequestMapping(value = "{login}/songs/filtered/by",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public String getOwnSongsFilteredBy(@PathVariable("login") String login, @RequestParam Map<String,String> requestParams) throws Exception{

        log.debug("filters", requestParams);

        //perform DB operations

        return "profile";
    }

    @RequestMapping(value = "/15-most-played-songs",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<SongDTO>> get15MostPlayedSongs(){

        List<Song> songs = songRepository.find15FirstMostPlayedSongs();

        List<SongDTO> listSongDTO = songService.getInfoSong(songs);

        listSongDTO.stream().limit(15);

        return new ResponseEntity<>(listSongDTO, null, HttpStatus.OK);
    }

    @RequestMapping(value = "/most-played-songs",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<SongDTO>> getMostPlayedSongs(){

        List<Song> songs = songRepository.find15FirstMostPlayedSongs();

        List<SongDTO> listSongDTO = songService.getInfoSong(songs);

        return new ResponseEntity<>(listSongDTO, null, HttpStatus.OK);
    }



}
