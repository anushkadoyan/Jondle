import styled from "styled-components";

import { GuessState } from "../../types/guess";

export const Container = styled.div<{
  active: boolean;
  state: GuessState | undefined;
}>`
  width: 100%;
  height: 45px;

  margin: 5px auto;

  display: flex;
  align-items: center;

  border-color: ${({ theme, active, state }) => {
    if (active) {
      return theme.border;
    } else if (state === GuessState.PartiallyCorrect) {
      return theme.yellow;
    } else if (state === GuessState.Incorrect) {
      return theme.red;
    } else {
      return theme.border100;
    }
  }};
  border-width: 1px;
  border-radius: 5px;
  border-style: solid;

  color: ${({ theme }) => theme.text};
`;

export const Text = styled.p`
  width: 100%;
  height: max-content;

  padding: 0px 10px;

  font-size: 1rem;
  color: ${({ theme }) => theme.text};
`;
