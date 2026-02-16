'use client';

/**
 * /auth/register
 * Простая форма регистрации: отправляет POST на `/api/auth/register`.
 */
import { useEffect, useState, startTransition } from 'react';
import { AvatarCropper } from '@/components/AvatarCrooper/AvatarCropper';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useApolloClient } from '@apollo/client';

import { REGISTER_MUTATION } from '@/lib/graphql/mutations';

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
  const client = useApolloClient();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [avatarBlob, setAvatarBlob] = useState<Blob | null>(null);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [msg, setMsg] = useState<string>('');
  const [registerMutation, { loading }] = useMutation(REGISTER_MUTATION);

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
      // Prepare input with optional avatar
      const input: any = {
        email,
        username,
        password,
        passwordConfirm,
      };

      // Add avatar if provided
      if (avatarBlob) {
        // Convert Blob to File for GraphQL Upload
        const avatarFile = new File([avatarBlob], 'avatar.jpg', { type: 'image/jpeg' });
        input.avatar = avatarFile;
      }

      const { data, errors } = await registerMutation({
        variables: {
          input,
        },
      });

      if (errors) {
        setMsg(errors[0]?.message ?? 'Ошибка');
        return;
      }

      if (data?.register?.ok && data?.register?.token) {
        // Устанавливаем cookie через Frontend API route
        try {
          await fetch('/api/auth/set-cookie', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: data.register.token }),
            credentials: 'include',
          });
          
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
        setMsg('Ошибка регистрации');
      }
    } catch (error: any) {
      setMsg(error?.message ?? 'Ошибка');
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
