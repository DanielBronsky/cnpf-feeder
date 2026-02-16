/**
 * src/app/feed/feed.styles.ts
 * Styled-components стили для главной ленты "Вести с водоёмов, отчёты".
 */
import styled from 'styled-components';
import { PrimaryButtonBase } from '@/components/Button/Button';

export const Wrap = styled.main`
  display: grid;
  gap: 18px;
`;

export const Hero = styled.section`
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: 22px 16px;
  border-radius: 22px;
  border: 1px solid var(--border);
  background:
    radial-gradient(
      900px 500px at 20% 10%,
      rgba(99, 102, 241, 0.2),
      transparent 60%
    ),
    radial-gradient(
      700px 420px at 90% 40%,
      rgba(20, 184, 166, 0.16),
      transparent 62%
    ),
    var(--surface-2);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(10px);
`;

export const HeroTitle = styled.h1`
  font-size: 30px;
  letter-spacing: -0.02em;
  margin: 0;
  text-align: center;
`;

export const HeroSubtitle = styled.p`
  margin: 0;
  opacity: 0.78;
  text-align: center;
`;

export const PrimaryButton = styled(PrimaryButtonBase)``;

export const GhostButton = styled.button`
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.92);
`;

export const DangerButton = styled.button`
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.92);
`;

export const List = styled.section`
  display: grid;
  gap: 14px;
`;

export const Card = styled.article`
  border-radius: 18px;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
`;

export const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
`;

export const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

export const Avatar = styled.img`
  width: 34px;
  height: 34px;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid var(--border);
  background: var(--input-bg);
`;

export const AvatarFallback = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.08);
`;

export const AuthorText = styled.div`
  display: grid;
  line-height: 1.1;
  min-width: 0;
`;

export const AuthorName = styled.div`
  font-weight: 800;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Meta = styled.div`
  font-size: 12px;
  opacity: 0.75;
`;

export const CardTitle = styled.h2`
  font-size: 18px;
  margin: 0 0 6px 0;
  letter-spacing: -0.01em;
`;

export const CardText = styled.p`
  margin: 0;
  opacity: 0.92;
  line-height: 1.5;
  white-space: pre-wrap;
`;

export const PhotosGrid = styled.div`
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Photo = styled.img`
  width: 120px;
  height: 120px;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 14px;
  border: 1px solid var(--border-soft);
  background: var(--input-bg);
  flex-shrink: 0;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 860px) {
    width: 100px;
    height: 100px;
  }

  @media (max-width: 520px) {
    width: 90px;
    height: 90px;
  }
`;

export const PhotoViewerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  display: grid;
  place-items: center;
  z-index: 100;
  padding: 20px;
`;

export const PhotoViewerContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PhotoViewerImage = styled.img`
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
`;

export const PhotoViewerClose = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.5);
  color: rgba(255, 255, 255, 0.95);
  cursor: pointer;
  line-height: 1;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
  z-index: 101;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: scale(1.1);
  }
`;

export const PhotoViewerNav = styled.button<{
  $left?: boolean;
  $right?: boolean;
}>`
  position: absolute;
  top: 50%;
  ${({ $left }) => ($left ? 'left: 20px;' : '')}
  ${({ $right }) => ($right ? 'right: 20px;' : '')}
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  padding: 0;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.5);
  color: rgba(255, 255, 255, 0.95);
  cursor: pointer;
  line-height: 1;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
  z-index: 101;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: translateY(-50%) scale(1.1);
  }
`;

export const PhotoViewerCounter = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.6);
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  z-index: 101;
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const ErrorText = styled.div`
  color: var(--danger);
  font-size: 13px;
`;

export const OkText = styled.div`
  color: var(--success);
  font-size: 13px;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  z-index: 99999;
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 16px 12px;
  }

  @media (max-width: 520px) {
    padding: 12px 8px;
  }
`;

