const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Animation {
    id: ID!
    title: String!
    body: String!
    tags: String!
    link: String!
  }

  type Query {
    animations: [Animation]
    searchAnimations(searchQuery: String!): [Animation]
  }

  type Mutation {
    uploadAnimation(title: String!, body: String!, tags: String!, link: String!): Animation
  }
`);
