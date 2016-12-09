'use strict';
const _ = require('lodash');
module.exports = (sequelize, model, records, options = {}) => {
  options = _.defaults({}, options, {
    replacements: [JSON.stringify(records)]
  });
  const tableName = model.getTableName();
  const attributes = _(model.tableAttributes).keys();
  const primaryKeys = attributes
    .filter(key => model.tableAttributes[key].primaryKey)
    .value();
  const updatableFields = attributes
    .map(key => `"${key}" = EXCLUDED."${key}"`)
    .value()
    .join(',');
  const query = `INSERT INTO "${tableName}"
                  SELECT data.*
                    FROM json_populate_recordset(null::"${tableName}", ?) AS data
                    ON CONFLICT (${primaryKeys}) DO UPDATE SET ${updatableFields};`;
  return sequelize.query(query, options);
};
