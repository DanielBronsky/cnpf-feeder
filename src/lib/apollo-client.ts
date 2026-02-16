/**
 * Apollo Client setup для Frontend
 * Поддерживает загрузку файлов через GraphQL Upload
 */
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';

function createApolloClient() {
  const uploadLink = createUploadLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
    credentials: 'include', // Для отправки cookies
  });

  const authLink = setContext((_, { headers }) => {
    // Можно добавить дополнительные headers если нужно
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
}

export const apolloClient = createApolloClient();
