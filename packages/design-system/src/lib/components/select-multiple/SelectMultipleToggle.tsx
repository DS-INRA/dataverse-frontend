import { ForwardedRef, forwardRef } from 'react'
import { Dropdown as DropdownBS, Button as ButtonBS } from 'react-bootstrap'
import { X as CloseIcon } from 'react-bootstrap-icons'
import styles from './SelectMultiple.module.scss'

interface SelectMultipleToggleProps {
  selectedOptions: string[]
  handleRemoveSelectedOption: (option: string) => void
  isInvalid?: boolean
  isDisabled?: boolean
  inputButtonId?: string
  menuId: string
}

export const SelectMultipleToggle = forwardRef(
  (
    {
      selectedOptions,
      handleRemoveSelectedOption,
      isInvalid,
      isDisabled,
      inputButtonId,
      menuId
    }: SelectMultipleToggleProps,
    ref: ForwardedRef<HTMLInputElement | null>
  ) => {
    return (
      <div
        className={`${styles['select-multiple-toggle']} ${isDisabled ? styles['disabled'] : ''}`}>
        <DropdownBS.Toggle
          ref={ref}
          as="input"
          type="button"
          id={inputButtonId}
          disabled={isDisabled}
          aria-disabled={isDisabled}
          aria-invalid={isInvalid}
          aria-label="Toggle options menu"
          aria-controls={menuId}
          className={`${styles['select-multiple-toggle__input-button']} ${
            isInvalid ? styles['invalid'] : ''
          }`}
        />
        <div className={styles['select-multiple-toggle__inner-content']}>
          {selectedOptions.length > 0 ? (
            <div
              className={styles['selected-options-container']}
              aria-label="List of selected options">
              {selectedOptions.map((selectedOption) => (
                <div
                  className={styles['selected-options-container__item']}
                  onClick={(e) => e.stopPropagation()}
                  key={`selected-option-${selectedOption}`}>
                  <span className="me-2">{selectedOption}</span>
                  <ButtonBS
                    variant="primary"
                    aria-label={`Remove ${selectedOption} option`}
                    onClick={() => handleRemoveSelectedOption(selectedOption)}>
                    <CloseIcon size={14} />
                  </ButtonBS>
                </div>
              ))}
            </div>
          ) : (
            'Select...'
          )}
        </div>
      </div>
    )
  }
)

SelectMultipleToggle.displayName = 'SelectMultipleToggle'
