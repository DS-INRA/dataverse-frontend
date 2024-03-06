import { CreateDatasetForm } from '../../../src/sections/create-dataset/CreateDatasetForm'
import { DatasetRepository } from '../../../src/dataset/domain/repositories/DatasetRepository'

const datasetRepository: DatasetRepository = {} as DatasetRepository
describe('Create Dataset', () => {
  beforeEach(() => {
    datasetRepository.create = cy.stub().resolves()
  })

  it('renders the Create Dataset page and its contents', () => {
    cy.customMount(<CreateDatasetForm repository={datasetRepository} />)
    cy.findByText(/Create Dataset/i).should('exist')

    cy.findByLabelText(/Title/i).should('exist').should('have.attr', 'required', 'required')
    cy.findByText('Title').children('div').trigger('mouseover')
    cy.findByText('The main title of the Dataset').should('exist')

    cy.findByLabelText(/Author Name/i)
      .should('exist')
      .should('have.attr', 'required', 'required')
    cy.findByText('Author Name').children('div').trigger('mouseover')
    cy.findByText(
      "The name of the author, such as the person's name or the name of an organization"
    ).should('exist')

    cy.findByText(/Save Dataset/i).should('exist')

    cy.findByText(/Cancel/i).should('exist')
  })

  it('shows an error message when the title is not provided', () => {
    cy.customMount(<CreateDatasetForm repository={datasetRepository} />)

    cy.findByText(/Save Dataset/i).click()

    cy.findByText('Title is required.').should('exist')

    cy.findByText('Error: Submission failed.').should('exist')
  })

  it('shows an error message when the author name is not provided', () => {
    cy.customMount(<CreateDatasetForm repository={datasetRepository} />)

    cy.findByText(/Save Dataset/i).click()

    cy.findByText('Author name is required.').should('exist')

    cy.findByText('Error: Submission failed.').should('exist')
  })

  it('can submit a valid form', () => {
    cy.customMount(<CreateDatasetForm repository={datasetRepository} />)

    cy.findByLabelText(/Title/i).type('Test Dataset Title').and('have.value', 'Test Dataset Title')
    cy.findByLabelText(/Author Name/i)
      .type('Test author name')
      .and('have.value', 'Test author name')

    cy.findByText(/Save Dataset/i).click()
    cy.findByText('Form submitted successfully!')
  })

  it('shows an error message when the submission fails', () => {
    datasetRepository.create = cy.stub().rejects()
    cy.customMount(<CreateDatasetForm repository={datasetRepository} />)

    cy.findByLabelText(/Title/i).type('Test Dataset Title').and('have.value', 'Test Dataset Title')
    cy.findByLabelText(/Author Name/i)
      .type('Test author name')
      .and('have.value', 'Test author name')

    cy.findByText(/Save Dataset/i).click()
    cy.findByText('Error: Submission failed.').should('exist')
  })
})
