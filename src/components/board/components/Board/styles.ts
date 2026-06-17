import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const BoardLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const BoardSurface = styled.div`
  position: relative;
  isolation: isolate;
  flex: 1 1 0%;
  overflow: hidden;
  cursor: crosshair;
  background-color: ${({ theme }) => theme.colors.background};
  background-image: radial-gradient(
    rgba(120, 120, 135, 0.18) 1px,
    transparent 1px
  );
  background-size: 24px 24px;
`;

export const BoardOverlay = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const BoardLoading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

export const Spinner = styled.span`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.foreground};
  animation: ${spin} 0.7s linear infinite;
`;

export const BoardHint = styled.p`
  max-width: 20rem;
  margin: 0;
  text-align: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const BoardError = styled.p`
  margin: 0;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid
    ${({ theme }) => `color-mix(in srgb, ${theme.colors.destructive} 40%, transparent)`};
  background: ${({ theme }) => `color-mix(in srgb, ${theme.colors.destructive} 10%, transparent)`};
  color: ${({ theme }) => theme.colors.destructive};
`;
