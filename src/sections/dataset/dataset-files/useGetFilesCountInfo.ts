import { useCallback, useEffect, useState } from 'react'
import { getFilesCountInfoByDatasetPersistentId } from '../../../files/domain/useCases/getFilesCountInfoByDatasetPersistentId'
import { FilesCountInfo } from '../../../files/domain/models/FilesCountInfo'
import { FileCriteria } from '../../../files/domain/models/FileCriteria'
import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'

type UseLoadFilesCountInfoParams = {
  filesRepository: FileRepository
  datasetPersistentId: string
  datasetVersion: DatasetVersion
  criteria?: FileCriteria
}

export const useGetFilesCountInfo = ({
  filesRepository,
  datasetPersistentId,
  datasetVersion,
  criteria
}: UseLoadFilesCountInfoParams) => {
  const [filesCountInfo, setFilesCountInfo] = useState<FilesCountInfo>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getFilesCountInfo = useCallback(async () => {
    setIsLoading(true)

    try {
      const filesCountInfo = await getFilesCountInfoByDatasetPersistentId(
        filesRepository,
        datasetPersistentId,
        datasetVersion.number,
        criteria
      )
      setFilesCountInfo(filesCountInfo)
    } catch (err) {
      const errorMessage =
        err instanceof Error && err.message
          ? err.message
          : 'There was an error getting the files count info'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [filesRepository, datasetPersistentId, datasetVersion.number, criteria])

  useEffect(() => {
    void getFilesCountInfo()
  }, [getFilesCountInfo])

  return {
    filesCountInfo,
    isLoading,
    error
  }
}
