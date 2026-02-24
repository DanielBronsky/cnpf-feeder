'use client';

/**
 * /auth/forgot-password
 * Запрос письма для сброса пароля.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';

import { REQUEST_PASSWORD_RESET_MUTATION } from '@/lib/graphql/mutations';

import {
  Actions,
  Card,
  CloseButton,
  ErrorText,
  Form,
  Label,
  LabelText,
  LinkRow,
  OkText,
  PrimaryButton,
  Subtitle,
  Title,
  Wrap,
} from '../auth.styles';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [requestReset, { loading }] = useMutation(REQUEST_PASSWORD_RESET_MUTATION);

  function onClose() {
    router.push('/');
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    try {
      const { data, errors } = await requestReset({
        variables: { email },
      });

      if (errors) {
        setMsg({ type: 'error', text: errors[0]?.message ?? 'Ошибка' });
        return;
      }

      if (data?.requestPasswordReset) {
        setMsg({
          type: 'ok',
          text: 'Если email зарегистрирован, вы получите письмо со ссылкой для сброса пароля.',
        });
      }
    } catch (err: unknown) {
      setMsg({ type: 'error', text: (err as Error)?.message ?? 'Ошибка' });
    }
  }

  return (
    <Wrap onClick={onClose}>
      <Card onClick={(e) => e.stopPropagation()}>
        <CloseButton type="button" aria-label="Закрыть" onClick={onClose}>
          ×
        </CloseButton>
        <Title>Сброс пароля</Title>
        <Subtitle>Введите email — мы отправим ссылку для создания нового пароля.</Subtitle>

        <Form onSubmit={onSubmit}>
          <Label>
            <LabelText>Email</LabelText>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Label>

          <Actions>
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? 'Отправляем...' : 'Отправить'}
            </PrimaryButton>
            {msg?.type === 'ok' && <OkText>{msg.text}</OkText>}
            {msg?.type === 'error' && <ErrorText>{msg.text}</ErrorText>}
          </Actions>
        </Form>

        <LinkRow>
          <Link href="/auth/login">Вернуться к входу</Link>
        </LinkRow>
      </Card>
    </Wrap>
  );
}
