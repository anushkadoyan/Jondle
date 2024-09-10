import React from "react";
import { IoSearch } from "react-icons/io5";
import { searchSong } from "../../helpers";
import { Song } from "../../types/song";

import * as Styled from "./index.styled";

interface Props {
  currentTry: number;
  setSelectedSong: React.Dispatch<React.SetStateAction<Song | undefined>>;
}

export function Search({ currentTry, setSelectedSong }: Props) {
  const [value, setValue] = React.useState<string>("");
  const [results, setResults] = React.useState<Song[]>([]);

  React.useEffect(() => {
    if (value) {
      setResults(searchSong(value));
    } else if (value === "") {
      setResults([]);
    }
  }, [value]);

  // clear value on selection
  React.useEffect(() => {
    setValue("");
  }, [currentTry]);

  return (
    <Styled.Container>
      <Styled.ResultsContainer>
        {results.map((song, i) => (
          <Styled.Result
            key={`${song.artist}+${song.name}+${i}+${song.youtubeId}`}
            onClick={() => {
              setSelectedSong(song);
              setValue(`${song.artist} - ${song.name}`);
              setResults([]);
            }}
          >
            <Styled.ResultText>
              {song.artist} - {song.name}
            </Styled.ResultText>
          </Styled.Result>
        ))}
      </Styled.ResultsContainer>
      <Styled.SearchContainer>
        <Styled.SearchPadding>
          <IoSearch size={20} />
          <Styled.Input
            onChange={(e) => setValue(e.currentTarget.value)}
            placeholder="Search"
            value={value}
          />
        </Styled.SearchPadding>
      </Styled.SearchContainer>
    </Styled.Container>
  );
}
