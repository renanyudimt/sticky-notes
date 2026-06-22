import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const SpinnerIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  & svg {
    animation: ${spin} 0.7s linear infinite;
  }
`;
