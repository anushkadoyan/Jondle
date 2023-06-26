import React from "react";
import { IoHeart } from "react-icons/io5";

import * as Styled from "./index.styled";

export function Footer() {
  return (
    <footer>
      <Styled.Text>
        Made with <IoHeart /> by{" "}
        <Styled.Link href="https://epicwolverine.com">
          EpicWolverine
        </Styled.Link>
        {" "}based on the work of{" "}
        <Styled.Link href="https://twitter.com/synowski_maciej">
          Maciej Synowski
        </Styled.Link>
      </Styled.Text>
    </footer>
  );
}
