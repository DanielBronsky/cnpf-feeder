/**
 * src/app/settings/settings.styles.ts
 * Styled-components стили для страницы /settings.
 */

import styled from 'styled-components';
import { PrimaryButtonBase } from '@/components/Button/Button';

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(8px);
  display: grid;
  place-items: center;
  padding: 24px 16px;
  z-index: 50;
`;

export const ModalCard = styled.section`
  width: 100%;
  max-width: 820px;
  border-radius: 22px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  padding: 20px;
  position: relative;
  box-shadow: 0 20px 70px rgba(0, 0, 0, 0.60);
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

export const Wrap = styled.main`
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 16px;
`;

export const Card = styled.section`
  max-width: 720px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  padding: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(10px);
`;

export const Title = styled.h1`
  font-size: 28px;
  letter-spacing: -0.02em;
  margin: 0 0 6px 0;
`;

export const Subtitle = styled.p`
  margin: 0 0 16px 0;
  opacity: 0.78;
`;

export const Section = styled.div`
  display: grid;
  gap: 12px;
  padding: 14px 0;
  border-top: 1px solid var(--border-soft);
`;

export const SectionTitle = styled.h2`
  font-size: 14px;
  letter-spacing: 0.01em;
  margin: 0;
  opacity: 0.9;
`;

export const Row2 = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const Label = styled.label`
  display: grid;
  gap: 8px;
  min-width: 0;
`;

export const LabelText = styled.span`
  font-size: 13px;
  opacity: 0.82;
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const AvatarRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

export const AvatarImg = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
`;

export const AvatarFallback = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
`;

export const HelpText = styled.div`
  font-size: 12px;
  opacity: 0.75;
`;

export const PrimaryButton = styled(PrimaryButtonBase)``;

export const DangerButton = styled.button`
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.12);
`;

export const ErrorText = styled.div`
  color: var(--danger);
  font-size: 13px;
`;

export const OkText = styled.div`
  color: var(--success);
  font-size: 13px;
`;

export const FieldError = styled.div<{ $visible?: boolean }>`
  color: var(--danger);
  font-size: 12px;
  line-height: 1.2;
  min-height: 14px;
  margin-top: 2px;
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
`;

