declare module 'apollo-upload-client' {
  import { ApolloLink } from '@apollo/client';
  
  export interface UploadLinkOptions {
    uri?: string;
    credentials?: RequestCredentials;
    headers?: Record<string, string>;
    fetch?: typeof fetch;
  }
  
  export function createUploadLink(options?: UploadLinkOptions): ApolloLink;
}
