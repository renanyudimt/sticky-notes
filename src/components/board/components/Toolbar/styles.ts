import styled from "styled-components";

export const ToolbarBar = styled.header`
  display: flex;
  height: 3.5rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => `color-mix(in srgb, ${theme.colors.background} 80%, transparent)`};
  backdrop-filter: blur(4px);
`;

export const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const ToolbarTitleGroup = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
`;

export const ToolbarTitle = styled.h1`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: -0.01em;
`;

export const ToolbarCount = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const SegmentGroup = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.125rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.muted};
`;

export const SegmentButton = styled.button<{ $active: boolean }>`
  padding: 0.25rem 0.625rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.background : "transparent"};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.foreground : theme.colors.mutedForeground};
  box-shadow: ${({ theme, $active }) => ($active ? theme.shadow.sm : "none")};
  transition: color 0.15s ease, background 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.foreground};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.ring};
    outline-offset: 1px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
