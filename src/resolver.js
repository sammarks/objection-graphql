const { idWrapper, connectionWrapper, singleRelationshipWrapper } = require('objection-graphql-relay')
const { cursorToOffset } = require('graphql-relay')
const { MANY_RELATIONSHIPS } = require('./constants')
const orderedPagedRelationQuery = require('./orderedPagedRelationQuery')
const Case = require('case')

const getResolver = (Model) => {
  return {
    id: idWrapper(Model.name),
    ...getResolverRelationships(Model)
  }
}

const isManyRelationship = (relationship, manyRelationships = MANY_RELATIONSHIPS) => {
  return manyRelationships.some((manyRelationship) =>
    manyRelationship.name === relationship.name)
}

const getResolverRelationships = (Model) => {
  if (Model.relationMappings && Object.keys(Model.relationMappings).length > 0) {
    return Object.keys(Model.relationMappings).reduce((resolver, relationMappingKey) => {
      const relationMapping = Model.relationMappings[relationMappingKey]
      if (isManyRelationship(relationMapping.relation)) {
        return {
          ...resolver,
          [relationMappingKey]: (parent, args, ...others) => {
            const funcName = `paginated${Case.pascal(relationMappingKey)}`
            if (parent[funcName]) {
              return parent[funcName](args, ...others)
            } else {
              const after = args.after ? cursorToOffset(args.after) : null
              return orderedPagedRelationQuery(parent, relationMappingKey, args.first, after, args)
                .then((collectionInfo) => {
                  return connectionWrapper({ collectionInfo, args })
                })
            }
          }
        }
      } else {
        return { ...resolver, [relationMappingKey]: singleRelationshipWrapper(relationMappingKey) }
      }
    }, {})
  } else return {}
}

module.exports = getResolver
