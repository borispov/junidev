module.exports = ( name, email, text ) => {
  return `
    <h3>You have received a <strong>feedback</strong> from <strong>${name}</strong></h3>
    <br>
    <p>${name}'s Email Address is:<strong> ${email}</strong></p>

    <h5>There Feedback:</h5>
    <br>
    <p>
    ${text}
    </p>
  `
}
