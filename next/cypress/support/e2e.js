import './commands'
import 'cypress-plugin-stripe-elements'
import 'cypress-real-events'

Cypress.on('uncaught:exception', (err) => {
  if (/loaderUi Element didn't mount normally/i.test(err.message)) {
    return false
  }
  return true
})

Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  originalFn(url, options)
  cy.get('body', { timeout: 30000 }).should(($body) => {
    expect($body.css('display')).to.not.eq('none')
  })
})
