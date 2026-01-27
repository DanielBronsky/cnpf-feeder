'use client';

/**
 * /auth/login
 * Простая форма логина: отправляет POST на `/api/auth/login`.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Actions,
  Card,
  CloseButton,
  ErrorText,
  Form,
  Label,
  LabelText,
  LinkRow,
  PrimaryButton,
  Subtitle,
  Title,
  Wrap,
} from '../auth.styles';

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
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

    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });

      const data = await r.json().catch(() => ({}));
      if (!r.ok) setMsg(data?.error ?? 'Error');
      else window.location.href = '/';
    } finally {
      setLoading(false);
    }
  }

  return (
    <Wrap onClick={onClose}>
      <Card onClick={(e) => e.stopPropagation()}>
        <CloseButton type="button" aria-label="Закрыть" onClick={onClose}>
          ×
        </CloseButton>
        <Title>Вход</Title>
        <Subtitle>Email или никнейм + пароль.</Subtitle>

        <Form onSubmit={onSubmit}>
          <Label>
            <LabelText>Email или никнейм</LabelText>
            <input
              placeholder="you@example.com или username"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </Label>
          <Label>
            <LabelText>Пароль</LabelText>
            <input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Label>

          <Actions>
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? 'Входим...' : 'Войти'}
            </PrimaryButton>
            {msg ? <ErrorText>{msg}</ErrorText> : null}
          </Actions>
        </Form>

        <LinkRow>
          Нет аккаунта? <Link href="/auth/register">Регистрация</Link>
        </LinkRow>
      </Card>
    </Wrap>
  );
}

