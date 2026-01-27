/**
 * src/app/auth/auth.styles.ts
 * Styled-components стили для страниц /auth/login и /auth/register.
 *
 * Требование: у компонента рядом лежит файл со стилями.
 */

import styled from 'styled-components';
import { PrimaryButtonBase } from '@/components/Button/Button';

export const Wrap = styled.div`
  display: grid;
  place-items: center;
  min-height: calc(100vh - 64px);
  padding: 24px 16px;
  background:
    radial-gradient(1200px 600px at 20% 0%, rgba(99, 102, 241, 0.22), transparent 55%),
    radial-gradient(900px 500px at 90% 10%, rgba(20, 184, 166, 0.18), transparent 55%),
    radial-gradient(900px 500px at 50% 90%, rgba(255, 255, 255, 0.08), transparent 60%);
`;

export const Card = styled.section`
  width: 100%;
  max-width: 560px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  padding: 22px;
  position: relative;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.55),
    0 1px 0 rgba(255, 255, 255, 0.06) inset;
  backdrop-filter: blur(12px);
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text);
  cursor: pointer;
  line-height: 1;
  font-size: 18px;

  &:hover {
    background: rgba(255, 255, 255, 0.10);
  }
`;

export const Title = styled.h1`
  font-size: 30px;
  letter-spacing: -0.02em;
  margin: 0 0 6px 0;
`;

export const Subtitle = styled.p`
  opacity: 0.78;
  margin: 0 0 18px 0;
  line-height: 1.45;
`;

export const Form = styled.form`
  display: grid;
  gap: 14px;

  input {
    width: 100%;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    background: var(--input-bg);
    border: 1px solid var(--border);
    color: var(--text);
  }

  input::placeholder {
    color: rgba(255, 255, 255, 0.45);
  }

  input:focus {
    border-color: var(--focus);
    box-shadow: 0 0 0 4px var(--focus-ring);
    background: var(--input-bg-focus);
  }
`;

export const Row2 = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const Label = styled.label`
  display: grid;
  gap: 8px;
`;

export const LabelText = styled.span`
  font-size: 13px;
  opacity: 0.82;
  letter-spacing: 0.01em;
`;

export const Actions = styled.div`
  margin-top: 6px;
  display: grid;
  gap: 10px;
`;

export const PrimaryButton = styled(PrimaryButtonBase)`
  width: 100%;
`;

export const ErrorText = styled.div`
  color: var(--danger);
  font-size: 13px;
`;

export const OkText = styled.div`
  color: var(--success);
  font-size: 13px;
`;

export const LinkRow = styled.div`
  margin-top: 12px;
  font-size: 13px;
  opacity: 0.85;

  a {
    text-decoration: underline;
  }
`;

