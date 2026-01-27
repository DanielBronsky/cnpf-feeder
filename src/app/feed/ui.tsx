'use client';

/**
 * src/app/feed/ui.tsx
 * Клиентский UI главной страницы:
 * - лента отчётов
 * - добавление/редактирование отчёта через pop-up
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Actions,
  Author,
  AuthorName,
  AuthorText,
  Avatar,
  AvatarFallback,
  Card,
  CardText,
  CardTitle,
  CardTop,
  CloseButton,
  DangerButton,
  Divider,
  ErrorText,
  FieldError,
  Form,
  GhostButton,
  Hero,
  HeroSubtitle,
  HeroTitle,
  Label,
  LabelText,
  List,
  Meta,
  ModalCard,
  ModalOverlay,
  OkText,
  Photo,
  PhotoViewerClose,
  PhotoViewerContainer,
  PhotoViewerCounter,
  PhotoViewerImage,
  PhotoViewerNav,
  PhotoViewerOverlay,
  PhotosGrid,
  PhotosPickRow,
  PrimaryButton,
  SectionDescription,
  SectionHeader,
  SectionTitle,
  Thumb,
  ThumbGrid,
  ThumbRemove,
  ThumbWrap,
  Wrap,
} from './feed.styles';
import {
  LoadingMessage,
  EmptyState,
  MoreReportsCard,
  ModalTitle,
  ModalDescription,
  HiddenFileInput,
  PhotoCounter,
  NoMediaMessage,
  Breadcrumbs,
  BackButton,
} from '@/components/Feed';
import { CompetitionsSection } from '@/components/Competition/CompetitionsSection';

type Me = { id: string; isAdmin: boolean } | null;

type Report = {
  id: string;
  title: string;
  text: string;
  createdAt?: string;
  updatedAt?: string;
  author: {
    id: string;
    username: string;
    hasAvatar: boolean;
    avatarUrl: string | null;
  };
  photos: Array<{ url: string }>;
  canEdit: boolean;
};

function fmtDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString();
}

export function FeedClient({
  me,
  showAll = false,
  limit,
}: {
  me: Me;
  showAll?: boolean;
  limit?: number;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [items, setItems] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [competitions, setCompetitions] = useState<any[]>([]);

  // photo viewer modal
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerPhotos, setViewerPhotos] = useState<Array<{ url: string }>>([]);
  const [viewerIndex, setViewerIndex] = useState(0);

  // modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Report | null>(null);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [titleErr, setTitleErr] = useState('');
  const [textErr, setTextErr] = useState('');

  // photos (existing urls + new Files)
  const [existingPhotos, setExistingPhotos] = useState<
    Array<{ url: string; idx: number }>
  >([]);
  const [removedIdx, setRemovedIdx] = useState<Set<number>>(new Set());
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const newPreviews = useMemo(
    () => newFiles.map((f) => ({ file: f, url: URL.createObjectURL(f) })),
    [newFiles],
  );
  useEffect(() => {
    return () => {
      newPreviews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [newPreviews]);

  async function load() {
    setErr('');
    setOk('');
    setLoading(true);
    try {
      const url = limit ? `/api/reports?limit=${limit}` : '/api/reports';
      const r = await fetch(url, { cache: 'no-store' });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error ?? 'Failed to load');
      setItems(data.reports ?? []);
    } catch (e: any) {
      setErr(e?.message ?? 'Error');
    } finally {
      setLoading(false);
    }
  }

  async function loadCompetitions() {
    try {
      const r = await fetch('/api/competitions', { cache: 'no-store' });
      const data = await r.json().catch(() => ({}));
      if (r.ok) {
        setCompetitions(data.competitions ?? []);
      }
    } catch (e: any) {
      // Игнорируем ошибки загрузки соревнований
    }
  }

  useEffect(() => {
    void load();
    void loadCompetitions();
  }, []);

  function openCreate() {
    if (!me) {
      router.push('/auth/login');
      return;
    }
    setOk('');
    setErr('');
    setEditing(null);
    setTitle('');
    setText('');
    setTitleErr('');
    setTextErr('');
    setExistingPhotos([]);
    setRemovedIdx(new Set());
    setNewFiles([]);
    setOpen(true);
  }

  async function openEdit(id: string) {
    setOk('');
    setErr('');
    setTitleErr('');
    setTextErr('');
    try {
      const r = await fetch(`/api/reports/${id}`, { cache: 'no-store' });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error ?? 'Failed to load report');
      const rep = data.report as any;
      const fromList = items.find((x) => x.id === id) ?? null;
      setEditing(fromList);
      setTitle(String(rep.title ?? ''));
      setText(String(rep.text ?? ''));
      const photos = rep.photos || [];
      setExistingPhotos(
        photos.map((p: any, idx: number) => ({
          url: p.url,
          idx,
        })),
      );
      setRemovedIdx(new Set());
      setNewFiles([]);
      setOpen(true);
    } catch (e: any) {
      setErr(e?.message ?? 'Error');
    }
  }

  function closeModal() {
    setOpen(false);
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    if (open) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const next = [...newFiles];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith('image/')) continue;
      next.push(f);
    }
    // лимит: до 10 фото на отчёт суммарно
    const existingCount = existingPhotos.filter(
      (p) => !removedIdx.has(p.idx),
    ).length;
    const trimmed = next.slice(0, Math.max(0, 10 - existingCount));
    setNewFiles(trimmed);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removeExisting(idx: number, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setRemovedIdx((prev) => new Set(prev).add(idx));
  }

  function removeNew(i: number, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setNewFiles((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setOk('');
    setTitleErr('');
    setTextErr('');

    const t = title.trim();
    const body = text.trim();
    let bad = false;
    if (t.length < 3) {
      setTitleErr('Заголовок минимум 3 символа');
      bad = true;
    }
    if (body.length < 1) {
      setTextErr('Текст обязателен');
      bad = true;
    }
    const remainingExisting = existingPhotos.filter(
      (p) => !removedIdx.has(p.idx),
    ).length;
    if (remainingExisting + newFiles.length > 10) {
      setErr('Можно максимум 10 фото');
      bad = true;
    }
    if (bad) return;

    try {
      const fd = new FormData();
      fd.set('title', t);
      fd.set('text', body);
      removedIdx.forEach((i) => fd.append('removePhoto', String(i)));
      newFiles.forEach((f) => fd.append('photos', f));

      const r = await fetch(
        editing ? `/api/reports/${editing.id}` : '/api/reports',
        {
          method: editing ? 'PATCH' : 'POST',
          body: fd,
        },
      );
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error ?? 'Error');

      setOk(editing ? 'Отчёт обновлён' : 'Отчёт добавлен');
      closeModal();
      await load();
    } catch (e: any) {
      setErr(e?.message ?? 'Error');
    }
  }

  async function onDelete(id: string) {
    setErr('');
    setOk('');
    try {
      const r = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error ?? 'Failed to delete');
      setOk('Отчёт удалён');
      await load();
    } catch (e: any) {
      setErr(e?.message ?? 'Error');
    }
  }

  function openPhotoViewer(photos: Array<{ url: string }>, startIndex: number) {
    setViewerPhotos(photos);
    setViewerIndex(startIndex);
    setViewerOpen(true);
  }

  function closePhotoViewer() {
    setViewerOpen(false);
  }

  function nextPhoto() {
    setViewerIndex((prev) => (prev + 1) % viewerPhotos.length);
  }

  function prevPhoto() {
    setViewerIndex(
      (prev) => (prev - 1 + viewerPhotos.length) % viewerPhotos.length,
    );
  }

  useEffect(() => {
    if (!viewerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setViewerOpen(false);
        return;
      }
      if (e.key === 'ArrowLeft') {
        setViewerIndex(
          (prev) => (prev - 1 + viewerPhotos.length) % viewerPhotos.length,
        );
      }
      if (e.key === 'ArrowRight') {
        setViewerIndex((prev) => (prev + 1) % viewerPhotos.length);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [viewerOpen, viewerPhotos.length]);

  const displayedItems = limit ? items.slice(0, limit) : items;
  // На главной странице (когда есть limit и не showAll) всегда показываем кнопку "Еще"
  const showMoreButton = limit && !showAll;

  return (
    <Wrap>
      {showAll && (
        <>
          <BackButton href='/' />
          <Breadcrumbs
            items={[
              { label: 'Главная', href: '/' },
              { label: 'Все отчёты' },
            ]}
          />
        </>
      )}
      <Hero>
        <HeroTitle>Вести с водоёмов, отчёты</HeroTitle>
        <HeroSubtitle>
          {showAll
            ? 'Лента отчётов пользователей. Добавляй свой отчёт с фото (до 10).'
            : 'Последние отчёты пользователей. Добавляй свой отчёт с фото (до 10).'}
        </HeroSubtitle>
        <PrimaryButton type='button' onClick={openCreate}>
          Добавить отчёт
        </PrimaryButton>
      </Hero>

      {err ? <ErrorText>{err}</ErrorText> : null}
      {ok ? <OkText>{ok}</OkText> : null}

      {loading ? <LoadingMessage /> : null}

      {!loading ? (
        <>
          <List>
            {displayedItems.map((r) => (
              <Card key={r.id}>
                <CardTop>
                  <Author>
                    {r.author.hasAvatar && r.author.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <Avatar src={r.author.avatarUrl} alt='avatar' />
                    ) : (
                      <AvatarFallback />
                    )}
                    <AuthorText>
                      <AuthorName>{r.author.username}</AuthorName>
                      <Meta>{fmtDate(r.updatedAt || r.createdAt)}</Meta>
                    </AuthorText>
                  </Author>

                  {r.canEdit ? (
                    <Actions>
                      <GhostButton type='button' onClick={() => openEdit(r.id)}>
                        Редактировать
                      </GhostButton>
                      <DangerButton
                        type='button'
                        onClick={() => onDelete(r.id)}
                      >
                        Удалить
                      </DangerButton>
                    </Actions>
                  ) : null}
                </CardTop>

                <CardTitle>{r.title}</CardTitle>
                <CardText>{r.text}</CardText>

                {r.photos?.length ? (
                  <PhotosGrid>
                    {r.photos.map((p, idx) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <Photo
                        key={`${r.id}-${idx}`}
                        src={p.url}
                        alt='photo'
                        onClick={() => openPhotoViewer(r.photos || [], idx)}
                      />
                    ))}
                  </PhotosGrid>
                ) : null}
              </Card>
            ))}
            {!displayedItems.length ? <EmptyState /> : null}
          </List>

          {showMoreButton ? (
            <MoreReportsCard onMoreClick={() => router.push('/feed')} />
          ) : null}

          <Divider />

          <CompetitionsSection competitions={competitions} />
        </>
      ) : null}

      {open ? (
        <ModalOverlay onClick={closeModal}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <CloseButton
              type='button'
              aria-label='Закрыть'
              onClick={closeModal}
            >
              ×
            </CloseButton>

            <ModalTitle>
              {editing ? 'Редактировать отчёт' : 'Добавить отчёт'}
            </ModalTitle>
            <ModalDescription>
              Заголовок, текст и до 10 фото. Редактировать может автор или
              админ.
            </ModalDescription>

            <Form onSubmit={onSave}>
              <Label>
                <LabelText>Заголовок</LabelText>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='Например: Лёд сошёл, клёв отличный'
                />
                <FieldError $visible={Boolean(titleErr)}>
                  {titleErr || ' '}
                </FieldError>
              </Label>

              <Label>
                <LabelText>Текст</LabelText>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder='Опиши место, погоду, снасти, результат...'
                />
                <FieldError $visible={Boolean(textErr)}>
                  {textErr || ' '}
                </FieldError>
              </Label>

              <Label>
                <LabelText>Медиафайлы (до 10)</LabelText>
                <PhotosPickRow>
                  <HiddenFileInput
                    ref={fileInputRef}
                    accept='image/*'
                    multiple
                    onChange={(e) => addFiles(e.target.files)}
                  />
                  <PrimaryButton
                    type='button'
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Добавить фото
                  </PrimaryButton>
                  <GhostButton
                    type='button'
                    onClick={() => {
                      setNewFiles([]);
                      setRemovedIdx(new Set(existingPhotos.map((p) => p.idx)));
                    }}
                    disabled={!existingPhotos.length && !newFiles.length}
                  >
                    Удалить все
                  </GhostButton>
                  <PhotoCounter
                    current={
                      existingPhotos.filter((p) => !removedIdx.has(p.idx))
                        .length + newFiles.length
                    }
                    max={10}
                  />
                </PhotosPickRow>

                {existingPhotos.length || newFiles.length ? (
                  <ThumbGrid>
                    {existingPhotos
                      .filter((p) => !removedIdx.has(p.idx))
                      .map((p) => (
                        <ThumbWrap key={`ex-${p.idx}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <Thumb src={p.url} alt='photo' />
                          <ThumbRemove
                            type='button'
                            aria-label='Удалить'
                            onClick={(e) => removeExisting(p.idx, e)}
                          >
                            ×
                          </ThumbRemove>
                        </ThumbWrap>
                      ))}
                    {newPreviews.map((p, i) => (
                      <ThumbWrap key={`new-${i}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <Thumb src={p.url} alt='photo' />
                        <ThumbRemove
                          type='button'
                          aria-label='Удалить'
                          onClick={(e) => removeNew(i, e)}
                        >
                          ×
                        </ThumbRemove>
                      </ThumbWrap>
                    ))}
                  </ThumbGrid>
                ) : (
                  <NoMediaMessage />
                )}
              </Label>

              <Actions>
                <PrimaryButton type='submit'>
                  {editing ? 'Сохранить изменения' : 'Сохранить отчёт'}
                </PrimaryButton>
                <GhostButton type='button' onClick={closeModal}>
                  Отмена
                </GhostButton>
              </Actions>
            </Form>
          </ModalCard>
        </ModalOverlay>
      ) : null}

      {viewerOpen && viewerPhotos.length > 0 ? (
        <PhotoViewerOverlay onClick={closePhotoViewer}>
          <PhotoViewerContainer onClick={(e) => e.stopPropagation()}>
            <PhotoViewerClose
              type='button'
              aria-label='Закрыть'
              onClick={closePhotoViewer}
            >
              ×
            </PhotoViewerClose>

            {viewerPhotos.length > 1 ? (
              <>
                <PhotoViewerNav
                  type='button'
                  aria-label='Предыдущее фото'
                  $left
                  onClick={prevPhoto}
                >
                  ‹
                </PhotoViewerNav>
                <PhotoViewerNav
                  type='button'
                  aria-label='Следующее фото'
                  $right
                  onClick={nextPhoto}
                >
                  ›
                </PhotoViewerNav>
                <PhotoViewerCounter>
                  {viewerIndex + 1} / {viewerPhotos.length}
                </PhotoViewerCounter>
              </>
            ) : null}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <PhotoViewerImage
              src={viewerPhotos[viewerIndex]?.url}
              alt={`Фото ${viewerIndex + 1} из ${viewerPhotos.length}`}
            />
          </PhotoViewerContainer>
        </PhotoViewerOverlay>
      ) : null}
    </Wrap>
  );
}
