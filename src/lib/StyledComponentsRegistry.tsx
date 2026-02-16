'use client';

/**
 * src/lib/StyledComponentsRegistry.tsx
 * SSR registry для styled-components в Next.js App Router.
 * Нужен, чтобы стили корректно попадали в HTML при серверном рендеринге.
 */

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = sheet.getStyleElement();
    sheet.instance.clearTag();
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{styles}</>;
  });

  // На клиенте StyleSheetManager не нужен.
  if (typeof window !== 'undefined') return <>{children}</>;

  return (
    <StyleSheetManager sheet={sheet.instance}>{children}</StyleSheetManager>
  );
}
