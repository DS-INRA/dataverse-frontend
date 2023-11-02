import { FileMother } from '../../../../../../../files/domain/models/FileMother'
import { FileType } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileType'
import {
  FileSize,
  FileSizeUnit,
  FileType as FileTypeModel
} from '../../../../../../../../../src/files/domain/models/File'

describe('FileType', () => {
  it('renders the type and size correctly when there are no decimals', () => {
    const file = FileMother.create({
      type: new FileTypeModel('text/plain'),
      size: new FileSize(123.03932894722, FileSizeUnit.BYTES)
    })
    cy.customMount(<FileType type={file.type} size={file.size} />)

    cy.findByText(`Text/plain - 123 B`).should('exist')
  })

  it('renders the type and size correctly when there are decimals', () => {
    const file = FileMother.create({
      type: new FileTypeModel('text/plain'),
      size: new FileSize(123.932894722, FileSizeUnit.MEGABYTES)
    })
    cy.customMount(<FileType type={file.type} size={file.size} />)

    cy.findByText(`Text/plain - 123.9 MB`).should('exist')
  })
})