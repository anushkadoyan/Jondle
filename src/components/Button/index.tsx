import React, { CSSProperties } from "react";

import * as Styled from "./index.styled";
import { theme } from "../../constants";

interface Props {
  style?: CSSProperties;
  variant?: keyof typeof theme;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ onClick, style, variant, children, disabled }: Props) {
  return (
    <Styled.Button
      onClick={onClick}
      variant={variant}
      style={style}
      disabled={disabled}
    >
      {children}
    </Styled.Button>
  );
}
