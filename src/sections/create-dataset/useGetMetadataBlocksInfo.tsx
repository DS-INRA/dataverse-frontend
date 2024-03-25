import { useEffect, useState } from 'react'
import { getMetadataBlockInfoByCollectionId } from '../../metadata-block-info/domain/useCases/getMetadataBlockInfoByCollectionId'
import { MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfo2 } from '../../metadata-block-info/domain/models/MetadataBlockInfo'

interface Props {
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  collectionId: string
  mode: 'create' | 'edit'
}
/**
 * Hook to get the metadata blocks to show and its info, based on the parent collection id of the dataset
 *
 * @param metadataBlockInfoRepository The repository to get the metadata block info
 * @param collectionId The id of the collection that the dataset belongs to
 * @param mode The mode of the form (create or edit), if edit mode, this hook will return only the metadata blocks that have displayOnCreate set to true
 */
export const useGetMetadataBlocksInfo = ({
  metadataBlockInfoRepository,
  collectionId,
  mode
}: Props) => {
  const [metadataBlocks, setMetadataBlocks] = useState<MetadataBlockInfo2[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const onCreateMode = mode === 'create'

  // Filter the metadata blocks to show only the ones that have displayOnCreate set to true and its metadata fields that also have displayOnCreate set to true
  const filterMetadataBlocksOnCreateMode = (metadataBlocks: MetadataBlockInfo2[]) => {
    return metadataBlocks
      .filter((metadataBlockInfo) => metadataBlockInfo.displayOnCreate === true)
      .map((metadataBlockInfo) => {
        const filteredMetadataFields: MetadataBlockInfo2['metadataFields'] = {}

        for (const field in metadataBlockInfo.metadataFields) {
          if (
            field in metadataBlockInfo.metadataFields &&
            metadataBlockInfo.metadataFields[field].displayOnCreate === true
          ) {
            filteredMetadataFields[field] = metadataBlockInfo.metadataFields[field]
          }
        }

        return {
          ...metadataBlockInfo,
          metadataFields: filteredMetadataFields
        }
      })
  }

  useEffect(() => {
    const handleGetDatasetMetadataBlockFields = async () => {
      setIsLoading(true)
      try {
        const metadataBlocksInfo = await getMetadataBlockInfoByCollectionId(
          metadataBlockInfoRepository,
          collectionId,
          onCreateMode
        )

        setMetadataBlocks(
          mode === 'create'
            ? filterMetadataBlocksOnCreateMode(metadataBlocksInfo)
            : metadataBlocksInfo
        )
      } catch (err) {
        console.error(err)
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong getting the datasets'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }
    void handleGetDatasetMetadataBlockFields()
  }, [])

  return {
    metadataBlocks,
    error,
    isLoading
  }
}