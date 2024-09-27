import React from "react";
import _ from "lodash";

import { Song } from "./types/song";
import { GuessState, GuessType } from "./types/guess";

import { getTodaysSolution } from "./helpers";

import { Header, InfoPopUp, Game } from "./components";

import * as Styled from "./app.styled";
// import { dateInPST } from "./constants";

function App() {
  const initialGuess = {
    song: undefined,
    state: undefined,
  } as GuessType;

  const todaysSolution = getTodaysSolution();

  // const [todaysSolution, setTodaysSolution] = React.useState<
  //   Song | undefined
  // >();
  // React.useEffect(() => {
  //   const fetchTime = async () => {
  //     let rightNow;
  //     let rightNowDate;
  //     try {
  //       rightNow = await fetch(
  //         "http://worldtimeapi.org/api/timezone/America/Los_Angeles"
  //       );
  //       rightNow = await rightNow.json();
  //       rightNowDate = new Date(rightNow.datetime);

  //       console.log(rightNow);
  //       console.log(rightNowDate);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //     if (!rightNowDate) {
  //       rightNowDate = dateInPST(new Date());
  //     }
  //     setTodaysSolution(getTodaysSolution(rightNowDate).theSolution);
  //   };

  //   fetchTime();
  // }, []);
  console.log({ todaysSolution });

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
  const urlHash = window.location.hash;
  const urlQueryParametersStart = urlHash.indexOf("?");
  const statsImportQueryParameter =
    new URLSearchParams(urlHash.substring(urlQueryParametersStart)).get(
      "statsImport"
    ) || "";
  function importStats() {
    if (statsImportQueryParameter) {
      const importedStats = JSON.parse(statsImportQueryParameter);
      if (Array.isArray(importedStats)) {
        importedStats.forEach((day) => {
          if (Array.isArray(day.guesses)) {
            if (day.guesses.length == 5) {
              day.guesses.push(initialGuess);
            }
          }
        });
      }
      localStorage.setItem("stats", JSON.stringify(importedStats));
      reloadWithoutQueryParameters();
    }
  }
  if (statsImportQueryParameter) {
    if (
      confirm(
        "Do you want to import your previous stats? This will overwrite any stats on this site."
      )
    ) {
      importStats();
    } else {
      reloadWithoutQueryParameters();
    }
  }

  let stats = JSON.parse(localStorage.getItem("stats") || "{}");
  let statsVersion = JSON.parse(localStorage.getItem("version") || "1");

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
    const currentVersion = 2;
    if (firstRun) {
      statsVersion = currentVersion;
    } else if (statsVersion < currentVersion) {
      statsVersion = currentVersion;
      if (Array.isArray(stats)) {
        for (let index = 0; index < stats.length; index++) {
          const newGuesses: GuessType[] = [];
          for (
            let guessIndex = 0;
            guessIndex < stats[index].guesses.length;
            guessIndex++
          ) {
            const guess = stats[index].guesses[guessIndex];
            if (guess.skipped !== undefined) {
              let state = undefined;
              if (guess.skipped) {
                state = GuessState.Skipped;
              } else if (guess.isCorrect) {
                state = GuessState.Correct;
              } else if (guess.isCorrect === false) {
                state = GuessState.Incorrect;
              }
              newGuesses.push({
                song: guess.song,
                state: state,
              } as GuessType);
            }
          }
          stats[index].guesses = newGuesses;
        }
      }
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

  React.useEffect(() => {
    localStorage.setItem("version", JSON.stringify(statsVersion));
  }, [statsVersion]);

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
        state: GuessState.Skipped,
      };

      return newGuesses;
    });

    setCurrentTry((currentTry) => currentTry + 1);
  }, [currentTry]);

  const guess = React.useCallback(() => {
    let state = GuessState.Incorrect;
    if (selectedSong === todaysSolution) {
      state = GuessState.Correct;
    } else if (selectedSong?.artist === todaysSolution.artist) {
      state = GuessState.PartiallyCorrect;
    }

    if (!selectedSong) {
      alert("Choose a song");
      return;
    }

    setGuesses((guesses: GuessType[]) => {
      const newGuesses = [...guesses];
      newGuesses[currentTry] = {
        song: selectedSong,
        state: state,
      };

      return newGuesses;
    });

    setCurrentTry((currentTry) => currentTry + 1);
    setSelectedSong(undefined);

    if (state === GuessState.Correct) {
      setDidGuess(true);
    }
  }, [guesses, selectedSong]);

  return (
    <main>
      <Header openInfoPopUp={openInfoPopUp} />
      {isInfoPopUpOpen && <InfoPopUp onClose={closeInfoPopUp} />}
      <Styled.Container>
        {todaysSolution && (
          <Game
            guesses={guesses}
            didGuess={didGuess}
            todaysSolution={todaysSolution}
            currentTry={currentTry}
            setSelectedSong={setSelectedSong}
            skip={skip}
            guess={guess}
          />
        )}
      </Styled.Container>
    </main>
  );
}

export default App;
