module.exports = titles => (
  titles
    .filter(title => !title
        .split(' ')
        .test(/\bSenior|senior\b/i))
)
