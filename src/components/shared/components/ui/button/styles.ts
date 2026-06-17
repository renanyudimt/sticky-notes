import styled, { css } from "styled-components";

import type { ButtonSize, ButtonVariant } from "./types";

const withAlpha = (color: string, percent: number) =>
  `color-mix(in srgb, ${color} ${percent}%, transparent)`;

const VARIANTS: Record<ButtonVariant, ReturnType<typeof css>> = {
  default: css`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primaryForeground};
    box-shadow: ${({ theme }) => theme.shadow.xs};

    &:hover:not(:disabled) {
      background: ${({ theme }) => withAlpha(theme.colors.primary, 90)};
    }
  `,
  destructive: css`
    background: ${({ theme }) => theme.colors.destructive};
    color: #ffffff;
    box-shadow: ${({ theme }) => theme.shadow.xs};

    &:hover:not(:disabled) {
      background: ${({ theme }) => withAlpha(theme.colors.destructive, 90)};
    }
  `,
  outline: css`
    border: 1px solid ${({ theme }) => theme.colors.border};
    /* In dark mode the page, bar and background token are all near-black, so a
       background-colored outline button vanishes; lift it onto an elevated
       surface there while keeping the light theme unchanged. */
    background: ${({ theme }) =>
      theme.mode === "dark" ? theme.colors.secondary : theme.colors.background};
    box-shadow: ${({ theme }) => theme.shadow.xs};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.accent};
      color: ${({ theme }) => theme.colors.accentForeground};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.secondaryForeground};
    box-shadow: ${({ theme }) => theme.shadow.xs};

    &:hover:not(:disabled) {
      background: ${({ theme }) => withAlpha(theme.colors.secondary, 80)};
    }
  `,
  ghost: css`
    background: transparent;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.accent};
      color: ${({ theme }) => theme.colors.accentForeground};
    }
  `,
  link: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.primary};
    text-underline-offset: 4px;

    &:hover:not(:disabled) {
      text-decoration: underline;
    }
  `,
};

const SIZES: Record<ButtonSize, ReturnType<typeof css>> = {
  default: css`
    height: 2.25rem;
    padding: 0.5rem 1rem;
  `,
  sm: css`
    height: 2rem;
    gap: 0.375rem;
    padding: 0 0.75rem;
  `,
  lg: css`
    height: 2.5rem;
    padding: 0 1.5rem;
  `,
  icon: css`
    height: 2.25rem;
    width: 2.25rem;
    padding: 0;
  `,
};

export const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-shrink: 0;
  white-space: nowrap;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  /* Native <button> doesn't inherit color (browsers pin it to a system default),
     so ghost/outline variants — which set no base color — would render black in
     both themes. Inherit the themed foreground; colored variants override below. */
  color: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.ring};
    box-shadow: 0 0 0 3px ${({ theme }) => withAlpha(theme.colors.ring, 50)};
  }

  & svg {
    pointer-events: none;
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  ${({ $variant }) => VARIANTS[$variant]}
  ${({ $size }) => SIZES[$size]}
`;
