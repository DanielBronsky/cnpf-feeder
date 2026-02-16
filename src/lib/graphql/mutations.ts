/**
 * GraphQL Mutations
 */
import { gql } from '@apollo/client';

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      ok
      token
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      ok
      token
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      email
      username
      isAdmin
      hasAvatar
      avatarUrl
    }
  }
`;

// Note: GraphQL Upload requires multipart/form-data format
// For now, avatar upload uses REST endpoint
// To use GraphQL Upload, you need to send files using the GraphQL multipart request specification

export const UPDATE_PASSWORD_MUTATION = gql`
  mutation UpdatePassword($oldPassword: String!, $newPassword: String!) {
    updatePassword(oldPassword: $oldPassword, newPassword: $newPassword)
  }
`;

export const CREATE_REPORT_MUTATION = gql`
  mutation CreateReport($input: CreateReportInput!) {
    createReport(input: $input) {
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

// Note: GraphQL Upload requires multipart/form-data format
// For now, photo upload uses REST endpoint
// To use GraphQL Upload, you need to send files using the GraphQL multipart request specification

export const UPDATE_REPORT_MUTATION = gql`
  mutation UpdateReport($id: ID!, $input: UpdateReportInput!) {
    updateReport(id: $id, input: $input) {
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

export const DELETE_REPORT_MUTATION = gql`
  mutation DeleteReport($id: ID!) {
    deleteReport(id: $id)
  }
`;

export const CREATE_COMPETITION_MUTATION = gql`
  mutation CreateCompetition($input: CompetitionInput!) {
    createCompetition(input: $input) {
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

export const UPDATE_COMPETITION_MUTATION = gql`
  mutation UpdateCompetition($id: ID!, $input: CompetitionInput!) {
    updateCompetition(id: $id, input: $input) {
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

export const DELETE_COMPETITION_MUTATION = gql`
  mutation DeleteCompetition($id: ID!) {
    deleteCompetition(id: $id)
  }
`;

export const ADMIN_UPDATE_USER_MUTATION = gql`
  mutation AdminUpdateUser($id: ID!, $isAdmin: Boolean) {
    adminUpdateUser(id: $id, isAdmin: $isAdmin) {
      id
      email
      username
      isAdmin
      hasAvatar
      avatarUrl
    }
  }
`;

export const ADMIN_DELETE_USER_MUTATION = gql`
  mutation AdminDeleteUser($id: ID!) {
    adminDeleteUser(id: $id)
  }
`;

export const CREATE_REGISTRATION_MUTATION = gql`
  mutation CreateRegistration($input: CreateRegistrationInput!) {
    createRegistration(input: $input) {
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

export const UPDATE_REGISTRATION_MUTATION = gql`
  mutation UpdateRegistration($id: ID!, $input: UpdateRegistrationInput!) {
    updateRegistration(id: $id, input: $input) {
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

export const DELETE_REGISTRATION_MUTATION = gql`
  mutation DeleteRegistration($id: ID!) {
    deleteRegistration(id: $id)
  }
`;
