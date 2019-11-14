const defaultReg = new RegExp(/\bsenior|lead|experienced\b/i);

module.exports = (title, reg) => reg ? !reg.test(title) : !defaultReg.test(title)
