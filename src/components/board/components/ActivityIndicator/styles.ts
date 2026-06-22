import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const ActivityBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const ActivitySpinner = styled.span`
  display: inline-flex;

  & svg {
    width: 0.875rem;
    height: 0.875rem;
    animation: ${spin} 0.7s linear infinite;
  }
`;
