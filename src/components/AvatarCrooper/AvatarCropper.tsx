'use client';

/**
 * src/components/AvatarCropper.tsx
 * Клиентский компонент для выбора картинки и интерактивного кропа в квадратный аватар.
 *
 * На выходе отдаёт Blob (JPEG) фиксированного размера, готовый для отправки на сервер.
 */

import Cropper from 'react-easy-crop';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActionsRow,
  Button,
  CropArea,
  CropBlock,
  ErrorText,
  PreviewFallback,
  PreviewImg,
  Row,
  Wrap,
  ZoomLabel,
  ZoomTitle,
} from './AvatarCropper.styles';

export type AvatarCropperHandle = {
  open: () => void;
  reset: () => void;
};

type Props = {
  value?: Blob | null;
  onChange: (blob: Blob | null) => void;
  size?: number; // итоговый размер аватара (px)
  /**
   * standalone: компонент сам рисует "Выбрать фото" + preview + "Удалить"
   * embedded: только hidden input + блок кропа (контролы делаются снаружи)
   */
  mode?: 'standalone' | 'embedded';
};

type Area = { width: number; height: number; x: number; y: number };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.crossOrigin = 'anonymous';
    img.src = src;
  });
}

async function cropToJpeg(
  imageSrc: string,
  crop: Area,
  outSize: number,
): Promise<Blob> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  canvas.width = outSize;
  canvas.height = outSize;

  // Рисуем выбранный квадратный участок в outSize x outSize
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outSize,
    outSize,
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob ?? new Blob()), 'image/jpeg', 0.9);
  });
}

