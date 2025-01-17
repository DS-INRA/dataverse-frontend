// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import '@cypress/code-coverage/support'
import 'react-loading-skeleton/dist/skeleton.css'

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { mount } from 'cypress/react18'

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in tests/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
// TODO: remove namespace so that this code passes eslint checks
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
      customMount: typeof mount
      mountAuthenticated: typeof mount
      loginAsAdmin(go?: string): Chainable<JQuery<HTMLElement>>
      getApiToken(): Chainable<string>
      compareDate(date: Date, expectedDate: Date): Chainable
    }
  }
}

Cypress.Commands.add('mount', mount)

// Example use:
// cy.mount(<MyComponent />)
