const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("../schema/schema");
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3005;

app.use(cors())
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true

  })
);
mongoose.connect('mongodb+srv://maxim:prodelka.08@movies.8muup.mongodb.net/movies?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})

const dbConnection = mongoose.connection
dbConnection.on("error", error => console.log(`error: ${error}`))
dbConnection.once("open", () => console.log("Connected to DB!"))





app.listen(PORT, (error) =>
  error ? console.log(error) : console.log("SERVER RUNNED")
);