export const AvatarCropper = forwardRef<AvatarCropperHandle, Props>(
  function AvatarCropper(
    { value, onChange, size = 256, mode = 'standalone' }: Props,
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const cropAreaRef = useRef<HTMLDivElement | null>(null);
    const isCroppingRef = useRef(false);

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
      null,
    );
    const [err, setErr] = useState<string>('');

    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          // Блокируем открытие если идет кроп
          if (!isCroppingRef.current && inputRef.current) {
            inputRef.current.click();
          }
        },
        reset: () => {
          setErr('');
          setImageUrl(null);
          setCrop({ x: 0, y: 0 });
          setZoom(1);
          setCroppedAreaPixels(null);
          isCroppingRef.current = false;
          if (inputRef.current) inputRef.current.value = '';
        },
      }),
      [],
    );

    const previewUrl = useMemo(() => {
      if (!value) return null;
      return URL.createObjectURL(value);
    }, [value]);

    const onSelectFile = useCallback(async (file: File | null) => {
      setErr('');
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        setErr('Нужен файл изображения');
        return;
      }

      // 8MB на вход (телефонные фото бывают большими)
      if (file.size > 8 * 1024 * 1024) {
        setErr('Файл слишком большой (макс 8MB)');
        return;
      }

      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      setCroppedAreaPixels(null);
    }, []);

    const onCropComplete = useCallback(
      (_croppedArea: any, croppedAreaPixelsNext: any) => {
        setCroppedAreaPixels(croppedAreaPixelsNext as Area);
      },
      [],
    );

    const onApply = useCallback(async () => {
      setErr('');
      if (!imageUrl || !croppedAreaPixels) {
        setErr('Выбери изображение и область');
        return;
      }

      // react-easy-crop иногда даёт дробные координаты — нормализуем
      const cropArea: Area = {
        x: Math.round(croppedAreaPixels.x),
        y: Math.round(croppedAreaPixels.y),
        width: Math.round(croppedAreaPixels.width),
        height: Math.round(croppedAreaPixels.height),
      };

      cropArea.width = Math.max(1, cropArea.width);
      cropArea.height = Math.max(1, cropArea.height);
      cropArea.x = clamp(cropArea.x, 0, Number.MAX_SAFE_INTEGER);
      cropArea.y = clamp(cropArea.y, 0, Number.MAX_SAFE_INTEGER);

      const blob = await cropToJpeg(imageUrl, cropArea, size);
      onChange(blob);
      setImageUrl(null);
    }, [croppedAreaPixels, imageUrl, onChange, size]);

    return (
      <Wrap
        onMouseDown={(e) => {
          // Предотвращаем всплытие событий мыши, чтобы избежать случайных кликов на input
          if (imageUrl) {
            isCroppingRef.current = true;
            e.stopPropagation();
          }
        }}
        onMouseUp={(e) => {
          // Предотвращаем всплытие событий мыши, чтобы избежать случайных кликов на input
          if (imageUrl) {
            e.stopPropagation();
            setTimeout(() => {
              isCroppingRef.current = false;
            }, 100);
          }
        }}
        onTouchStart={(e) => {
          if (imageUrl) {
            isCroppingRef.current = true;
            e.stopPropagation();
          }
        }}
        onTouchEnd={(e) => {
          if (imageUrl) {
            e.stopPropagation();
            setTimeout(() => {
              isCroppingRef.current = false;
            }, 100);
          }
        }}
      >
        {mode === 'standalone' ? (
          <Row>
            <Button type='button' onClick={() => inputRef.current?.click()}>
              Выбрать фото
            </Button>
            {previewUrl ? (
              <PreviewImg
                src={previewUrl}
                alt='avatar preview'
                width={48}
                height={48}
              />
            ) : (
              <PreviewFallback />
            )}
            <Button
              type='button'
              $variant='ghost'
              onClick={() => onChange(null)}
            >
              Удалить
            </Button>
          </Row>
        ) : null}

        <input
          ref={inputRef}
          type='file'
          accept='image/*'
          style={{ 
            position: 'absolute',
            width: 0,
            height: 0,
            opacity: 0,
            pointerEvents: imageUrl ? 'none' : 'auto', // Блокируем pointer events когда идет кроп
            zIndex: -1
          }}
          onChange={(e) => {
            // Блокируем onChange если идет кроп
            if (isCroppingRef.current) {
              e.preventDefault();
              return;
            }
            onSelectFile(e.target.files?.[0] ?? null);
            // Сбрасываем значение input после выбора файла, чтобы onChange срабатывал при повторном выборе того же файла
            if (e.target) {
              e.target.value = '';
            }
          }}
          onClick={(e) => {
            // Блокируем клики если идет кроп
            if (isCroppingRef.current) {
              e.preventDefault();
              e.stopPropagation();
              return;
            }
            // Предотвращаем всплытие события, чтобы избежать случайных кликов
            e.stopPropagation();
          }}
        />

        {err ? <ErrorText>{err}</ErrorText> : null}

        {imageUrl ? (
          <CropBlock
            onMouseDown={(e) => {
              // Устанавливаем флаг что идет кроп
              isCroppingRef.current = true;
              // Предотвращаем всплытие событий мыши от области кропа
              e.stopPropagation();
            }}
            onMouseUp={(e) => {
              // Предотвращаем всплытие событий мыши от области кропа
              e.stopPropagation();
              // Сбрасываем флаг через небольшую задержку
              setTimeout(() => {
                isCroppingRef.current = false;
              }, 100);
            }}
            onTouchStart={(e) => {
              // Устанавливаем флаг что идет кроп (для мобильных)
              isCroppingRef.current = true;
              e.stopPropagation();
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              setTimeout(() => {
                isCroppingRef.current = false;
              }, 100);
            }}
            onClick={(e) => {
              // Предотвращаем случайные клики на область кропа
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <CropArea
              ref={cropAreaRef}
              onMouseDown={(e) => {
                // Устанавливаем флаг что идет кроп
                isCroppingRef.current = true;
                // Предотвращаем всплытие событий мыши от области кропа
                e.stopPropagation();
              }}
              onMouseUp={(e) => {
                // Предотвращаем всплытие событий мыши от области кропа
                e.stopPropagation();
                // Сбрасываем флаг через небольшую задержку, чтобы избежать случайных кликов
                setTimeout(() => {
                  isCroppingRef.current = false;
                }, 100);
              }}
              onTouchStart={(e) => {
                // Устанавливаем флаг что идет кроп (для мобильных)
                isCroppingRef.current = true;
                e.stopPropagation();
              }}
              onTouchEnd={(e) => {
                // Предотвращаем всплытие событий touch от области кропа
                e.stopPropagation();
                // Сбрасываем флаг через небольшую задержку
                setTimeout(() => {
                  isCroppingRef.current = false;
                }, 100);
              }}
              onClick={(e) => {
                // Предотвращаем случайные клики на область кропа
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Cropper
                image={imageUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                cropShape='round'
                showGrid={false}
              />
            </CropArea>

            <ZoomLabel>
              <ZoomTitle>Zoom</ZoomTitle>
              <input
                type='range'
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              />
            </ZoomLabel>

            <ActionsRow>
              <Button type='button' $variant='primary' onClick={onApply}>
                Применить кроп
              </Button>
              <Button
                type='button'
                $variant='ghost'
                onClick={() => setImageUrl(null)}
              >
                Отмена
              </Button>
            </ActionsRow>
          </CropBlock>
        ) : null}
      </Wrap>
    );
  },
);
