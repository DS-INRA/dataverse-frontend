import { Form } from '@iqss/dataverse-design-system'

interface Props {
  name: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  isInvalid: boolean
  disabled: boolean
}

export const TextBoxField = ({ name, onChange, isInvalid, disabled, ...props }: Props) => {
  return (
    <Form.Group.TextArea
      name={name}
      disabled={disabled}
      onChange={onChange}
      isInvalid={isInvalid}
      {...props}
    />
  )
}
