import { gql } from '@apollo/client';

export const moviesQuery = gql`
  query($name: String) {
    movies(name:$name) {
      id
      name
      genre
      watched
      rate
      director {
        name
        id
      }
    }
  }
`