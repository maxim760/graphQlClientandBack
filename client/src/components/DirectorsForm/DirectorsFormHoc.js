import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';

import { directorsQuery } from "../DirectorsTable/queries"

import { addDirectorMutation, updateDirectorMutation } from './mutations';

import { styles } from './styles';


const withGraphql = compose(graphql(addDirectorMutation, {
  props: ({ mutate }) => ({
    addDirector: director => mutate({
      variables: director,
      refetchQueries: [{query: directorsQuery}]
    }),
  }),
}),
graphql(updateDirectorMutation, {
  props: ({ mutate }) => ({
    updateDirector: director => mutate({
      variables: director,
      refetchQueries: [{query: directorsQuery}]
    }),
  }),
}))

export default compose(withStyles(styles), withGraphql);