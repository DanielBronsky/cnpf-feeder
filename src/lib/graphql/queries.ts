/**
 * GraphQL Queries
 */
import { gql } from '@apollo/client';

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      username
      isAdmin
      hasAvatar
      avatarUrl
    }
  }
`;

export const REPORTS_QUERY = gql`
  query Reports($limit: Int) {
    reports(limit: $limit) {
      id
      title
      text
      createdAt
      updatedAt
      authorId
      author {
        id
        username
        hasAvatar
        avatarUrl
      }
      photos {
        url
      }
      canEdit
    }
  }
`;

export const REPORT_QUERY = gql`
  query Report($id: ID!) {
    report(id: $id) {
      id
      title
      text
      createdAt
      updatedAt
      authorId
      author {
        id
        username
        hasAvatar
        avatarUrl
      }
      photos {
        url
      }
      canEdit
    }
  }
`;

export const COMPETITIONS_QUERY = gql`
  query Competitions {
    competitions {
      id
      title
      startDate
      endDate
      location
      tours {
        date
        time
      }
      openingDate
      openingTime
      individualFormat
      teamFormat
      fee
      teamLimit
      regulations
      createdAt
      updatedAt
    }
  }
`;

export const COMPETITION_QUERY = gql`
  query Competition($id: ID!) {
    competition(id: $id) {
      id
      title
      startDate
      endDate
      location
      tours {
        date
        time
      }
      openingDate
      openingTime
      individualFormat
      teamFormat
      fee
      teamLimit
      regulations
      createdAt
      updatedAt
    }
  }
`;

export const ADMIN_USERS_QUERY = gql`
  query AdminUsers {
    adminUsers {
      id
      email
      username
      isAdmin
      hasAvatar
      avatarUrl
    }
  }
`;

export const ADMIN_USER_QUERY = gql`
  query AdminUser($id: ID!) {
    adminUser(id: $id) {
      id
      email
      username
      isAdmin
      hasAvatar
      avatarUrl
    }
  }
`;

export const CHAT_QUERY = gql`
  query Chat($query: String!) {
    chat(query: $query) {
      message
      results {
        id
        type
        title
        hasPhotos
        photosCount
        location
      }
    }
  }
`;

export const REGISTRATIONS_QUERY = gql`
  query Registrations($competitionId: ID!) {
    registrations(competitionId: $competitionId) {
      id
      competitionId
      userId
      type
      teamName
      participants {
        firstName
        lastName
      }
      coach {
        firstName
        lastName
      }
      canEdit
      createdAt
      updatedAt
    }
  }
`;
