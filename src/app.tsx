import React from "react";
import _ from "lodash";

import { Song } from "./types/song";
import { GuessType } from "./types/guess";

import { todaysSolution } from "./helpers";

import { Header, InfoPopUp, Game, Footer } from "./components";

import * as Styled from "./app.styled";

function App() {
  const initialGuess = {
    song: undefined,
    skipped: false,
    isCorrect: undefined,
  } as GuessType;

  const [guesses, setGuesses] = React.useState<GuessType[]>(
    Array.from({ length: 6 }).fill(initialGuess) as GuessType[]
  );
  const [currentTry, setCurrentTry] = React.useState<number>(0);
  const [selectedSong, setSelectedSong] = React.useState<Song>();
  const [didGuess, setDidGuess] = React.useState<boolean>(false);

  const firstRun = localStorage.getItem("firstRun") === null;

  function reloadWithoutQueryParameters() {
    location.replace(location.pathname);
  }
  const statsImportQueryParameter = new URLSearchParams(window.location.search).get('statsImport') || "";
  function importStats () {
    if (statsImportQueryParameter){
      const importedStats = JSON.parse(statsImportQueryParameter)
      if (Array.isArray(importedStats)) {
        importedStats.forEach(day => {
          if (Array.isArray(day.guesses)) {
            if(day.guesses.length == 5){
              day.guesses.push(initialGuess)
            }
          }
        });
      }
      localStorage.setItem("stats", JSON.stringify(importedStats));
      reloadWithoutQueryParameters();
    }
  }
  if (statsImportQueryParameter){
    if (confirm("Do you want to import your previous stats? This will overwrite any stats on this site.")){
      importStats()
    } else {
      reloadWithoutQueryParameters();
    }
  }

  let stats = JSON.parse(localStorage.getItem("stats") || "{}");

  React.useEffect(() => {
    if (Array.isArray(stats)) {
      const visitedToday = _.isEqual(
        todaysSolution,
        stats[stats.length - 1].solution
      );

      if (!visitedToday) {
        stats.push({
          solution: todaysSolution,
          currentTry: 0,
          didGuess: 0,
        });
      } else {
        const { currentTry, guesses, didGuess } = stats[stats.length - 1];
        setCurrentTry(currentTry);
        setGuesses(guesses);
        setDidGuess(didGuess);
      }
    } else {
      // initialize stats
      // useEffect below does rest
      stats = [];
      stats.push({
        solution: todaysSolution,
      });
    }
  }, []);

  React.useEffect(() => {
    if (Array.isArray(stats)) {
      stats[stats.length - 1].currentTry = currentTry;
      stats[stats.length - 1].didGuess = didGuess;
      stats[stats.length - 1].guesses = guesses;
    }
  }),
    [guesses, currentTry, didGuess];

  React.useEffect(() => {
    localStorage.setItem("stats", JSON.stringify(stats));
  }, [stats]);

  const [isInfoPopUpOpen, setIsInfoPopUpOpen] =
    React.useState<boolean>(firstRun);

  const openInfoPopUp = React.useCallback(() => {
    setIsInfoPopUpOpen(true);
  }, []);

  const closeInfoPopUp = React.useCallback(() => {
    if (firstRun) {
      localStorage.setItem("firstRun", "false");
      setIsInfoPopUpOpen(false);
    } else {
      setIsInfoPopUpOpen(false);
    }
  }, [localStorage.getItem("firstRun")]);

  const skip = React.useCallback(() => {
    setGuesses((guesses: GuessType[]) => {
      const newGuesses = [...guesses];
      newGuesses[currentTry] = {
        song: undefined,
        skipped: true,
        isCorrect: undefined,
      };

      return newGuesses;
    });

    setCurrentTry((currentTry) => currentTry + 1);
  }, [currentTry]);

  const guess = React.useCallback(() => {
    const isCorrect = selectedSong === todaysSolution;

    if (!selectedSong) {
      alert("Choose a song");
      return;
    }

    setGuesses((guesses: GuessType[]) => {
      const newGuesses = [...guesses];
      newGuesses[currentTry] = {
        song: selectedSong,
        skipped: false,
        isCorrect: isCorrect,
      };

      return newGuesses;
    });

    setCurrentTry((currentTry) => currentTry + 1);
    setSelectedSong(undefined);

    if (isCorrect) {
      setDidGuess(true);
    }
  }, [guesses, selectedSong]);

  return (
    <main>
      <Header openInfoPopUp={openInfoPopUp} />
      {isInfoPopUpOpen && <InfoPopUp onClose={closeInfoPopUp} />}
      <Styled.Container>
        <Game
          guesses={guesses}
          didGuess={didGuess}
          todaysSolution={todaysSolution}
          currentTry={currentTry}
          setSelectedSong={setSelectedSong}
          skip={skip}
          guess={guess}
        />
      </Styled.Container>
      <Footer />
    </main>
  );
}

export default App;
