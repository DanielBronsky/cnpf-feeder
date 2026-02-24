'use client';

/**
 * /auth/login
 * Простая форма логина: отправляет POST на `/api/auth/login`.
 */
import { useEffect, useState, startTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useApolloClient } from '@apollo/client';

import { LOGIN_MUTATION } from '@/lib/graphql/mutations';
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
  const client = useApolloClient();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string>('');
  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION);

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

    try {
      const { data, errors } = await loginMutation({
        variables: {
          input: { login, password },
        },
      });

      if (errors) {
        setMsg(errors[0]?.message ?? 'Ошибка');
        return;
      }

      if (data?.login?.ok && data?.login?.token) {
        // Устанавливаем cookie через Frontend API route
        // Это необходимо, так как cookie от Backend (localhost:4000) не доступна для Frontend (localhost:3000)
        try {
          console.log('Setting cookie with token:', data.login.token.substring(0, 20) + '...');
          const cookieResponse = await fetch('/api/auth/set-cookie', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: data.login.token }),
            credentials: 'include',
          });
          
          if (!cookieResponse.ok) {
            const errorData = await cookieResponse.json().catch(() => ({ error: 'Unknown error' }));
            console.error('Failed to set cookie:', errorData);
            setMsg('Ошибка установки cookie: ' + (errorData.error || 'Unknown error'));
            return;
          }
          
          console.log('Cookie set successfully, redirecting...');
          // Очищаем кэш Apollo Client перед редиректом
          await client.clearStore().catch(() => {});
          // Используем startTransition для отложенного обновления состояния и избежания проблем с гидратацией
          startTransition(() => {
            router.push('/');
            router.refresh();
          });
        } catch (cookieError) {
          console.error('Failed to set cookie:', cookieError);
          setMsg('Ошибка установки cookie');
        }
      } else {
        console.error('Login failed - no token:', data);
        setMsg('Ошибка входа: токен не получен');
      }
    } catch (error: any) {
      setMsg(error?.message ?? 'Ошибка');
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
          {' · '}
          <Link href="/auth/forgot-password">Забыли пароль?</Link>
        </LinkRow>
      </Card>
    </Wrap>
  );
}

