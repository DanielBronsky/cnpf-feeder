/**
 * src/app/admin/competitions/competitions.styles.ts
 * Styled-components стили для страницы соревнований.
 */
import styled from 'styled-components';

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

  &::placeholder {
    color: rgba(255, 255, 255, 0.45);
  }
`;

export const Textarea = styled.textarea`
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
  resize: vertical;
  min-height: 200px;
  font-family: inherit;

  &:focus {
    border-color: var(--focus);
    box-shadow: 0 0 0 4px var(--focus-ring);
    background: var(--input-bg-focus);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.45);
  }
`;

export const DateTimeInput = styled.input`
  width: 100%;
  outline: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s ease;
  background: var(--input-bg);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 15px;

  &:focus {
    border-color: var(--focus);
    box-shadow: 0 0 0 4px var(--focus-ring);
    background: var(--input-bg-focus);
  }

  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
    opacity: 0.7;
    cursor: pointer;
  }

  &::-webkit-datetime-edit-text,
  &::-webkit-datetime-edit-month-field,
  &::-webkit-datetime-edit-day-field,
  &::-webkit-datetime-edit-year-field {
    color: var(--text);
  }
`;

export const DateTimeRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

export const DateDisplay = styled.div`
  margin-top: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-soft);
  font-size: 14px;
  opacity: 0.9;
`;

export const ToursSection = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-soft);
`;

export const AddTourButton = styled.button`
  margin-top: 12px;
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text);
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const RemoveTourButton = styled.button`
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(255, 77, 77, 0.15);
  color: rgba(255, 77, 77, 0.9);
  cursor: pointer;
  font-size: 13px;
  white-space: nowrap;
  transition: background 0.2s ease;
  align-self: flex-end;

  @media (max-width: 640px) {
    align-self: stretch;
    width: 100%;
  }

  &:hover {
    background: rgba(255, 77, 77, 0.25);
  }
`;

export const FormatSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 4px;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-soft);
  cursor: pointer;
  user-select: none;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--border);
  }

  span {
    flex: 1;
    line-height: 1.5;
    order: 1;
  }
`;

export const Checkbox = styled.input`
  width: 20px !important;
  height: 20px;
  flex-shrink: 0;
  cursor: pointer;
  accent-color: var(--focus);
  order: 2;
`;

export const FormatDisplay = styled.div`
  margin-top: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
`;

export const InputWithSuffix = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  ${Input} {
    flex: 1;
  }

  span {
    font-size: 15px;
    opacity: 0.8;
    white-space: nowrap;
  }

  @media (max-width: 520px) {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;

    span {
      text-align: center;
      padding: 8px 0;
    }
  }
`;

export const ErrorText = styled.div`
  color: var(--danger);
  font-size: 13px;
  margin-bottom: 8px;
`;

export const GhostButton = styled.button`
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.92);
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const CompetitionsList = styled.div`
  display: grid;
  gap: 16px;
  margin-top: 24px;
`;

export const CompetitionCard = styled.div`
  border-radius: 18px;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
`;

export const CompetitionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
`;

export const CompetitionTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 20px 0;
  letter-spacing: -0.01em;
  text-align: center;
  position: relative;
  padding-bottom: 16px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(99, 102, 241, 0.5) 20%,
      rgba(139, 92, 246, 0.5) 50%,
      rgba(99, 102, 241, 0.5) 80%,
      transparent 100%
    );
    border-radius: 2px;
  }
`;

export const CompetitionMeta = styled.div`
  display: grid;
  gap: 10px;
  flex: 1;
`;

export const MetaRow = styled.div`
  display: flex;
  gap: 12px;
  font-size: 14px;
  align-items: flex-start;
  align-items: center;
`;

export const MetaLabel = styled.span`
  opacity: 0.75;
  min-width: 200px;
  font-weight: 500;
  flex-shrink: 0;
`;

export const MetaValue = styled.span`
  opacity: 0.9;
  font-weight: 500;
  flex: 1;
`;

export const CompetitionActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

export const CompetitionInfo = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-soft);
`;

export const InfoRow = styled.div`
  display: flex;
  gap: 12px;
  font-size: 14px;
  align-items: center;
