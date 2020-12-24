import { compose } from 'recompose';
import { graphql } from 'react-apollo';

import { moviesQuery } from "../MoviesTable/queries"

import { deleteMovieMutation } from './mutations';


const withGraphqlDelete = graphql(deleteMovieMutation, {
  props: ({ mutate }) => ({
    deleteMovie: movie => mutate({
      variables: movie,
      refetchQueries: [{query: moviesQuery}]
    }),
  }),
});

export default compose( withGraphqlDelete);