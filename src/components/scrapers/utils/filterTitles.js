const defaultReg = new RegExp(/\bsenior|lead|experienced\b/i);

module.exports = (title) => !defaultReg.test(title)
