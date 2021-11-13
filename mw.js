const express = require('express');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');

// 定义schema，查询和类型，mutation
const schema = buildSchema(`
  input AccountInput {
    name: String
    age: Int
    sex: String
    department: String
  }
  type Account {
    name: String
    age: Int
    sex: String
    department: String
    salary(city: String): Int
  }
  type Mutation {
    createAccount(input: AccountInput): Account
    updateAccount(id: ID!, input: AccountInput): Account
  }
  type Query {
    accounts: [Account]
  }
`)

const fakeDb = {};

// 定义查询对应的处理器
const root = {
  accounts() {
    let arr = [];
    for(const key in fakeDb) {
      arr.push(fakeDb[key])
    }
    return arr;
  },
  createAccount: ({ input }) => {
    // 相当于保存到数据库
    fakeDb[input.name] = input;
    // 返回保存结果
    return fakeDb[input.name];
  },
  updateAccount: ({ id, input }) => {
    // 把inpu和数据库里面的值都copy到{}，相当于做了一次数据库更新的操作
    const updatedAccount = Object.assign({}, fakeDb[id], input);
    fakeDb[id] = updatedAccount;
    return updatedAccount;

  }
}

const app = express();

const middleware = (req, res, next) => {
  if(req.url.indexOf('graphql') !== -1 && (!req.headers.cookie || req.headers.cookie.indexOf('auth_graphql') === -1)) {
    res.send(JSON.stringify({
      error: "without permission"
    }))
    return;
  }
  next();
}
app.use(middleware);

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

// 用express向外去公开一个文件夹，供用户访问静态资源
app.use(express.static('public'));

app.listen(3000);