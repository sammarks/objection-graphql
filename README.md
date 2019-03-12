![][header-image]

[![CircleCI][circleci-image]][circleci-url]
[![NPM version][npm-version]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
![License][license]
![Issues][issues]

`@sammarks/objection-graphql` is a set of helper methods for quickly crafting resolvers with GraphQL and Objection.JS. 

## Get Started

```sh
npm install @sammarks/objection-graphql
yarn add @sammarks/objection-graphql
```

On each of your models, decorate them with `withGraphQLSupport`

```js
import { withGraphQLSupport } from '@sammarks/objection-graphql'

@withGraphQLSupport()
export default class User extends Model {
  static tableName = 'users'
  static get relationMappings () {
    return {
      posts: {
        modelClass: Post,
        relation: Model.HasManyRelation,
        join: {
          from: 'users.id',
          to: 'posts.user_id'
        }
      }
    }
  }
}
```

Now, in your GraphQL resolvers:

```js
import { getResolver, nodeResolver } from '@sammarks/objection-graphql'
import User from './models/User'

const resolvers = {
  Node: nodeResolver,
  User: getResolver(User)
}
```

And then the following GraphQL schema will automatically be supported.

```graphql
enum OrderDirection {
  ASC
  DESC
}

type User {

  # Standard user fields...
  id: ID!
  firstName: String!
  lastName: String!
  
  # Relationships!
  posts(
    first: Int = 10,
    after: String,
    orderBy: String = "id",
    orderDirection: OrderDirection = ASC
  ): PostsConnection!
  
}
```

See [objection-graphql-relay](https://github.com/sammarks/objection-graphql-relay) for some more information. 

## Function Reference

### getResolver(ObjectionModel model)

Automatically generates a resolver for the passed Objection.JS model. Currently does not support
extra customization.

Will automatically generate resolvers for single and multiple relationships. See the source code
for `orderedPagedRelationQuery()` for more information.

### nodeResolver

This is just a pretty standard GraphQL Node resolver. See the code sample above for how to use
this. It just takes the constructor name of the Model and uses that to determine the GraphQL type
(so make sure those are the same!)

### withGraphQLSupport()

Decorator for adding helper methods required for the automatic connection creator inside `getResolver()`. 
Returns a function that accepts the model to decorate. There are currently no configuration options. 

## Features

- Automatically generates GraphQL resolvers based on Objection.JS models.
- Includes support for many-to-many relationships and one-to-many relationships with GraphQL Relay
  support out of the box.
- Relationship connections automatically support ordering by specific fields.
- Includes a basic GraphQL Node resolver for convenience.

[header-image]: https://raw.githubusercontent.com/sammarks/art/master/objection-graphql/header.jpg
[circleci-image]: https://img.shields.io/circleci/project/github/sammarks/objection-graphql.svg
[circleci-url]: https://circleci.com/gh/sammarks/objection-graphql/tree/master
[npm-version]: https://img.shields.io/npm/v/@sammarks/objection-graphql.svg
[npm-downloads]: https://img.shields.io/npm/dm/@sammarks/objection-graphql.svg
[npm-url]: https://www.npmjs.com/package/@sammarks/objection-graphql
[license]: https://img.shields.io/github/license/sammarks/objection-graphql.svg
[issues]: https://img.shields.io/github/issues/sammarks/objection-graphql.svg
