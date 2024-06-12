import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DatasetRepository } from '../../../../dataset/domain/repositories/DatasetRepository'
import { createDataset } from '../../../../dataset/domain/useCases/createDataset'
import { MetadataFieldsHelper, type DatasetMetadataFormValues } from './MetadataFieldsHelper'
import { getValidationFailedFieldError } from '../../../../metadata-block-info/domain/models/fieldValidations'
import { type DatasetMetadataFormMode } from '.'
import { Route } from '../../../Route.enum'

export enum SubmissionStatus {
  NotSubmitted = 'NotSubmitted',
  IsSubmitting = 'IsSubmitting',
  SubmitComplete = 'SubmitComplete',
  Errored = 'Errored'
}

type UseSubmitDatasetReturnType =
  | {
      submissionStatus:
        | SubmissionStatus.NotSubmitted
        | SubmissionStatus.IsSubmitting
        | SubmissionStatus.SubmitComplete
      submitForm: (formData: DatasetMetadataFormValues) => void
      submitError: null
    }
  | {
      submissionStatus: SubmissionStatus.Errored
      submitForm: (formData: DatasetMetadataFormValues) => void
      submitError: string
    }

export function useSubmitDataset(
  mode: DatasetMetadataFormMode,
  collectionId: string,
  datasetRepository: DatasetRepository,
  onSubmitErrorCallback: () => void
): UseSubmitDatasetReturnType {
  const navigate = useNavigate()
  const { t } = useTranslation('createDataset')

  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NotSubmitted
  )
  const [submitError, setSubmitError] = useState<string | null>(null)

  const submitForm = (formData: DatasetMetadataFormValues): void => {
    setSubmissionStatus(SubmissionStatus.IsSubmitting)

    const formDataBackToOriginalKeys = MetadataFieldsHelper.replaceSlashKeysWithDot(formData)

    const formattedFormValues = MetadataFieldsHelper.formatFormValuesToDatasetDTO(
      formDataBackToOriginalKeys
    )

    if (mode === 'create') {
      createDataset(datasetRepository, formattedFormValues, collectionId)
        .then(({ persistentId }) => {
          setSubmitError(null)
          setSubmissionStatus(SubmissionStatus.SubmitComplete)
          navigate(`${Route.DATASETS}?persistentId=${persistentId}`, {
            state: { created: true }
          })
          return
        })
        .catch((err) => {
          const errorMessage =
            err instanceof Error && err.message
              ? getValidationFailedFieldError(err.message) ?? err.message
              : t('validationAlert.content')

          setSubmitError(errorMessage)
          setSubmissionStatus(SubmissionStatus.Errored)

          onSubmitErrorCallback()
        })
    } else {
      // TODO:ME Update dataset metadata use case here
    }
  }

  return {
    submissionStatus,
    submitForm,
    submitError
  } as UseSubmitDatasetReturnType
}
