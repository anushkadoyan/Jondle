import React from "react";

import { GuessType, GuessState } from "../../types/guess";

import * as Styled from "./index.styled";

interface Props {
  guess: GuessType;
  active: boolean;
}

export function Guess({ guess, active }: Props) {
  const { song, state } = guess;
  const [text, setText] = React.useState<string>("");

  React.useEffect(() => {
    if (song) {
      setText(`${song.artist} - ${song.name}`);
    } else if (state === GuessState.Skipped) {
      setText("Skipped");
    } else {
      setText("");
    }
  }, [guess]);

  return (
    <Styled.Container active={active} state={state}>
      <Styled.Text>{text}</Styled.Text>
    </Styled.Container>
  );
}
