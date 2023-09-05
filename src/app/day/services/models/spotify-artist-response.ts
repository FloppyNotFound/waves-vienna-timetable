export interface SpotifyArtistResponse {
  artists: Artists;
}

interface Artists {
  href: string;
  items: SpotifyArtist[];
  limit: number;
  next: string;
  offset: number;
  previous?: any;
  total: number;
}

export interface SpotifyArtist {
  external_urls: Externalurls;
  followers: Followers;
  genres: any[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

interface Image {
  height: number;
  url: string;
  width: number;
}

interface Followers {
  href?: any;
  total: number;
}

interface Externalurls {
  spotify: string;
}
