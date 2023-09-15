import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { FilesMockData } from './FileMockData'
import { File } from '../../files/domain/models/File'
import { FilesCountInfo } from '../../files/domain/models/FilesCountInfo'
import { FilesCountInfoMother } from '../../../tests/component/files/domain/models/FilesCountInfoMother'
import { FilePaginationInfo } from '../../files/domain/models/FilePaginationInfo'

export class FileMockRepository implements FileRepository {
  // eslint-disable-next-line unused-imports/no-unused-vars
  getAllByDatasetPersistentId(
    persistentId: string,
    version?: string,
    paginationInfo?: FilePaginationInfo
  ): Promise<File[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FilesMockData(paginationInfo?.pageSize || 10))
      }, 1000)
    })
  }
  getCountInfoByDatasetPersistentId(
    // eslint-disable-next-line unused-imports/no-unused-vars
    persistentId: string,
    // eslint-disable-next-line unused-imports/no-unused-vars
    version?: string
  ): Promise<FilesCountInfo> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FilesCountInfoMother.create({ total: 200 }))
      }, 1000)
    })
  }
}