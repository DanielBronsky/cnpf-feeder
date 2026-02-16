/**
 * Apollo Provider для Next.js App Router
 */
'use client';

import { useMemo } from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';

export function ApolloProviderWrapper({ children }: { children: React.ReactNode }) {
  // Создаем Apollo Client внутри компонента чтобы избежать проблем с SSR и React hooks
  const client = useMemo(() => {
    const uploadLink = createUploadLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
      credentials: 'include',
    });

    const authLink = setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
        },
      };
    });

    return new ApolloClient({
      link: authLink.concat(uploadLink),
      cache: new InMemoryCache(),
      ssrMode: typeof window === 'undefined',
    });
  }, []);
  
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
