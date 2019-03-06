const { idWrapper, connectionWrapper, singleRelationshipWrapper, relayModel } = require('objection-graphql-relay')
const Case = require('case')
const { MANY_RELATIONSHIPS } = require('./constants')

const orderedPagedRelationQuery = (pagedRelationQuery, field, first, after, args, eager = null) => {
  const { orderBy, orderDirection } = args
  const joinRelation = orderBy.split('.').length > 1 ? orderBy.split('.')[0] : null
  return pagedRelationQuery(field, first, after, undefined, (builder) => {
    if (eager) {
      builder.eager(eager)
    }
    if (joinRelation) {
      builder.joinRelation(joinRelation)
      builder.orderBy(orderBy, orderDirection)
    } else {
      builder.orderBy(`${builder._modelClass.tableName}.${orderBy}`, orderDirection)
    }
  })
}

const withGraphQLSupport = () => {
  return (model) => {
    const Model = relayModel(model)
    if (Model.relationMappings && Object.keys(Model.relationMappings).length > 0) {
      return Object.keys(Model.relationMappings).reduce((Model, relationMappingKey) => {
        const relationMapping = Model.relationMappings[relationMappingKey]
        if (MANY_RELATIONSHIPS.includes(relationMapping.relation)) {
          return {
            ...Model,
            prototype: {
              ...Model,
              [`paginated${Case.pascal(relationMappingKey)}`]: (...args) => {
                return orderedPagedRelationQuery(this.pagedRelationQuery, relationMappingKey, ...args)
              }
            }
          }
        } else return Model
      }, Model)
    }
  }
}

const getResolver = (Model) => {
  return {
    id: idWrapper(),
    ...getResolverRelationships(Model)
  }
}

const getResolverRelationships = (Model) => {
  if (Model.relationMappings && Object.keys(Model.relationMappings).length > 0) {
    return Object.keys(Model.relationMappings).reduce((resolver, relationMappingKey) => {
      const relationMapping = Model.relationMappings[relationMappingKey]
      if (MANY_RELATIONSHIPS.includes(relationMapping.relation)) {
        return { ...resolver, [relationMappingKey]: connectionWrapper(Case.pascal(relationMappingKey)) }
      } else {
        return { ...resolver, [relationMappingKey]: singleRelationshipWrapper(relationMappingKey) }
      }
    }, {})
  } else return {}
}

module.exports = getResolver
