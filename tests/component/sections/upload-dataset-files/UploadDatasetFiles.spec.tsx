import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetMother } from '../../dataset/domain/models/DatasetMother'
import { FileRepository } from '../../../../src/files/domain/repositories/FileRepository'
import { Dataset as DatasetModel } from '../../../../src/dataset/domain/models/Dataset'
import { ReactNode } from 'react'
import { DatasetProvider } from '../../../../src/sections/dataset/DatasetProvider'
import { UploadDatasetFiles } from '../../../../src/sections/upload-dataset-files/UploadDatasetFiles'
import { FileMockLoadingRepository } from '../../../../src/stories/file/FileMockLoadingRepository'
import { LoadingProvider } from '../../../../src/sections/loading/LoadingProvider'

const fileRepository: FileRepository = {} as FileRepository
const datasetRepository: DatasetRepository = {} as DatasetRepository

describe('UploadDatasetFiles', () => {
  const mountWithDataset = (component: ReactNode, dataset: DatasetModel | undefined) => {
    const searchParams = { persistentId: 'some-persistent-id' }
    datasetRepository.getByPersistentId = cy.stub().resolves(dataset)

    cy.customMount(
      <LoadingProvider>
        <DatasetProvider repository={datasetRepository} searchParams={searchParams}>
          {component}
        </DatasetProvider>
      </LoadingProvider>
    )
  }

  it('renders the breadcrumbs', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<UploadDatasetFiles fileRepository={fileRepository} />, testDataset)

    cy.findByRole('link', { name: 'Root' }).should('exist')
    cy.findByRole('link', { name: 'Dataset Title' }).should('exist')
    cy.findByText('Upload Files').should('exist').should('have.class', 'active')
  })

  it('renders skeleton while loading', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<UploadDatasetFiles fileRepository={fileRepository} />, testDataset)

    cy.findByText('Temporary Loading until having shape of skeleton').should('exist')
    cy.findByText(testDataset.version.title).should('not.exist')
  })

  it('renders page not found when dataset is null', () => {
    const emptyDataset = DatasetMother.createEmpty()

    mountWithDataset(<UploadDatasetFiles fileRepository={fileRepository} />, emptyDataset)

    cy.findByText('Page Not Found').should('exist')
  })

  it('renders the file uploader', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(
      <UploadDatasetFiles fileRepository={new FileMockLoadingRepository()} />,
      testDataset
    )

    cy.findByText('Select Files to Add').should('exist')
    cy.findByText('Drag and drop files here.').should('exist')
    const dnd = cy.findByText('Drag and drop files here.')
    dnd.should('exist')
    dnd.selectFile(
      {
        fileName: 'users1.json',
        contents: [{ name: 'John Doe the 1st' }]
      },
      { action: 'drag-drop' }
    )
    cy.findByText('users1.json').should('exist')
    cy.findByTitle('Cancel upload').should('exist')
    cy.findByRole('progressbar').should('exist')
    cy.findByText('Select Files to Add').should('exist')
    dnd.selectFile(
      {
        fileName: 'users2.json',
        contents: [{ name: 'John Doe the 2nd' }]
      },
      { action: 'drag-drop' }
    )
    dnd.selectFile(
      {
        fileName: 'users3.json',
        contents: [{ name: 'John Doe the 3rd' }]
      },
      { action: 'drag-drop' }
    )
    cy.findAllByTitle('Cancel upload').first().parent().click()
    cy.findByText('users1.json').should('not.exist')
    cy.findByText('users2.json').should('exist')
    cy.findByText('users3.json').should('exist')
    cy.findAllByRole('progressbar').should('exist')
    cy.findByText('Drag and drop files here.').should('not.exist')
  })
})
