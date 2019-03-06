const { Model: ObjectionModel } = require('objection')

const MANY_RELATIONSHIPS = [
  ObjectionModel.ManyToManyRelation,
  ObjectionModel.HasManyRelation
]

module.exports = { MANY_RELATIONSHIPS }
