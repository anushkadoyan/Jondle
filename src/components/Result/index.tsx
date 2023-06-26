import React from "react";

import { Song } from "../../types/song";
import { GuessType } from "../../types/guess";
import { scoreToEmoji } from "../../helpers";

import { Button } from "../Button";
import { MiniYouTubePlayer } from "../MiniYouTubePlayer";

import * as Styled from "./index.styled";
import { theme } from "../../constants";

interface SolutionProps {
  didGuess: boolean;
  currentTry: number;
  todaysSolution: Song;
}

function Solution({
  didGuess,
  todaysSolution,
  currentTry,
}: SolutionProps) {
  return (
    <>
      <Styled.SongTitle>
        Today&apos;s song is {todaysSolution.artist} - {todaysSolution.name}
      </Styled.SongTitle>
      {didGuess &&
        <Styled.Tries>
          You guessed it in {currentTry} {currentTry === 1 ? 'try' : 'tries'}.
        </Styled.Tries>
      }
      <MiniYouTubePlayer id={todaysSolution.youtubeId} />
    </>
  );
}

interface ShareButtonProps {
  guesses: GuessType[];
  variant?: keyof typeof theme;
}

function ShareButton({
  guesses,
  variant
}:ShareButtonProps) {
  const copyResult = React.useCallback(() => {
    navigator.clipboard.writeText(scoreToEmoji(guesses));
  }, [guesses]);

  return (
    <>
      <Button onClick={copyResult} variant={variant}>
        Copy results
      </Button>
    </>
  )
}

interface Props {
  didGuess: boolean;
  currentTry: number;
  todaysSolution: Song;
  guesses: GuessType[];
}

export function Result({
  didGuess,
  todaysSolution,
  guesses,
  currentTry,
}: Props) {
  const hoursToNextDay = Math.floor(
    (new Date(new Date().setHours(24, 0, 0, 0)).getTime() -
      new Date().getTime()) /
      1000 /
      60 /
      60
  );

  if (didGuess) {
    const textForTry = ["Perfect!", "Wow!", "Super!", "Congrats!", "Nice!"];
    return (
      <>
        <Styled.ResultTitle>{textForTry[currentTry - 1]}</Styled.ResultTitle>
        <Solution todaysSolution={todaysSolution} didGuess={didGuess} currentTry={currentTry} />
        <ShareButton guesses={guesses} variant="green" />
        <Styled.TimeToNext>
          Remember to come back in {hoursToNextDay} hours!
        </Styled.TimeToNext>
      </>
    );
  } else {
    return (
      <>
        <Styled.ResultTitle>Unfortunately, thats wrong.</Styled.ResultTitle>
        <Solution todaysSolution={todaysSolution} didGuess={didGuess} currentTry={currentTry} />
        <ShareButton guesses={guesses} variant="red" />
        <Styled.TimeToNext>
          Try again in {hoursToNextDay} hours.
        </Styled.TimeToNext>
      </>
    );
  }
}
