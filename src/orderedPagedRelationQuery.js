const orderedPagedRelationQuery = function (parent, field, first, after, args, eager = null, modify = null) {
  const { orderBy, orderDirection } = args
  const joinRelation = orderBy.split('.').length > 1 ? orderBy.split('.')[0] : null
  return parent.pagedRelationQuery.call(parent, field, first, after, undefined, (builder) => {
    if (eager) {
      builder.eager(eager)
    }
    if (joinRelation && Object.keys(builder._modelClass.relationMappings).includes(joinRelation)) {
      builder.joinRelation(joinRelation)
      builder.orderBy(orderBy, orderDirection)
    } else if (!joinRelation) {
      builder.orderBy(`${builder._modelClass.tableName}.${orderBy}`, orderDirection)
    }
    if (modify) {
      modify(builder)
    }
  })
}

module.exports = orderedPagedRelationQuery
