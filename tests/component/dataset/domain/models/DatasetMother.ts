import { faker } from '@faker-js/faker'
import {
  ANONYMIZED_FIELD_VALUE,
  Dataset,
  DatasetStatus,
  LabelSemanticMeaning
} from '../../../../../src/dataset/domain/models/Dataset'
import { MetadataBlockName } from '../../../../../src/dataset/domain/models/Dataset'

export class DatasetMother {
  static createEmpty(): undefined {
    return undefined
  }

  static create(props?: Partial<Dataset>): Dataset {
    return {
      id: faker.datatype.uuid(),
      title: faker.lorem.sentence(),
      version: faker.datatype.uuid(),
      status: DatasetStatus.PUBLISHED,
      citation: {
        citationText: 'Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Test Terms" ',
        pidUrl: 'https://doi.org/10.70122/FK2/KLX4XO',
        publisher: 'Demo Dataverse'
      },
      license: {
        name: 'CC0 1.0',
        shortDescription: 'CC0 1.0 Universal Public Domain Dedication',
        uri: 'https://creativecommons.org/publicdomain/zero/1.0/',
        iconUrl: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
      },
      labels: [
        {
          value: faker.lorem.word(),
          semanticMeaning: faker.helpers.arrayElement(Object.values(LabelSemanticMeaning))
        },
        {
          value: faker.lorem.word(),
          semanticMeaning: faker.helpers.arrayElement(Object.values(LabelSemanticMeaning))
        },
        {
          value: faker.lorem.word(),
          semanticMeaning: faker.helpers.arrayElement(Object.values(LabelSemanticMeaning))
        },
        {
          value: faker.lorem.word(),
          semanticMeaning: faker.helpers.arrayElement(Object.values(LabelSemanticMeaning))
        }
      ],
      metadataBlocks: [
        {
          name: MetadataBlockName.CITATION,
          fields: {
            title: faker.lorem.sentence(),
            author: [
              {
                authorName: faker.lorem.sentence(),
                authorAffiliation: faker.lorem.sentence(),
                authorIdentifierScheme: faker.lorem.sentence(),
                authorIdentifier: faker.lorem.sentence()
              },
              {
                authorName: faker.lorem.sentence(),
                authorAffiliation: faker.lorem.sentence(),
                authorIdentifierScheme: faker.lorem.sentence(),
                authorIdentifier: faker.lorem.sentence()
              }
            ]
          }
        },
        {
          name: MetadataBlockName.GEOSPATIAL,
          fields: {
            geographicCoverage: [
              {
                geographicCoverageCountry: faker.lorem.sentence(),
                geographicCoverageCity: faker.lorem.sentence()
              },
              {
                geographicCoverageCountry: faker.lorem.sentence(),
                geographicCoverageCity: faker.lorem.sentence()
              }
            ]
          }
        }
      ],
      summaryFields: [
        {
          title: 'Description',
          description: 'this is the description field',
          value: faker.lorem.paragraph(3)
        },

        {
          title: 'Subject',
          description: 'this is the subject field',
          value: faker.lorem.words(5)
        },
        {
          title: 'Keyword',
          description: 'this is the keyword field',
          value: faker.lorem.words(3)
        },
        {
          title: 'Related Publication',
          description: 'this is the keyword field',
          value: faker.lorem.words(3)
        },
        {
          title: 'Notes',
          description: 'this is the notes field',
          value: faker.lorem.paragraph(3)
        }
      ],
      ...props
    }
  }

  static createAnonymized(): Dataset {
    return this.create({
      metadataBlocks: [
        {
          name: MetadataBlockName.CITATION,
          fields: {
            title: faker.lorem.sentence(),
            author: ANONYMIZED_FIELD_VALUE
          }
        },
        {
          name: MetadataBlockName.GEOSPATIAL,
          fields: {
            geographicCoverage: ANONYMIZED_FIELD_VALUE
          }
        }
      ]
    })
  }
}
