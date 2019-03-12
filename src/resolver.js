const { idWrapper, connectionWrapper, singleRelationshipWrapper } = require('objection-graphql-relay')
const Case = require('case')
const { MANY_RELATIONSHIPS } = require('./constants')

const getResolver = (Model) => {
  return {
    id: idWrapper(Model.name),
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
