const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
} = graphql;

const Movies = require("../models/movie");
const Directors = require("../models/director");

const MovieType = new GraphQLObjectType({
  name: "Movie",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    genre: { type: new GraphQLNonNull(GraphQLString) },
    watched: { type: new GraphQLNonNull(GraphQLBoolean) },
    rate: { type: GraphQLInt },
    director: {
      type: DirectorType,
      resolve(parent, args) {
        return Directors.findById(parent.directorId);
      },
    },
  }),
});
const DirectorType = new GraphQLObjectType({
  name: "Director",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        return Movies.find({ directorId: parent.id });
      },
    },
  }),
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }) {
        return Movies.findById(id);
      },
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }) {
        return Directors.findById(id);
      },
    },
    movies: {
      type: new GraphQLList(MovieType),
      args: {name: {type: GraphQLString}},
      resolve(parent, {name}) { 
        return Movies.find({name: { $regex: name, $options: "i"}});
      },
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve() {
        return Directors.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addDirector: {
      type: DirectorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, { name, age }) {
        // return Directors.create({name,age})
        const director = new Directors({ name, age });
        director.save();
        return director;
      },
    },
    addMovie: {
      type: MovieType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        watched: { type: new GraphQLNonNull(GraphQLBoolean) },
        rate: { type: GraphQLInt },
        directorId: { type: GraphQLID },
      },
      resolve(parent, { name, genre, directorId, watched, rate }) {
        const movie = new Movies({ name, genre, directorId, watched, rate });
        movie.save();
        return movie;
      },
    },
    updateDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, { name, age, id }) {
        // return Directors.create({name,age})
        return Directors.findByIdAndUpdate(id, { name, age }, { new: true });
      },
    },
    updateMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        watched: { type: new GraphQLNonNull(GraphQLBoolean) },
        rate: { type: GraphQLInt },
        directorId: { type: GraphQLID },
      },
      resolve(parent, { name, genre, directorId, watched, rate, id }) {
        return Movies.findByIdAndUpdate(
          id,
          {
            $set: {
              name,
              genre,
              directorId,
              watched,
              rate,
            },
          },
          { new: true }
        );
      },
    },
    deleteDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, { id }) {
        return Directors.findByIdAndRemove(id);
      },
    },
    deleteMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, { id }) {
        return Movies.findByIdAndRemove(id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
