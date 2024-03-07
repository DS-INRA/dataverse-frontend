import { useState } from 'react'
import { DatasetDTO, initialDatasetDTO } from '../../dataset/domain/useCases/DTOs/DatasetDTO'
import _ from 'lodash'

const initialState: DatasetDTO = JSON.parse(JSON.stringify(initialDatasetDTO)) as DatasetDTO
export const useDatasetFormData = (
  datasetIsValid: (formData: DatasetDTO) => boolean
): {
  formData: DatasetDTO
  updateFormData: (name: string, value: string) => void
} => {
  const [formData, setFormData] = useState(initialState)

  const updateFormData = (name: string, value: string) => {
    const updatedFormData = _.cloneDeep(getUpdatedFormData(formData, name, value))

    setFormData(updatedFormData)
    datasetIsValid(updatedFormData)
  }

  const getUpdatedFormData = (
    currentFormData: DatasetDTO,
    name: string,
    value: string
  ): DatasetDTO => {
    const objectFromPath: DatasetDTO = initialState
    _.set(objectFromPath, name, value)

    return objectFromPath
  }

  return {
    formData,
    updateFormData
  }
}
