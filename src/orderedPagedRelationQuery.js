const orderedPagedRelationQuery = function (pagedRelationQuery, field, first, after, args, eager = null) {
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

module.exports = orderedPagedRelationQuery
