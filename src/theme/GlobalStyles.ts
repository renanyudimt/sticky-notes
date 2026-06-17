import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    height: 100%;
  }

  body {
    margin: 0;
    overflow: hidden;
    font-family: ${({ theme }) => theme.font.sans};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.foreground};
    -webkit-font-smoothing: antialiased;
  }

  button {
    font-family: inherit;
  }
`;
