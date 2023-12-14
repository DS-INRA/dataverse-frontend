import newDatasetData from '../../fixtures/dataset-finch1.json'
import { DataverseApiHelper } from '../DataverseApiHelper'
import { FileData } from '../files/FileHelper'
import { DatasetLockReason } from '../../../../src/dataset/domain/models/Dataset'

export interface DatasetResponse {
  persistentId: string
  id: string
  files?: DatasetFileResponse[]
}

export interface DatasetFileResponse {
  id: number
}

export class DatasetHelper extends DataverseApiHelper {
  static async create(): Promise<DatasetResponse> {
    return this.request<DatasetResponse>(`/dataverses/root/datasets`, 'POST', newDatasetData)
  }

  static async publish(persistentId: string): Promise<{
    status: string
    persistentId: string
  }> {
    const response = await this.request<{
      status: string
    }>(`/datasets/:persistentId/actions/:publish?persistentId=${persistentId}&type=major`, 'POST')

    return { ...response, persistentId }
  }

  static async getLocks(persistentId: string): Promise<{
    status: string
    persistentId: string
  }> {
    const response = await this.request<{
      status: string
    }>(`/datasets/:persistentId/locks?persistentId=${persistentId}`, 'GET')

    return { ...response, persistentId }
  }

  static deaccession(id: string) {
    return this.request<{ status: string }>(
      `/datasets/${id}/versions/:latest-published/deaccession`,
      'POST',
      {
        deaccessionReason: 'Description of the deaccession reason.'
      }
    )
  }

  static async createPrivateUrl(id: string): Promise<{
    token: string
  }> {
    return this.request<{
      token: string
    }>(`/datasets/${id}/privateUrl`, 'POST')
  }

  static async createPrivateUrlAnonymized(id: string): Promise<{
    token: string
  }> {
    return this.request<{
      token: string
    }>(`/datasets/${id}/privateUrl?anonymizedAccess=true`, 'POST')
  }

  static async createWithFiles(filesData: FileData[]): Promise<DatasetResponse> {
    const datasetResponse = await this.create()
    const files = await this.uploadFiles(datasetResponse.persistentId, filesData)
    return { ...datasetResponse, files: files }
  }

  static async embargoFiles(
    persistentId: string,
    filesIds: number[],
    embargoDate: string
  ): Promise<DatasetResponse> {
    const response = await this.request<DatasetResponse>(
      `/datasets/:persistentId/files/actions/:set-embargo?persistentId=${persistentId}`,
      'POST',
      { fileIds: filesIds, dateAvailable: embargoDate, reason: 'Standard project embargo' }
    )
    return { ...response, persistentId }
  }

  private static async uploadFiles(
    datasetPersistentId: string,
    filesData: FileData[]
  ): Promise<DatasetFileResponse[]> {
    // TODO - Instead of uploading the files one by one, upload them all at once - do this refactor when integrating the pagination
    const files = []
    for (const fileData of filesData) {
      const file = await this.uploadFile(datasetPersistentId, fileData)
      files.push(file)
    }
    return files
  }

  private static async uploadFile(
    datasetPersistentId: string,
    fileData: FileData
  ): Promise<DatasetFileResponse> {
    const { files } = await this.request<{
      files: [
        {
          dataFile: {
            id: number
          }
        }
      ]
    }>(
      `/datasets/:persistentId/add?persistentId=${datasetPersistentId}`,
      'POST',
      fileData,
      'multipart/form-data'
    )

    if (!files || !files[0].dataFile) {
      throw new Error('No files returned')
    }
    return files[0].dataFile
  }

  static async setCitationDateFieldType(
    persistentId: string,
    fieldType: string
  ): Promise<{
    status: string
  }> {
    return this.request<{
      status: string
    }>(
      `/datasets/:persistentId/citationdate?persistentId=${persistentId}`,
      'PUT',
      fieldType,
      'text/plain'
    )
  }

  static async lock(
    id: string,
    reason: DatasetLockReason
  ): Promise<{
    status: string
  }> {
    return this.request<{
      status: string
    }>(`/datasets/${id}/lock/${reason}`, 'POST')
  }
}
