const { relayModel } = require('objection-graphql-relay')
const Case = require('case')

const withGraphQLSupport = () => {
  return (model) => {
    let Model = relayModel(model)

    const superOrderBy = Model.QueryBuilder.prototype.orderBy
    Model.QueryBuilder.prototype.orderBy = function (field, ...args) {
      const newField = field.split('.').map(Case.snake).join('.')
      return superOrderBy.call(this, newField, ...args)
    }

    return Model
  }
}

module.exports = withGraphQLSupport
