'use client';

/**
 * src/app/settings/modal.tsx
 * Делает /settings pop-up: закрытие по крестику, клику вне окна и Escape.
 * Закрытие НЕ сохраняет изменения (сохранение только по кнопкам внутри форм).
 */
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { SettingsClient } from './ui';
import { CloseButton, ModalCard, ModalOverlay, Subtitle, Title } from './settings.styles';

type InitialUser = {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
  hasAvatar: boolean;
};

export function SettingsModal({ initialUser }: { initialUser: InitialUser }) {
  const router = useRouter();

  function onClose() {
    router.push('/');
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <CloseButton type="button" aria-label="Закрыть" onClick={onClose}>
          ×
        </CloseButton>
        <Title>Настройки</Title>
        <Subtitle>Никнейм, аватар и пароль.</Subtitle>
        <SettingsClient initialUser={initialUser} />
      </ModalCard>
    </ModalOverlay>
  );
}

