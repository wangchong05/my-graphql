const express = require('express');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');

// 定义schema，查询和类型
const schema = buildSchema(`
  type Account {
    name: String
    age: Int
    sex: String
    department: String
  }
  type Query {
    hello: String
    accountName: String
    age: Int
    account: Account
  }
`)

// 定义查询对应的处理器
const root = {
  hello: () => {
    return 'hello world';
  },
  accountName: () => {
    return 'Wang';
  },
  age: () => {
    return 16;
  },
  account: () => {
    return {
      name: 'xiao wang',
      age: 26,
      sex: '男',
      department: 'project'
    }
  }
}

const app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

app.listen(3000);