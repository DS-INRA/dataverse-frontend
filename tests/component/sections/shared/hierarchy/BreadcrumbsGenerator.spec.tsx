import { BreadcrumbsGenerator } from '../../../../../src/sections/shared/hierarchy/BreadcrumbsGenerator'
import { UpwardHierarchyNodeMother } from '../../../shared/hierarchy/domain/models/UpwardHierarchyNodeMother'

describe('BreadcrumbsGenerator', () => {
  it('shows the hierarchy items as breadcrumbs', () => {
    const collection = UpwardHierarchyNodeMother.createCollection({
      name: 'Collection',
      id: 'collection'
    })
    const dataset = UpwardHierarchyNodeMother.createDataset({
      name: 'Dataset',
      parent: collection,
      version: '1.0',
      id: 'dataset'
    })
    const file = UpwardHierarchyNodeMother.createFile({ name: 'File', parent: dataset })

    cy.customMount(<BreadcrumbsGenerator hierarchy={file} />)
    cy.findByText('File').should('have.class', 'active')
    cy.findByRole('link', { name: 'Dataset' })
      .should('exist')
      .should('have.attr', 'href', '/datasets?id=dataset&version=1.0')
    cy.findByRole('link', { name: 'Collection' })
      .should('exist')
      .should('have.attr', 'href', '/collections?id=collection')
  })
})
