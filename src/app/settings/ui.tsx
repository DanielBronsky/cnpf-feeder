'use client';

/**
 * /settings UI (client)
 * - обновление username + avatar (multipart)
 * - смена пароля
 */

import { useMemo, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';

import {
  UPDATE_PROFILE_MUTATION,
  UPDATE_PASSWORD_MUTATION,
} from '@/lib/graphql/mutations';
import {
  AvatarCropper,
  type AvatarCropperHandle,
} from '@/components/AvatarCrooper/AvatarCropper';
import {
  Actions,
  AvatarFallback,
  AvatarImg,
  AvatarRow,
  DangerButton,
  ErrorText,
  FieldError,
  HelpText,
  Label,
  LabelText,
  OkText,
  PrimaryButton,
  Row2,
  Section,
  SectionTitle,
} from './settings.styles';

type InitialUser = {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
  hasAvatar: boolean;
};

export function SettingsClient({ initialUser }: { initialUser: InitialUser }) {
  const cropperRef = useRef<AvatarCropperHandle | null>(null);
  const [username, setUsername] = useState(initialUser.username);
  const [avatarBlob, setAvatarBlob] = useState<Blob | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);

  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pwErrCurrent, setPwErrCurrent] = useState('');
  const [pwErrNew, setPwErrNew] = useState('');
  const [pwErrConfirm, setPwErrConfirm] = useState('');

  const [updateProfileMutation, { loading: savingProfile }] = useMutation(
    UPDATE_PROFILE_MUTATION,
  );
  const [updatePasswordMutation, { loading: savingPassword }] = useMutation(
    UPDATE_PASSWORD_MUTATION,
  );

  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  const normalizedUsername = useMemo(
    () => username.trim().toLowerCase(),
    [username],
  );
  const usernameChanged = normalizedUsername !== initialUser.username;
  const avatarChanged =
    Boolean(avatarBlob) || (removeAvatar && initialUser.hasAvatar);
  const profileDirty = usernameChanged || avatarChanged;

  const avatarUrl = useMemo(() => {
    if (removeAvatar) return null;
    if (avatarBlob) return URL.createObjectURL(avatarBlob);
    return initialUser.hasAvatar ? `/api/user/avatar/${initialUser.id}` : null;
  }, [avatarBlob, initialUser.hasAvatar, initialUser.id, removeAvatar]);

  const passwordDirty = Boolean(pwCurrent || pwNew || pwConfirm);

  async function saveProfile() {
    setErr('');
    setOk('');

    if (!profileDirty) {
      setOk('Нечего сохранять');
      return;
    }

    try {
      // Note: Avatar upload not supported in GraphQL yet, using REST for now
      if (avatarBlob) {
        // Fallback to REST for file upload
        const fd = new FormData();
        fd.set('username', normalizedUsername);
        fd.set('removeAvatar', removeAvatar ? '1' : '0');
        fd.set(
          'avatar',
          new File([avatarBlob], 'avatar.jpg', {
            type: avatarBlob.type || 'image/jpeg',
          }),
        );

        const r = await fetch('/api/user/me', { method: 'PATCH', body: fd });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data?.error ?? 'Error');
        setOk('Профиль обновлён');
        window.location.reload();
      } else {
        // Use GraphQL for username/removeAvatar
        const { errors } = await updateProfileMutation({
          variables: {
            input: {
              username: usernameChanged ? normalizedUsername : undefined,
              removeAvatar:
                removeAvatar && initialUser.hasAvatar ? true : undefined,
            },
          },
        });

        if (errors) {
          throw new Error(errors[0]?.message ?? 'Error');
        }

        setOk('Профиль обновлён');
        window.location.reload();
      }
    } catch (e: any) {
      setErr(e?.message ?? 'Error');
    }
  }

  async function savePassword() {
    setErr('');
    setOk('');
    setPwErrCurrent('');
    setPwErrNew('');
    setPwErrConfirm('');

    // Если вообще ничего не заполнено — просто не шлём запрос.
    if (!passwordDirty) return;

    if (!pwCurrent.trim()) {
      setPwErrCurrent('Введите текущий пароль');
      return;
    }
    if (pwNew.length < 8) {
      setPwErrNew('Новый пароль должен быть минимум 8 символов');
      return;
    }
    if (pwNew !== pwConfirm) {
      setPwErrConfirm('Пароли не совпадают');
      return;
    }
    if (pwNew === pwCurrent) {
      setPwErrNew('Новый пароль должен отличаться от текущего');
      return;
    }

    try {
      const { errors } = await updatePasswordMutation({
        variables: {
          oldPassword: pwCurrent,
          newPassword: pwNew,
        },
      });

      if (errors) {
        throw new Error(errors[0]?.message ?? 'Error');
      }

      setOk('Пароль обновлён');
      setPwCurrent('');
      setPwNew('');
      setPwConfirm('');
    } catch (e: any) {
      setErr(e?.message ?? 'Error');
    }
  }

  return (
    <>
      <Section>
        <SectionTitle>Профиль</SectionTitle>

        <Row2>
          <Label>
            <LabelText>Email</LabelText>
            <input value={initialUser.email} disabled />
          </Label>
          <Label>
            <LabelText>Никнейм</LabelText>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='username'
            />
          </Label>
        </Row2>

        <Label>
          <LabelText>Аватар</LabelText>
          <AvatarRow>
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <AvatarImg src={avatarUrl} alt='avatar' />
            ) : (
              <AvatarFallback />
            )}

            <PrimaryButton
              type='button'
              onClick={() => {
                setRemoveAvatar(false);
                cropperRef.current?.open();
              }}
            >
              Выбрать фото
            </PrimaryButton>

            <DangerButton
              type='button'
              disabled={!removeAvatar && !initialUser.hasAvatar && !avatarBlob}
              onClick={() => {
                // Делаем ровно две кнопки: "Выбрать фото" и "Удалить аватар" (вторую можно нажать повторно как отмену)
                setAvatarBlob(null);
                cropperRef.current?.reset();
                setRemoveAvatar((v) => !v);
              }}
            >
              {removeAvatar ? 'Отмена' : 'Удалить аватар'}
            </DangerButton>
          </AvatarRow>

          <HelpText>Изменения применятся после “Сохранить профиль”.</HelpText>

          <div style={{ marginTop: 10 }}>
            <AvatarCropper
              ref={cropperRef}
              mode='embedded'
              value={avatarBlob}
              onChange={(b) => {
                setAvatarBlob(b);
                setRemoveAvatar(false);
              }}
            />
          </div>
        </Label>

        <Actions>
          <PrimaryButton
            type='button'
            disabled={savingProfile || !profileDirty}
            onClick={saveProfile}
          >
            {savingProfile ? 'Сохраняю...' : 'Сохранить профиль'}
          </PrimaryButton>
        </Actions>
      </Section>

      <Section>
        <SectionTitle>Смена пароля</SectionTitle>

        <Row2>
          <Label>
            <LabelText>Текущий пароль</LabelText>
            <input
              type='password'
              value={pwCurrent}
              onChange={(e) => setPwCurrent(e.target.value)}
            />
            <FieldError $visible={Boolean(pwErrCurrent)}>
              {pwErrCurrent || ' '}
            </FieldError>
          </Label>
          <div />
        </Row2>
        <Row2>
          <Label>
            <LabelText>Новый пароль</LabelText>
            <input
              type='password'
              value={pwNew}
              onChange={(e) => setPwNew(e.target.value)}
            />
            <FieldError $visible={Boolean(pwErrNew)}>
              {pwErrNew || ' '}
            </FieldError>
          </Label>
          <Label>
            <LabelText>Повтори новый пароль</LabelText>
            <input
              type='password'
              value={pwConfirm}
              onChange={(e) => setPwConfirm(e.target.value)}
            />
            <FieldError $visible={Boolean(pwErrConfirm)}>
              {pwErrConfirm || ' '}
            </FieldError>
          </Label>
        </Row2>

        <Actions>
          <PrimaryButton
            type='button'
            disabled={savingPassword || !passwordDirty}
            onClick={savePassword}
          >
            {savingPassword ? 'Сохраняю...' : 'Обновить пароль'}
          </PrimaryButton>
        </Actions>
      </Section>

      {err ? <ErrorText>{err}</ErrorText> : null}
      {ok ? <OkText>{ok}</OkText> : null}
    </>
  );
}
