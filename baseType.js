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
    salary(city: String): Int
  }
  type Query {
    getClassName(classNo: Int): [String]
    account(username: String): Account
  }
`)

// 定义查询对应的处理器
const root = {
  getClassName: ({ classNo }) => {
    const obj = {
      1: ['a', 'aa', 'aaa'],
      2: ['b', 'bb', 'bbb'],
      3: ['c', 'cc', 'ccc']
    }
    return obj[classNo];
  },
  account: ({ username }) => {
    const name = username;
    const age = 26;
    const sex = '男';
    const department = 'project';
    const salary = ({city}) => {
      if(city === 'xian' || city === 'nanjing') {
        return 1000;
      }
      if(city === 'wuhan' || city === 'chengdu') {
        return 2000;
      }
      return 3000;
    }
    return {
      name,
      age,
      sex,
      department,
      salary
    };
  }
}

const app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

// 用express向外去公开一个文件夹，供用户访问静态资源
app.use(express.static('public'));

app.listen(3000);