'use strict';
const _ = require('lodash');
module.exports = (sequelize, model, records, options = {}) => {
  options = _.defaults({}, options, {
    replacements: [JSON.stringify(records)];
  });
  const tableName = model.getTableName();
  const attributes = _(model.tableAttributes)
    .keys()
    .map(attribute => `"${attribute}"`)
    .value();
  const primaryKeys = _(model.tableAttributes)
    .filter(attribute => attribute.primaryKey)
    .keys()
    .value();
  const updatableFields = _(attributeKeys)
    .map(key => `${key} = EXCLUDED.${key}`)
    .join(',')
    .value();
  const query = `INSERT INTO "${tableName}"
                  SELECT data.*
                    FROM json_populate_recordset(null::"${tableName}", ?) AS data
                    ON CONFLICT (${primaryKeys}) DO UPDATE SET ${updatableFields};`;
  return sequelize.query(query, options);
};
