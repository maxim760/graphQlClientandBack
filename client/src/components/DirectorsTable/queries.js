import { gql } from '@apollo/client';

export const directorsQuery = gql`
  query {
    directors {
      id
      name
      age
      movies {
        name
        id
      }
    }
  }
`