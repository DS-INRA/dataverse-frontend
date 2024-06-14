import { MouseEvent, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FieldErrors, FormProvider, useForm } from 'react-hook-form'
import { useSession } from '../../../../session/SessionContext'
import { Form, Accordion, Alert, Button } from '@iqss/dataverse-design-system'
import { type DatasetRepository } from '../../../../../dataset/domain/repositories/DatasetRepository'
import { type MetadataBlockInfo } from '../../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { type DatasetMetadataFormValues } from '../MetadataFieldsHelper'
import { type DatasetMetadataFormMode } from '..'
import { Route } from '../../../../Route.enum'
import { SubmissionStatus, useSubmitDataset } from '../useSubmitDataset'
import { MetadataBlockFormFields } from './MetadataBlockFormFields'
import { RequiredFieldText } from '../../RequiredFieldText/RequiredFieldText'
import { SeparationLine } from '../../../layout/SeparationLine/SeparationLine'
import styles from './index.module.scss'

interface FormProps {
  mode: DatasetMetadataFormMode
  collectionId: string
  formDefaultValues: DatasetMetadataFormValues
  metadataBlocksInfo: MetadataBlockInfo[]
  errorLoadingMetadataBlocksInfo: string | null
  datasetRepository: DatasetRepository
}

export const MetadataForm = ({
  mode,
  collectionId,
  formDefaultValues,
  metadataBlocksInfo,
  errorLoadingMetadataBlocksInfo,
  datasetRepository
}: FormProps) => {
  const { user } = useSession()
  const navigate = useNavigate()
  const { t } = useTranslation('datasetMetadataForm')

  const accordionRef = useRef<HTMLDivElement>(null)
  const formContainerRef = useRef<HTMLDivElement>(null)

  const onCreateMode = mode === 'create'
  const isErrorLoadingMetadataBlocks = Boolean(errorLoadingMetadataBlocksInfo)

  const form = useForm({ mode: 'onChange', defaultValues: formDefaultValues })
  const { setValue } = form

  const { submissionStatus, submitError, submitForm } = useSubmitDataset(
    mode,
    collectionId,
    datasetRepository,
    onSubmitDatasetError
  )

  useEffect(() => {
    // Only on create mode, lets prefill specific fields with user data
    if (mode === 'create' && user) {
      setValue('citation.author.0.authorName', user.displayName)
      setValue('citation.datasetContact.0.datasetContactName', user.displayName)
      setValue('citation.datasetContact.0.datasetContactEmail', user.email, {
        shouldValidate: true
      })
      if (user.affiliation) {
        setValue('citation.datasetContact.0.datasetContactAffiliation', user.affiliation)
        setValue('citation.author.0.authorAffiliation', user.affiliation)
      }
    }
  }, [setValue, user, mode])

  const handleCancel = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    navigate(Route.HOME)
  }

  const onInvalidSubmit = (errors: FieldErrors<DatasetMetadataFormValues>) => {
    if (!accordionRef.current) return
    /*
    Get the first metadata block accordion item with an error, and if it's collapsed, open it
    Only for the case when accordion is closed, otherwise focus is already handled by react-hook-form
    */
    const firstMetadataBlockNameWithError = Object.keys(errors)[0]

    const accordionItemsButtons: HTMLButtonElement[] = Array.from(
      accordionRef.current.querySelectorAll('button.accordion-button')
    )

    accordionItemsButtons.forEach((button) => {
      const parentItem = button.closest('.accordion-item')
      const itemBlockName = parentItem?.id.split('-').pop()
      const buttonIsCollapsed = button.classList.contains('collapsed')

      if (itemBlockName === firstMetadataBlockNameWithError && buttonIsCollapsed) {
        button.click()

        setTimeout(
          /* istanbul ignore next */ () => {
            const focusedElement = document.activeElement
            focusedElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          },
          800
        )
      }
    })
  }

  function onSubmitDatasetError() {
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const disableSubmitButton = useMemo(() => {
    return isErrorLoadingMetadataBlocks || submissionStatus === SubmissionStatus.IsSubmitting
  }, [isErrorLoadingMetadataBlocks, submissionStatus])

  return (
    <div className={styles['form-container']} ref={formContainerRef}>
      <RequiredFieldText />

      {isErrorLoadingMetadataBlocks && (
        <Alert variant="danger" dismissible={false}>
          {errorLoadingMetadataBlocksInfo}
        </Alert>
      )}
      {submissionStatus === SubmissionStatus.IsSubmitting && <p>{t('status.submitting')}</p>}

      {submissionStatus === SubmissionStatus.SubmitComplete && <p>{t('status.success')}</p>}

      {submissionStatus === SubmissionStatus.Errored && (
        <Alert variant={'danger'} customHeading={t('validationAlert.title')} dismissible={false}>
          {submitError}
        </Alert>
      )}

      <FormProvider {...form}>
        <Form onSubmit={form.handleSubmit(submitForm, onInvalidSubmit)}>
          {metadataBlocksInfo.length > 0 && (
            <Accordion defaultActiveKey="0" ref={accordionRef}>
              {metadataBlocksInfo.map((metadataBlock, index) => (
                <Accordion.Item
                  eventKey={index.toString()}
                  id={`metadata-block-item-${metadataBlock.name}`}
                  key={metadataBlock.id}>
                  <Accordion.Header>{metadataBlock.displayName}</Accordion.Header>
                  <Accordion.Body>
                    <MetadataBlockFormFields metadataBlock={metadataBlock} />
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          )}

          <SeparationLine />

          {onCreateMode && (
            <Alert variant={'info'} customHeading={t('metadataTip.title')} dismissible={false}>
              {t('metadataTip.content')}
            </Alert>
          )}

          <Button type="submit" disabled={disableSubmitButton}>
            {onCreateMode ? t('saveButton.createMode') : t('saveButton.editMode')}
          </Button>
          <Button
            withSpacing
            variant="secondary"
            type="button"
            onClick={handleCancel}
            disabled={submissionStatus === SubmissionStatus.IsSubmitting}>
            {t('cancelButton')}
          </Button>
        </Form>
      </FormProvider>
    </div>
  )
}