package com.xavierpandis.soundxtream.repository.search;

import com.xavierpandis.soundxtream.domain.Track_count;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data ElasticSearch repository for the Track_count entity.
 */
public interface Track_countSearchRepository extends ElasticsearchRepository<Track_count, Long> {
}
