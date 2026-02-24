'use client';

/**
 * /auth/reset-password?token=xxx
 * Установка нового пароля по ссылке из письма.
 */
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@apollo/client';

import { RESET_PASSWORD_MUTATION } from '@/lib/graphql/mutations';

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

const PASSWORD_MIN = 8;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [errs, setErrs] = useState<{ password?: string; confirm?: string }>({});
  const [success, setSuccess] = useState(false);
  const [resetMutation, { loading }] = useMutation(RESET_PASSWORD_MUTATION);

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

  useEffect(() => {
    if (!token) {
      setMsg({ type: 'error', text: 'Ссылка недействительна. Запросите новый сброс пароля.' });
    }
  }, [token]);

  function validate(): boolean {
    const e: { password?: string; confirm?: string } = {};
    if (password.length < PASSWORD_MIN) {
      e.password = `Пароль от ${PASSWORD_MIN} символов`;
    }
    if (password !== confirm) {
      e.confirm = 'Пароли не совпадают';
    }
    setErrs(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErrs({});

    if (!validate()) return;
    if (!token) return;

    try {
      const { data, errors } = await resetMutation({
        variables: { token, newPassword: password, confirmPassword: confirm },
      });

      if (errors) {
        setMsg({ type: 'error', text: errors[0]?.message ?? 'Ошибка' });
        return;
      }

      if (data?.resetPassword) {
        setSuccess(true);
      }
    } catch (err: unknown) {
      setMsg({ type: 'error', text: (err as Error)?.message ?? 'Ошибка' });
    }
  }

  if (success) {
    return (
      <Wrap onClick={onClose}>
        <Card onClick={(e) => e.stopPropagation()}>
          <CloseButton type="button" aria-label="Закрыть" onClick={onClose}>
            ×
          </CloseButton>
          <Title>Готово</Title>
          <OkText style={{ marginBottom: 16 }}>
            Пароль успешно изменён. Теперь можете войти с новым паролем.
          </OkText>
          <LinkRow style={{ marginTop: 16 }}>
            <Link href="/auth/login">Войти</Link>
          </LinkRow>
        </Card>
      </Wrap>
    );
  }

  return (
    <Wrap onClick={onClose}>
      <Card onClick={(e) => e.stopPropagation()}>
        <CloseButton type="button" aria-label="Закрыть" onClick={onClose}>
          ×
        </CloseButton>
        <Title>Новый пароль</Title>
        <Subtitle>Придумайте новый пароль и повторите его.</Subtitle>

        <Form onSubmit={onSubmit}>
          <Label>
            <LabelText>Новый пароль</LabelText>
            <input
              type="password"
              placeholder="минимум 8 символов"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrs((p) => ({ ...p, password: undefined }));
              }}
            />
            {errs.password && <ErrorText>{errs.password}</ErrorText>}
          </Label>
          <Label>
            <LabelText>Повторите пароль</LabelText>
            <input
              type="password"
              placeholder="повторите пароль"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                setErrs((p) => ({ ...p, confirm: undefined }));
              }}
            />
            {errs.confirm && <ErrorText>{errs.confirm}</ErrorText>}
          </Label>

          <Actions>
            <PrimaryButton type="submit" disabled={loading || !token}>
              {loading ? 'Сохраняем...' : 'Сохранить'}
            </PrimaryButton>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <Wrap>
        <Card>
          <Subtitle>Загрузка...</Subtitle>
        </Card>
      </Wrap>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
