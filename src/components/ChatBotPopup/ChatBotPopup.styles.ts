/**
 * Popup для чат-бота: overlay + карточка с крестиком.
 */
import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 24px;

  @media (max-width: 520px) {
    padding: 16px;
    align-items: stretch;
    justify-content: center;
  }
`;

export const PopupCard = styled.div`
  position: relative;
  width: 420px;
  max-width: 100%;
  height: 560px;
  max-height: calc(100vh - 48px);
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--surface-2);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 520px) {
    width: 100%;
    height: 70vh;
    max-height: calc(100vh - 32px);
  }
`;

export const ChatWrapper = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.08);
  color: var(--text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  line-height: 1;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;
