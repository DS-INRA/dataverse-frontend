import { FileEmbargoDate } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileEmbargoDate'
import { FilePublishingStatus } from '../../../../../../../../../src/files/domain/models/File'
import { FileEmbargoMother } from '../../../../../../../files/domain/models/FileMother'

describe('FileEmbargoDate', () => {
  it('renders the embargo date when embargo exists', () => {
    const embargoDate = new Date('2123-09-18')
    const embargo = FileEmbargoMother.create(embargoDate)
    const status = FilePublishingStatus.RELEASED
    cy.customMount(<FileEmbargoDate embargo={embargo} publishingStatus={status} />)
    const dateString = embargoDate.toLocaleDateString(
      Intl.DateTimeFormat().resolvedOptions().locale,
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
    )
    cy.findByText(`Embargoed until ` + dateString).should('exist')
  })

  it('renders the until embargo date when embargo is not active and the file is not released', () => {
    const embargoDate = new Date('2023-09-15')
    const embargo = FileEmbargoMother.create(embargoDate)
    const status = FilePublishingStatus.RELEASED

    cy.customMount(<FileEmbargoDate embargo={embargo} publishingStatus={status} />)
    const dateString = embargoDate.toLocaleDateString(
      Intl.DateTimeFormat().resolvedOptions().locale,
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
    )
    cy.findByText(`Was embargoed until ` + dateString).should('exist')
  })

  it('renders the draft until embargo date when embargo is active and the file is not released', () => {
    const embargoDate = new Date('2123-09-18')
    const embargo = FileEmbargoMother.create(embargoDate)
    const status = FilePublishingStatus.DRAFT

    cy.customMount(<FileEmbargoDate embargo={embargo} publishingStatus={status} />)
    const dateString = embargoDate.toLocaleDateString(
      Intl.DateTimeFormat().resolvedOptions().locale,
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
    )
    cy.findByText(`Draft: will be embargoed until ` + dateString).should('exist')
  })

  it('renders an empty fragment when embargo is undefined', () => {
    const embargo = undefined
    const status = FilePublishingStatus.RELEASED

    cy.customMount(<FileEmbargoDate embargo={embargo} publishingStatus={status} />)

    cy.findByText(/Draft: will be embargoed until/).should('not.exist')
    cy.findByText(/Embargoed until/).should('not.exist')
    cy.findByText(/Was embargoed until/).should('not.exist')
  })
})