`;

export const InfoLabel = styled.span`
  opacity: 0.75;
  min-width: 200px;
  font-weight: 500;
  flex-shrink: 0;
`;

export const InfoValue = styled.span`
  opacity: 0.9;
  font-weight: 500;
  flex: 1;
  word-break: break-word;
`;

export const FormatBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 10px;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  font-size: 13px;
  font-weight: 600;
  margin-right: 8px;
  margin-bottom: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(99, 102, 241, 0.2);
    border-color: rgba(99, 102, 241, 0.4);
    transform: translateY(-1px);
  }
`;

export const InfoBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border);
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--border-soft);
  }
`;

export const DateBadge = styled(InfoBadge)`
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.12) 0%,
    rgba(99, 102, 241, 0.08) 100%
  );
  border-color: rgba(139, 92, 246, 0.25);
  color: rgba(255, 255, 255, 0.95);
`;

export const LocationBadge = styled(InfoBadge)`
  background: linear-gradient(
    135deg,
    rgba(20, 184, 166, 0.12) 0%,
    rgba(14, 165, 233, 0.08) 100%
  );
  border-color: rgba(20, 184, 166, 0.25);
  color: rgba(255, 255, 255, 0.95);
`;

export const ClosingBadge = styled(InfoBadge)`
  background: linear-gradient(
    135deg,
    rgba(236, 72, 153, 0.12) 0%,
    rgba(219, 39, 119, 0.08) 100%
  );
  border-color: rgba(236, 72, 153, 0.25);
  color: rgba(255, 255, 255, 0.95);
`;

export const TourBadge = styled(InfoBadge)`
  background: linear-gradient(
    135deg,
    rgba(251, 191, 36, 0.12) 0%,
    rgba(245, 158, 11, 0.08) 100%
  );
  border-color: rgba(251, 191, 36, 0.25);
  color: rgba(255, 255, 255, 0.95);
  margin-right: 8px;
`;

export const FeeBadge = styled(InfoBadge)`
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.12) 0%,
    rgba(22, 163, 74, 0.08) 100%
  );
  border-color: rgba(34, 197, 94, 0.25);
  color: rgba(255, 255, 255, 0.95);
`;

export const LimitBadge = styled(InfoBadge)`
  background: linear-gradient(
    135deg,
    rgba(168, 85, 247, 0.12) 0%,
    rgba(147, 51, 234, 0.08) 100%
  );
  border-color: rgba(168, 85, 247, 0.25);
  color: rgba(255, 255, 255, 0.95);
`;

export const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

export const Regulations = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-soft);
`;

export const RegulationsHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  opacity: 0.9;
  transition: opacity 0.2s ease;
  text-align: left;

  &:hover {
    opacity: 1;
  }
`;

export const RegulationsTitle = styled.span`
  font-weight: 600;
`;

export const RegulationsToggle = styled.span<{ $isOpen: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
  font-size: 13px;
  font-weight: 500;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  ${RegulationsHeader}:hover & {
    opacity: 1;
  }
`;

export const ArrowIcon = styled.span<{ $isOpen: boolean }>`
  display: inline-block;
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};

  &::before {
    content: '▼';
    display: block;
    font-size: 10px;
    line-height: 16px;
    text-align: center;
  }
`;

export const RegulationsContent = styled.div<{ $isOpen: boolean }>`
  max-height: ${({ $isOpen }) => ($isOpen ? '2000px' : '0')};
  overflow: hidden;
  transition:
    max-height 0.3s ease,
    margin-top 0.3s ease,
    opacity 0.3s ease;
  margin-top: ${({ $isOpen }) => ($isOpen ? '12px' : '0')};
  opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
`;

export const RegulationsText = styled.div`
  opacity: 0.85;
  line-height: 1.6;
  white-space: pre-wrap;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.03);
  padding: 14px;
  border-radius: 10px;
  border: 1px solid var(--border-soft);
`;

export const LoadingMessage = styled.div`
  padding: 40px 20px;
  text-align: center;
  opacity: 0.7;
`;

export const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  opacity: 0.7;
  border-radius: 18px;
  border: 1px solid var(--border);
  background: var(--surface-2);
`;
