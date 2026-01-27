/**
 * src/components/Button/Button.styles.ts
 * Единые кнопки для всего приложения (styled-components).
 *
 * Цель: чтобы "PrimaryButton" везде выглядел одинаково.
 */
import styled from 'styled-components';

export const PrimaryButtonBase = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 14px;

  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(230, 230, 230, 0.96) 100%);
  color: #0a0a0a;
  font-weight: 900;
  letter-spacing: -0.01em;
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.28);
  transition: transform 0.06s ease, filter 0.12s ease;
  font-size: 14px;

  @media (max-width: 520px) {
    padding: 10px 14px;
    font-size: 13px;
  }

  &:hover {
    filter: brightness(1.03);
  }

  &:active {
    transform: translateY(1px);
  }
`;
