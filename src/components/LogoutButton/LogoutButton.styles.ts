/**
 * src/components/LogoutButton.styles.ts
 * Styled-components стили для LogoutButton.
 */

import styled from 'styled-components';

export const Button = styled.button`
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.06);
  color: inherit;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

