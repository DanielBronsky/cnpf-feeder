'use client';

/**
 * /admin/reports UI (client)
 * Рендерит таблицу отчётов и позволяет редактировать/удалять их.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { REPORTS_QUERY, REPORT_QUERY } from '@/lib/graphql/queries';
import { UPDATE_REPORT_MUTATION, DELETE_REPORT_MUTATION } from '@/lib/graphql/mutations';

import {
  CloseButton,
  DangerButton,
  ErrorText,
  FieldError,
  Form,
  GhostButton,
  Label,
  LabelText,
  ModalCard,
  ModalOverlay,
  OkText,
  Photo,
  PhotosGrid,
  PhotosPickRow,
  PrimaryButton,
  Thumb,
  ThumbGrid,
  ThumbRemove,
  ThumbWrap,
} from '@/app/feed/feed.styles';
import {
  AdminContainer,
  AdminTableWrapper,
  AdminTable,
  AdminTableHeader,
  AdminTableHeaderRow,
  AdminTableHeaderCell,
  AdminTableBody,
  AdminTableRow,
  AdminTableCell,
  AdminActionsContainer,
  AdminRefreshButtonContainer,
  AdminStats,
  AdminAuthorCell,
  ModalActionsContainer,
} from '@/components/Admin';
import {
  LoadingMessage,
  ModalTitle,
  ModalDescription,
  HiddenFileInput,
  PhotoCounter,
} from '@/components/Feed';

type Report = {
  id: string;
  title: string;
  text: string;
  createdAt?: string;
  updatedAt?: string;
  author: { id: string; username: string; hasAvatar: boolean; avatarUrl: string | null };
  photos: Array<{ url: string }>;
  canEdit: boolean;
};

function fmtDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' });
}

export function AdminReportsClient() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [err, setErr] = useState<string>('');
  const [ok, setOk] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // GraphQL queries
  const { data, loading, error, refetch } = useQuery(REPORTS_QUERY, {
    variables: { limit: 100 },
  });
  
  const rows: Report[] = data?.reports || [];
  
  const [updateReportMutation] = useMutation(UPDATE_REPORT_MUTATION, {
    refetchQueries: [{ query: REPORTS_QUERY, variables: { limit: 100 } }],
  });
  
  const [deleteReportMutation] = useMutation(DELETE_REPORT_MUTATION, {
    refetchQueries: [{ query: REPORTS_QUERY, variables: { limit: 100 } }],
  });
  
  // Handle error from useQuery - use useEffect to avoid calling setState during render
  useEffect(() => {
    if (error) {
      setErr(error.message);
    }
  }, [error]);

  // modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Report | null>(null);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [titleErr, setTitleErr] = useState('');
  const [textErr, setTextErr] = useState('');

  // photos (existing urls + new Files)
  const [existingPhotos, setExistingPhotos] = useState<Array<{ url: string; idx: number }>>([]);
  const [removedIdx, setRemovedIdx] = useState<Set<number>>(new Set());
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const newPreviews = useMemo(() => newFiles.map((f) => ({ file: f, url: URL.createObjectURL(f) })), [newFiles]);
  useEffect(() => {
    return () => {
      newPreviews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [newPreviews]);

  // Data is loaded via useQuery hook

  async function openEdit(report: Report) {
    setOk('');
    setErr('');
    setTitleErr('');
    setTextErr('');
    // Use data from cache (already loaded via REPORTS_QUERY)
    setEditing(report);
    setTitle(report.title);
    setText(report.text);
    setExistingPhotos(report.photos.map((p, idx) => ({ url: p.url, idx })));
    setRemovedIdx(new Set());
    setNewFiles([]);
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    if (open) {
      window.addEventListener('keydown', onKeyDown);
      // Блокируем прокрутку страницы когда модальное окно открыто
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open]);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const next = [...newFiles];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith('image/')) continue;
      next.push(f);
    }
    const existingCount = existingPhotos.filter((p) => !removedIdx.has(p.idx)).length;
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
    const remainingExisting = existingPhotos.filter((p) => !removedIdx.has(p.idx)).length;
    if (remainingExisting + newFiles.length > 10) {
      setErr('Можно максимум 10 фото');
      bad = true;
    }
    if (bad) return;

    if (!editing) return;

    try {
      // Note: Photo upload not supported in GraphQL yet, using REST for now
      if (newFiles.length > 0) {
        // Fallback to REST for file upload
        const fd = new FormData();
        fd.set('title', t);
        fd.set('text', body);
        removedIdx.forEach((i) => fd.append('removePhoto', String(i)));
        newFiles.forEach((f) => fd.append('photos', f));
        
        const r = await fetch(`/api/reports/${editing.id}`, {
          method: 'PATCH',
          body: fd,
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data?.error ?? 'Error');
      } else {
        // Use GraphQL for text updates
        const removePhoto = Array.from(removedIdx);
        const { errors } = await updateReportMutation({
          variables: {
            id: editing.id,
            input: {
              title: t,
              text: body,
              removePhoto: removePhoto.length > 0 ? removePhoto : undefined,
              removeAllPhotos: existingPhotos.length === removedIdx.size ? true : undefined,
            },
          },
        });
        
        if (errors) {
          throw new Error(errors[0]?.message ?? 'Error');
        }
      }

      setOk('Отчёт обновлён');
      closeModal();
      await refetch();
    } catch (e: any) {
      setErr(e?.message ?? 'Error');
    }
  }

  async function onDelete(id: string) {
    if (!confirm('Удалить этот отчёт?')) return;
    setErr('');
    setOk('');
    setDeletingId(id);
    try {
      const { errors } = await deleteReportMutation({
        variables: { id },
      });
      
      if (errors) {
        throw new Error(errors[0]?.message ?? 'Failed to delete');
      }
      
      setOk('Отчёт удалён');
      await refetch();
    } catch (e: any) {
      setErr(e?.message ?? 'Error');
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <LoadingMessage />;
  if (err && !open) return <ErrorText>{err}</ErrorText>;

  return (
    <AdminContainer>
      {ok && !open ? <OkText>{ok}</OkText> : null}
      {err && !open ? <ErrorText>{err}</ErrorText> : null}

      <AdminStats count={rows.length} label="Всего отчётов" />
      <AdminTableWrapper>
        <AdminTable>
          <AdminTableHeader>
            <AdminTableHeaderRow>
              <AdminTableHeaderCell>Автор</AdminTableHeaderCell>
              <AdminTableHeaderCell>Заголовок</AdminTableHeaderCell>
              <AdminTableHeaderCell>Дата</AdminTableHeaderCell>
              <AdminTableHeaderCell>Фото</AdminTableHeaderCell>
              <AdminTableHeaderCell>Действия</AdminTableHeaderCell>
            </AdminTableHeaderRow>
          </AdminTableHeader>
          <AdminTableBody>
            {rows.map((r) => (
              <AdminTableRow key={r.id}>
                <AdminTableCell>
                  <AdminAuthorCell author={r.author} />
                </AdminTableCell>
                <AdminTableCell $maxWidth={300}>{r.title}</AdminTableCell>
                <AdminTableCell $opacity={0.9} $fontSize={13}>
                  {fmtDate(r.updatedAt || r.createdAt)}
                </AdminTableCell>
                <AdminTableCell $opacity={0.9}>{r.photos?.length || 0}</AdminTableCell>
                <AdminTableCell>
                  <AdminActionsContainer>
                    <GhostButton type="button" onClick={() => openEdit(r)} style={{ fontSize: 13, padding: '6px 12px' }}>
                      Редактировать
                    </GhostButton>
                    <DangerButton
                      type="button"
                      onClick={() => onDelete(r.id)}
                      disabled={deletingId === r.id}
                      style={{ fontSize: 13, padding: '6px 12px' }}
                    >
                      {deletingId === r.id ? '...' : 'Удалить'}
                    </DangerButton>
                  </AdminActionsContainer>
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>
      </AdminTableWrapper>

      <AdminRefreshButtonContainer>
        <button type="button" onClick={() => refetch()}>
          Обновить список
        </button>
      </AdminRefreshButtonContainer>

      {open && editing ? (
        <ModalOverlay onClick={closeModal}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <CloseButton type="button" aria-label="Закрыть" onClick={closeModal}>
              ×
            </CloseButton>

            <ModalTitle>Редактировать отчёт</ModalTitle>
            <ModalDescription>Заголовок, текст и до 10 фото.</ModalDescription>

            {err ? <ErrorText>{err}</ErrorText> : null}
            {ok ? <OkText>{ok}</OkText> : null}

            <Form onSubmit={onSave}>
              <Label>
                <LabelText>Заголовок</LabelText>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Например: Лёд сошёл, клёв отличный" />
                <FieldError $visible={Boolean(titleErr)}>{titleErr || ' '}</FieldError>
              </Label>

              <Label>
                <LabelText>Текст</LabelText>
                <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Опиши место, погоду, снасти, результат..." />
                <FieldError $visible={Boolean(textErr)}>{textErr || ' '}</FieldError>
              </Label>

              <Label>
                <LabelText>Фото</LabelText>
                <PhotosPickRow>
                  <HiddenFileInput
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    onChange={(e) => addFiles(e.target.files)}
                  />
                  <GhostButton type="button" onClick={() => fileInputRef.current?.click()}>
                    Добавить фото
                  </GhostButton>
                  <PhotoCounter
                    current={existingPhotos.filter((p) => !removedIdx.has(p.idx)).length + newFiles.length}
                    max={10}
                  />
                </PhotosPickRow>

                {(existingPhotos.length > 0 || newFiles.length > 0) && (
                  <ThumbGrid style={{ marginTop: 12 }}>
                    {existingPhotos
                      .filter((p) => !removedIdx.has(p.idx))
                      .map((p) => (
                        <ThumbWrap key={`existing-${p.idx}`}>
                          <Thumb src={p.url} alt="photo" />
                          <ThumbRemove type="button" onClick={(e) => removeExisting(p.idx, e)} aria-label="Удалить">
                            ×
                          </ThumbRemove>
                        </ThumbWrap>
                      ))}
                    {newPreviews.map((p, i) => (
                      <ThumbWrap key={`new-${i}`}>
                        <Thumb src={p.url} alt="preview" />
                        <ThumbRemove type="button" onClick={(e) => removeNew(i, e)} aria-label="Удалить">
                          ×
                        </ThumbRemove>
                      </ThumbWrap>
                    ))}
                  </ThumbGrid>
                )}
              </Label>

              <ModalActionsContainer>
                <PrimaryButton type="submit">Сохранить</PrimaryButton>
                <GhostButton type="button" onClick={closeModal}>
                  Отмена
                </GhostButton>
              </ModalActionsContainer>
            </Form>
          </ModalCard>
        </ModalOverlay>
      ) : null}
    </AdminContainer>
  );
}
