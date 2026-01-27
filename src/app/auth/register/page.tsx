'use client';

/**
 * /auth/register
 * Простая форма регистрации: отправляет POST на `/api/auth/register`.
 */
import { useEffect, useState } from 'react';
import { AvatarCropper } from '@/components/AvatarCrooper/AvatarCropper';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Actions,
  Card,
  CloseButton,
  Form,
  Label,
  LabelText,
  LinkRow,
  OkText,
  PrimaryButton,
  Row2,
  Subtitle,
  Title,
  Wrap,
  ErrorText,
} from '../auth.styles';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [avatarBlob, setAvatarBlob] = useState<Blob | null>(null);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [msg, setMsg] = useState<string>('');
  const [loading, setLoading] = useState(false);

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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    setLoading(true);

    const fd = new FormData();
    fd.set('email', email);
    fd.set('username', username);
    fd.set('password', password);
    fd.set('passwordConfirm', passwordConfirm);
    if (avatarBlob) {
      fd.set(
        'avatar',
        new File([avatarBlob], 'avatar.jpg', {
          type: avatarBlob.type || 'image/jpeg',
        }),
      );
    }

    try {
      const r = await fetch('/api/auth/register', { method: 'POST', body: fd });

      const data = await r.json().catch(() => ({}));
      if (!r.ok) setMsg(data?.error ?? 'Error');
      else router.push('/');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Wrap onClick={onClose}>
      <Card onClick={(e) => e.stopPropagation()}>
        <CloseButton type='button' aria-label='Закрыть' onClick={onClose}>
          ×
        </CloseButton>
        <Title>Регистрация</Title>
        <Subtitle>Создай аккаунт и загрузи аватар (по желанию).</Subtitle>

        <Form onSubmit={onSubmit}>
          <Row2>
            <Label>
              <LabelText>Email</LabelText>
              <input
                placeholder='you@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Label>
            <Label>
              <LabelText>Никнейм</LabelText>
              <input
                placeholder='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Label>
          </Row2>

          <Label>
            <LabelText>Аватар (опционально)</LabelText>
            <AvatarCropper value={avatarBlob} onChange={setAvatarBlob} />
          </Label>

          <Row2>
            <Label>
              <LabelText>Пароль</LabelText>
              <input
                placeholder='min 8'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Label>
            <Label>
              <LabelText>Повтори пароль</LabelText>
              <input
                placeholder='repeat'
                type='password'
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </Label>
          </Row2>

          <Actions>
            <PrimaryButton type='submit' disabled={loading}>
              {loading ? 'Создаём...' : 'Создать аккаунт'}
            </PrimaryButton>
            {msg ? (
              msg.startsWith('Готово') ? (
                <OkText>{msg}</OkText>
              ) : (
                <ErrorText>{msg}</ErrorText>
              )
            ) : null}
          </Actions>
        </Form>

        <LinkRow>
          Уже есть аккаунт? <Link href='/auth/login'>Войти</Link>
        </LinkRow>
      </Card>
    </Wrap>
  );
}
