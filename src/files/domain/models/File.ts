export enum FileSizeUnit {
  BYTES = 'B',
  KILOBYTES = 'KB',
  MEGABYTES = 'MB',
  GIGABYTES = 'GB',
  TERABYTES = 'TB',
  PETABYTES = 'PB'
}

export class FileSize {
  constructor(readonly value: number, readonly unit: FileSizeUnit) {}

  toString(): string {
    return `${this.value} ${this.unit}`
  }

  toBytes(): number {
    const multiplier = {
      [FileSizeUnit.BYTES]: 1,
      [FileSizeUnit.KILOBYTES]: 1024,
      [FileSizeUnit.MEGABYTES]: 1024 ** 2,
      [FileSizeUnit.GIGABYTES]: 1024 ** 3,
      [FileSizeUnit.TERABYTES]: 1024 ** 4,
      [FileSizeUnit.PETABYTES]: 1024 ** 5
    }

    return this.value * multiplier[this.unit]
  }
}

export interface FileAccess {
  restricted: boolean
  canBeRequested: boolean
  requested: boolean
}

export enum FileAccessStatus {
  PUBLIC = 'public',
  RESTRICTED = 'restricted',
  RESTRICTED_WITH_ACCESS = 'restrictedAccess',
  EMBARGOED = 'embargoed',
  EMBARGOED_RESTRICTED = 'embargoedRestricted'
}

export enum FileStatus {
  DRAFT = 'draft',
  RELEASED = 'released',
  DEACCESSIONED = 'deaccessioned'
}

export class FileVersion {
  constructor(
    public readonly majorNumber: number,
    public readonly minorNumber: number,
    public readonly status: FileStatus
  ) {}

  toString(): string {
    return `${this.majorNumber}.${this.minorNumber}`
  }
}

export enum FileDateType {
  METADATA_RELEASED = 'metadataReleased',
  PUBLISHED = 'published',
  DEPOSITED = 'deposited'
}

export enum FileVersionNotNumber {
  LATEST = 'latest',
  DRAFT = 'draft'
}

export interface FileDate {
  type: FileDateType
  date: string
}

export class FileEmbargo {
  constructor(readonly dateAvailable: Date) {}

  get isActive(): boolean {
    return this.dateAvailable > new Date()
  }
}

export interface FileTabularData {
  variablesCount: number
  observationsCount: number
  unf: string
}

export enum FileLabelType {
  CATEGORY = 'category',
  TAG = 'tag'
}
export interface FileLabel {
  type: FileLabelType
  value: string
}

export class FileType {
  constructor(readonly value: string) {}

  toDisplayFormat(): string {
    const words = this.value.split(' ')
    return words
      .map((word) => {
        return word[0].toUpperCase() + word.substring(1)
      })
      .join(' ')
  }
}

export enum FileLockStatus {
  LOCKED = 'locked',
  UNLOCKED = 'unlocked',
  OPEN = 'open'
}

export interface FilePermissions {
  canDownload: boolean
}

export class File {
  constructor(
    readonly id: string,
    readonly version: FileVersion,
    readonly name: string,
    readonly access: FileAccess,
    readonly permissions: FilePermissions,
    readonly type: FileType,
    readonly size: FileSize,
    readonly date: FileDate,
    readonly downloads: number,
    readonly labels: FileLabel[],
    readonly checksum?: string,
    readonly thumbnail?: string,
    readonly directory?: string,
    readonly embargo?: FileEmbargo,
    readonly tabularData?: FileTabularData,
    readonly description?: string
  ) {}

  getLink(): string {
    return `/file?id=${this.id}&version=${this.version.toString()}`
  }

  get accessStatus(): FileAccessStatus {
    if (!this.access.restricted && !this.isActivelyEmbargoed) {
      return FileAccessStatus.PUBLIC
    }
    if (!this.permissions.canDownload) {
      if (!this.isActivelyEmbargoed) {
        return FileAccessStatus.RESTRICTED
      }
      return FileAccessStatus.EMBARGOED_RESTRICTED
    }
    if (!this.isActivelyEmbargoed) {
      return FileAccessStatus.RESTRICTED_WITH_ACCESS
    }
    return FileAccessStatus.EMBARGOED
  }

  get lockStatus(): FileLockStatus {
    if (!this.access.restricted && !this.isActivelyEmbargoed) {
      return FileLockStatus.OPEN
    }
    if (!this.permissions.canDownload) {
      return FileLockStatus.LOCKED
    }
    return FileLockStatus.UNLOCKED
  }

  get isActivelyEmbargoed(): boolean {
    if (this.embargo) {
      return this.embargo.isActive
    }
    return false
  }
}
