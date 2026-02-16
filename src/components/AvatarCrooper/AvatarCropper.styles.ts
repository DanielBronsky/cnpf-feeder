/**
 * src/components/AvatarCropper.styles.ts
 * Styled-components стили для AvatarCropper.
 */

import styled from 'styled-components';

export const Wrap = styled.div`
  display: grid;
  gap: 12px;
  position: relative;
`;

export const Row = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

export const Button = styled.button<{ $variant?: 'primary' | 'ghost' }>`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: ${({ $variant }) =>
    $variant === 'primary' ? '#ffffff' : $variant === 'ghost' ? 'transparent' : 'rgba(255, 255, 255, 0.06)'};
  color: ${({ $variant }) => ($variant === 'primary' ? '#000000' : 'inherit')};
  cursor: pointer;
  font-weight: ${({ $variant }) => ($variant === 'primary' ? 600 : 500)};

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const PreviewImg = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid var(--border);
`;

export const PreviewFallback = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--border);
`;

export const ErrorText = styled.div`
  color: var(--danger);
`;

export const CropBlock = styled.div`
  display: grid;
  gap: 12px;
`;

export const CropArea = styled.div`
  position: relative;
  width: 100%;
  max-width: 440px;
  height: 260px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.04);
`;

export const ZoomLabel = styled.label`
  display: grid;
  gap: 8px;
  max-width: 440px;
`;

export const ZoomTitle = styled.span`
  opacity: 0.8;
`;

export const ActionsRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

