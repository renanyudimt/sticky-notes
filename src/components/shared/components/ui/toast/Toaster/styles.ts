import styled, { css } from "styled-components";

import type { ToastType } from "../types";

export const ToastViewport = styled.ol`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: min(360px, calc(100vw - 2rem));
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const ToastItem = styled.li<{ $type: ToastType }>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 0.875rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid;
  box-shadow: ${({ theme }) => theme.shadow.lg};
  font-size: 0.875rem;
  font-weight: 500;

  ${({ theme, $type }) => {
    const surface = theme.toast[$type];
    return css`
      background: ${surface.bg};
      border-color: ${surface.border};
      color: ${surface.fg};
    `;
  }}
`;

export const ToastMessage = styled.span`
  flex: 1;
  line-height: 1.4;
  word-break: break-word;
`;

export const ToastClose = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin: -0.125rem -0.25rem 0 0;
  padding: 0.125rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: inherit;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 1;
  }

  & svg {
    width: 1rem;
    height: 1rem;
  }
`;
