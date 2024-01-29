import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { DatasetMockRepository } from '../../dataset/DatasetMockRepository'
import { DatasetsList } from '../../../sections/home/datasets-list/DatasetsList'
import { DatasetLoadingMockRepository } from '../../dataset/DatasetLoadingMockRepository'
import { NoDatasetsMockRepository } from '../../dataset/NoDatasetsMockRepository'

const meta: Meta<typeof DatasetsList> = {
  title: 'Sections/Home/DatasetsList',
  component: DatasetsList,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetsList>

export const Default: Story = {
  render: () => <DatasetsList datasetRepository={new DatasetMockRepository()} />
}

export const Loading: Story = {
  render: () => <DatasetsList datasetRepository={new DatasetLoadingMockRepository()} />
}

export const NoResults: Story = {
  render: () => <DatasetsList datasetRepository={new NoDatasetsMockRepository()} />
}