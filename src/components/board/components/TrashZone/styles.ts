import styled from "styled-components";

export const TrashRegion = styled.div<{ $active: boolean }>`
  pointer-events: none;
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 1.5rem;
  border: 2px dashed;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.15s ease;
  transform: ${({ $active }) =>
    $active ? "translateX(-50%) scale(1.1)" : "translateX(-50%)"};
  border-color: ${({ theme, $active }) =>
    $active
      ? theme.colors.destructive
      : `color-mix(in srgb, ${theme.colors.mutedForeground} 40%, transparent)`};
  background: ${({ theme, $active }) =>
    $active
      ? `color-mix(in srgb, ${theme.colors.destructive} 15%, transparent)`
      : `color-mix(in srgb, ${theme.colors.background} 70%, transparent)`};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.destructive : theme.colors.mutedForeground};
  backdrop-filter: blur(4px);

  & svg {
    width: 1.5rem;
    height: 1.5rem;
    animation: ${({ $active }) =>
      $active ? "trash-bounce 1s infinite" : "none"};
  }

  @keyframes trash-bounce {
    0%,
    100% {
      transform: translateY(-25%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: translateY(0);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }
`;
