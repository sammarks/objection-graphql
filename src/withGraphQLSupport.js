const { relayModel } = require('objection-graphql-relay')
const orderedPagedRelationQuery = require('./orderedPagedRelationQuery')
const Case = require('case')
const { MANY_RELATIONSHIPS } = require('./constants')

const withGraphQLSupport = () => {
  return (model) => {
    let Model = relayModel(model)
    if (Model.relationMappings && Object.keys(Model.relationMappings).length > 0) {
      Model = Object.keys(Model.relationMappings).reduce((Model, relationMappingKey) => {
        const relationMapping = Model.relationMappings[relationMappingKey]
        if (MANY_RELATIONSHIPS.filter((relationship) => relationship.name === relationMapping.relation.name).length > 0) {
          const funcName = `paginated${Case.pascal(relationMappingKey)}`
          if (!Model.prototype[funcName]) {
            Model.prototype[`paginated${Case.pascal(relationMappingKey)}`] = function (...args) {
              return orderedPagedRelationQuery(this.pagedRelationQuery.bind(this), relationMappingKey, ...args)
            }
          }
          return Model
        } else return Model
      }, Model)
    }

    const superOrderBy = Model.QueryBuilder.prototype.orderBy
    Model.QueryBuilder.prototype.orderBy = function (field, ...args) {
      const newField = field.split('.').map(Case.snake).join('.')
      return superOrderBy.call(this, newField, ...args)
    }

    return Model
  }
}

module.exports = withGraphQLSupport
