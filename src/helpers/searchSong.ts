import { songs } from "../constants";
import { Song } from "../types/song";

export function searchSong(searchTerm: string): Song[] {
  function fuzzyMatch(input: string){
    return input.toLowerCase().replace(/[^0-9a-z ]/gi, '');
  }
  searchTerm = fuzzyMatch(searchTerm);

  return songs
    .filter((song: Song) => {
      const songName = fuzzyMatch(song.name);
      const songArtist = fuzzyMatch(song.artist);

      if (songArtist.includes(searchTerm) || songName.includes(searchTerm)) {
        return song;
      }
    })
    .sort((a, b) =>
      a.artist.toLowerCase().localeCompare(b.artist.toLocaleLowerCase())
    );
}
