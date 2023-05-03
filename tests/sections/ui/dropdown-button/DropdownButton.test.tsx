import { fireEvent, render } from '@testing-library/react'
import { DropdownButton } from '../../../../src/sections/ui/dropdown-button/DropdownButton'
import { Icon } from '../../../../src/sections/ui/icon.enum'
import styles from '../../../../src/sections/ui/dropdown-button/DropdownButton.module.scss'

const titleText = 'My Dropdown Button'

describe('DropdownButton', () => {
  it('renders the provided title', () => {
    const { getByText } = render(
      <DropdownButton id="my-dropdown" title={titleText} variant="primary">
        <span>Item 1</span>
        <span>Item 2</span>
      </DropdownButton>
    )

    expect(getByText(titleText)).toBeInTheDocument()
  })

  it('renders the provided children', async () => {
    const { getByText, findByText } = render(
      <DropdownButton id="my-dropdown" title="My Dropdown Button" variant="primary">
        <span>Item 1</span>
        <span>Item 2</span>
      </DropdownButton>
    )

    const dropdownButton = getByText(titleText)

    fireEvent.click(dropdownButton)

    const item1 = await findByText('Item 1')
    expect(item1).toBeInTheDocument()

    const item2 = await findByText('Item 2')
    expect(item2).toBeInTheDocument()
  })

  it('renders an icon when provided', () => {
    const { getByRole } = render(
      <DropdownButton
        id="my-dropdown"
        title="My Dropdown Button"
        variant="secondary"
        icon={Icon.COLLECTION}>
        <span>Item 1</span>
        <span>Item 2</span>
      </DropdownButton>
    )
    expect(getByRole('img', { name: Icon.COLLECTION })).toBeInTheDocument()
  })

  it('renders with spacing attributes', () => {
    const { getByText } = render(
      <DropdownButton id="my-dropdown" title="My Dropdown Button" variant="primary" withSpacing>
        <span>Item 1</span>
        <span>Item 2</span>
      </DropdownButton>
    )

    const dropdownButton = getByText(titleText)
    expect(dropdownButton.parentElement).toHaveClass(styles.spacing)
  })
})