import { Form as FormBS } from 'react-bootstrap'
import { Col } from '../../grid/Col'

interface FormInputProps {
  type: 'text' | 'email' | 'password'
  placeholder?: string
  required?: boolean
}

export function FormInput({ type, placeholder, required }: FormInputProps) {
  return (
    <Col sm={9}>
      <FormBS.Control type={type} placeholder={placeholder} required={required} />
    </Col>
  )
}
