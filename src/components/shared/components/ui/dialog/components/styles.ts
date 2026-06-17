import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgb(0 0 0 / 0.5);
  animation: dialog-fade-in 0.15s ease;

  @keyframes dialog-fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const Content = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 50;
  display: grid;
  gap: 1rem;
  width: 100%;
  max-width: 32rem;
  padding: 1.5rem;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.foreground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  outline: none;
  animation: dialog-zoom-in 0.15s ease;

  @keyframes dialog-zoom-in {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: inherit;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.15s ease, background 0.15s ease;

  &:hover {
    opacity: 1;
    background: ${({ theme }) => theme.colors.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.ring};
    outline-offset: 2px;
  }

  & svg {
    width: 1rem;
    height: 1rem;
    pointer-events: none;
  }
`;

export const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;

  @media (min-width: 640px) {
    text-align: left;
  }
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 0.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: flex-end;
  }
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 1.125rem;
  line-height: 1;
  font-weight: 600;
`;

export const Description = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;