export const ModalCard = styled.section`
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 22px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  padding: 32px;
  position: relative;
  z-index: 100000;
  box-shadow: 0 20px 70px rgba(0, 0, 0, 0.9);
  margin: auto;

  @media (max-width: 768px) {
    padding: 24px 20px;
    border-radius: 18px;
    max-height: 95vh;
    max-width: 95%;
  }

  @media (max-width: 520px) {
    padding: 20px 16px;
    border-radius: 16px;
    max-width: 100%;
  }
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
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const Form = styled.form`
  display: grid;
  gap: 12px;

  input:not([type='checkbox']):not([type='radio']),
  textarea {
    width: 100%;
    outline: none;
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease,
      background 0.15s ease;
    background: var(--input-bg);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 14px 16px;
    border-radius: 12px;
    font-size: 15px;
  }

  input:not([type='checkbox']):not([type='radio']):focus,
  textarea:focus {
    border-color: var(--focus);
    box-shadow: 0 0 0 4px var(--focus-ring);
    background: var(--input-bg-focus);
  }

  textarea {
    resize: vertical;
    min-height: 220px;
  }
`;

export const Label = styled.label`
  display: grid;
  gap: 10px;
  min-width: 0;
  margin-bottom: 4px;
`;

export const LabelText = styled.span`
  font-size: 13px;
  opacity: 0.82;
  margin-bottom: 2px;
  display: block;
`;

export const Input = styled.input`
  width: 100%;
  outline: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s ease;
  background: var(--input-bg);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 14px 16px;
  border-radius: 12px;
  font-size: 15px;

  &:focus {
    border-color: var(--focus);
    box-shadow: 0 0 0 4px var(--focus-ring);
    background: var(--input-bg-focus);
  }
`;

export const FieldError = styled.div<{ $visible?: boolean }>`
  color: var(--danger);
  font-size: 12px;
  line-height: 1.2;
  min-height: 14px;
  margin-top: 2px;
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
`;

export const PhotosPickRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
`;

export const ThumbGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;

  @media (max-width: 860px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 520px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const ThumbWrap = styled.div`
  position: relative;
`;

export const Thumb = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 14px;
  object-fit: cover;
  border: 1px solid var(--border);
  background: var(--input-bg);
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
`;

export const ThumbRemove = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.3);
  color: rgba(255, 255, 255, 0.92);
  line-height: 1;
`;

export const Divider = styled.div`
  position: relative;
  height: 1px;
  margin: 32px 0;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--border) 20%,
      var(--border) 80%,
      transparent 100%
    );
  }

  &::after {
    content: '';
    position: absolute;
    top: -1px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 3px;
    background: linear-gradient(
      90deg,
      rgba(99, 102, 241, 0.4) 0%,
      rgba(139, 92, 246, 0.4) 50%,
      rgba(99, 102, 241, 0.4) 100%
    );
    border-radius: 2px;
    box-shadow: 0 0 12px rgba(99, 102, 241, 0.3);
  }
`;

export const SectionHeader = styled.div`
  border-radius: 20px;
  border: 1px solid var(--border);
  background:
    linear-gradient(
      135deg,
      rgba(139, 92, 246, 0.15) 0%,
      rgba(99, 102, 241, 0.12) 50%,
      transparent 100%
    ),
    linear-gradient(225deg, rgba(236, 72, 153, 0.1) 0%, transparent 60%),
    radial-gradient(ellipse at top, rgba(99, 102, 241, 0.08), transparent 70%),
    var(--surface-2);
  padding: 28px 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      rgba(139, 92, 246, 0.6),
      rgba(99, 102, 241, 0.6),
      rgba(236, 72, 153, 0.6),
      rgba(139, 92, 246, 0.6)
    );
    background-size: 200% 100%;
    animation: shimmer 3s ease-in-out infinite;
  }

  @keyframes shimmer {
    0%,
    100% {
      background-position: 0% 0%;
    }
    50% {
      background-position: 100% 0%;
    }
  }
`;

export const SectionTitle = styled.h2`
  font-size: 26px;
  font-weight: 900;
  letter-spacing: -0.02em;
  margin: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.85) 50%,
    rgba(255, 255, 255, 0.75) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 1;
`;

export const SectionDescription = styled.p`
  margin: 0;
  font-size: 15px;
  opacity: 0.78;
  line-height: 1.5;
  max-width: 600px;
  position: relative;
  z-index: 1;
`;
