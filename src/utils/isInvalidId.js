const {validate: validateUuid} = require("uuid");

const isInvalidId = (id) => !id || !validateUuid(id);

module.exports = { isInvalidId };
