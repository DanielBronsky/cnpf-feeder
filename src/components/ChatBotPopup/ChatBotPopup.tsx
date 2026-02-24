'use client';

/**
 * Popup чат-бота: overlay + крестик + клик вне области закрывает.
 */
import { useEffect } from 'react';
import { ChatBot } from '@/components/ChatBot';
import { Overlay, PopupCard, CloseButton, ChatWrapper } from './ChatBotPopup.styles';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function ChatBotPopup({ isOpen, onClose }: Props) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose} role="dialog" aria-label="Чат-помощник">
      <PopupCard onClick={(e) => e.stopPropagation()}>
        <CloseButton type="button" aria-label="Закрыть" onClick={onClose}>
          ×
        </CloseButton>
        <ChatWrapper>
          <ChatBot compact />
        </ChatWrapper>
      </PopupCard>
    </Overlay>
  );
}
