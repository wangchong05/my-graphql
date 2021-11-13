const express = require('express');
const graphql = require('graphql');
const { graphqlHTTP } = require('express-graphql');

const AccountType = new graphql.GraphQLObjectType({
  name: 'Account',
  fields: {
    name: { type: graphql.GraphQLString },
    age: { type: graphql.GraphQLInt },
    sex: { type: graphql.GraphQLString },
    department: { type: graphql.GraphQLString }
  }
})

const queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    account: {
      type: AccountType,
      args: {
        username: { type: graphql.GraphQLString }
      },
      resolve: function(_, {username}) {
        const name = username;
        const age = 26;
        const sex = '男';
        const department = 'project';
        return {
          name,
          age,
          sex,
          department
        };
      }
    }
  }
})

const schema = new graphql.GraphQLSchema({ query: queryType });

const app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}))

app.listen(3000);