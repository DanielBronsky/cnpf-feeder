'use client';

/**
 * Плавающая кнопка помощника в правом нижнем углу.
 * По клику открывает popup с чат-ботом.
 */
import { useState } from 'react';
import styled from 'styled-components';
import { ChatBotPopup } from '@/components/ChatBotPopup';

const Wrap = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  cursor: pointer;
  box-shadow:
    0 4px 20px rgba(99, 102, 241, 0.45),
    0 0 0 0 rgba(99, 102, 241, 0.4);
  animation: chat-pulse 2s ease-in-out infinite;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.08);
    box-shadow:
      0 6px 28px rgba(99, 102, 241, 0.5),
      0 0 0 8px rgba(99, 102, 241, 0.15);
  }

  svg {
    width: 28px;
    height: 28px;
  }

  @keyframes chat-pulse {
    0%,
    100% {
      box-shadow:
        0 4px 20px rgba(99, 102, 241, 0.45),
        0 0 0 0 rgba(99, 102, 241, 0.35);
    }
    50% {
      box-shadow:
        0 4px 24px rgba(99, 102, 241, 0.55),
        0 0 0 12px rgba(99, 102, 241, 0);
    }
  }

  @media (max-width: 520px) {
    bottom: 20px;
    right: 20px;
    width: 52px;
    height: 52px;

    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

export function ChatAssistantButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Wrap
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Открыть чат-помощник"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </Wrap>
      <ChatBotPopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
