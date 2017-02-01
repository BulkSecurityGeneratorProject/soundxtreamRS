package com.xavierpandis.soundxtream.domain;

/**
 * Created by Xavi on 27/01/2017.
 */
public class GeoIP {
    private String ipAddress;
    private String city;
    private String country;
    private String latitude;
    private String longitude;

    public GeoIP(String ipAddress, String country, String city, String latitude, String longitude) {
        this.ipAddress = ipAddress;
        this.city = city;
        this.country = country;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getLatitude() {
        return latitude;
    }

    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }

    public String getLongitude() {
        return longitude;
    }

    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        GeoIP geoIP = (GeoIP) o;

        if (ipAddress != null ? !ipAddress.equals(geoIP.ipAddress) : geoIP.ipAddress != null) return false;
        if (city != null ? !city.equals(geoIP.city) : geoIP.city != null) return false;
        if (country != null ? !country.equals(geoIP.country) : geoIP.country != null) return false;
        if (latitude != null ? !latitude.equals(geoIP.latitude) : geoIP.latitude != null) return false;
        return longitude != null ? longitude.equals(geoIP.longitude) : geoIP.longitude == null;

    }

    @Override
    public int hashCode() {
        int result = ipAddress != null ? ipAddress.hashCode() : 0;
        result = 31 * result + (city != null ? city.hashCode() : 0);
        result = 31 * result + (country != null ? country.hashCode() : 0);
        result = 31 * result + (latitude != null ? latitude.hashCode() : 0);
        result = 31 * result + (longitude != null ? longitude.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "GeoIP{" +
            "ipAddress='" + ipAddress + '\'' +
            ", city='" + city + '\'' +
            ", country='" + country + '\'' +
            ", latitude='" + latitude + '\'' +
            ", longitude='" + longitude + '\'' +
            '}';
    }
}
