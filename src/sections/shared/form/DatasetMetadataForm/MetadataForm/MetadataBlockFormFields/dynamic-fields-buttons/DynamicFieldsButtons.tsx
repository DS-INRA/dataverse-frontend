import { MouseEvent } from 'react'
import { Button, Tooltip } from '@iqss/dataverse-design-system'
import { Dash, Plus } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'
import styles from './DynamicFieldsButtons.module.scss'

interface AddFieldButtonsProps {
  fieldName: string
  originalField?: boolean
  onAddButtonClick: (event: MouseEvent<HTMLButtonElement>) => void
  onRemoveButtonClick: (event: MouseEvent<HTMLButtonElement>) => void
}

export function DynamicFieldsButtons({
  fieldName,
  originalField,
  onAddButtonClick,
  onRemoveButtonClick
}: AddFieldButtonsProps) {
  const { t } = useTranslation('createDataset')
  return (
    <div className={styles.container}>
      <Tooltip placement="top" overlay={t('datasetForm.addRowButton')}>
        <Button
          type="button"
          variant="secondary"
          onClick={onAddButtonClick}
          className="px-2"
          aria-label={`${t('datasetForm.addRowButton')} ${fieldName}`}>
          <Plus title="Add" size={24} />
        </Button>
      </Tooltip>
      {!originalField && (
        <Tooltip placement="top" overlay={t('datasetForm.deleteRowButton')}>
          <Button
            type="button"
            variant="secondary"
            onClick={onRemoveButtonClick}
            className="px-2"
            aria-label={`${t('datasetForm.deleteRowButton')} ${fieldName}`}>
            <Dash title="Delete" size={24} />
          </Button>
        </Tooltip>
      )}
    </div>
  )
}
