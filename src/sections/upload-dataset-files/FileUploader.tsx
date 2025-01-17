import { Button, Card, ProgressBar, useTheme } from '@iqss/dataverse-design-system'
import cn from 'classnames'
import { ChangeEventHandler, DragEventHandler, useEffect, useRef, useState } from 'react'
import { Plus, X } from 'react-bootstrap-icons'
import { FileUploadTools, FileUploaderState } from '../../files/domain/models/FileUploadState'
import styles from './FileUploader.module.scss'

export interface FileUploaderProps {
  upload: (files: File[]) => void
  cancelTitle: string
  info: string
  selectText: string
  fileUploaderState: FileUploaderState
  cancelUpload: (file: File) => void
}

export function FileUploader({
  upload,
  cancelTitle,
  info,
  selectText,
  fileUploaderState,
  cancelUpload
}: FileUploaderProps) {
  const theme = useTheme()
  const [files, setFiles] = useState<File[]>([])
  const [bgColor, setBackgroundColor] = useState(theme.color.primaryTextColor)

  const addFiles = (selectedFiles: FileList | null) => {
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles((alreadyAdded) => {
        const selectedFilesArray = Array.from(selectedFiles)
        const selectedFilesSet = new Set(selectedFilesArray.map((x) => FileUploadTools.key(x)))
        const alreadyAddedFiltered = alreadyAdded.filter(
          (x) => !selectedFilesSet.has(FileUploadTools.key(x))
        )
        return [...alreadyAddedFiltered, ...selectedFilesArray]
      })
    }
  }

  const addFile = (file: File) => {
    if (!files.some((x) => FileUploadTools.key(x) === FileUploadTools.key(file))) {
      setFiles((oldFiles) => [...oldFiles, file])
    }
  }

  // waiting on the possibility to test folder drop: https://github.com/cypress-io/cypress/issues/19696
  const addFromDir = /* istanbul ignore next */ (dir: FileSystemDirectoryEntry) => {
    const reader = dir.createReader()
    reader.readEntries(
      /* istanbul ignore next */ (entries) => {
        entries.forEach(
          /* istanbul ignore next */ (entry) => {
            if (entry.isFile) {
              const fse = entry as FileSystemFileEntry
              fse.file(/* istanbul ignore next */ (f) => addFile(f))
            } else if (entry.isDirectory) {
              addFromDir(entry as FileSystemDirectoryEntry)
            }
          }
        )
      }
    )
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    addFiles(event.target.files)
  }

  const handleDragEnter: DragEventHandler<HTMLDivElement> = () => {
    setBackgroundColor(theme.color.infoBoxColor)
  }

  const handleDragLeave: DragEventHandler<HTMLDivElement> = () => {
    setBackgroundColor(theme.color.primaryTextColor)
  }

  const handleDragOver: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    setBackgroundColor(theme.color.infoBoxColor)
  }

  const handleDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    setBackgroundColor(theme.color.primaryTextColor)
    const droppedItems = event.dataTransfer.items
    let ok = false
    if (droppedItems.length > 0) {
      Array.from(droppedItems).forEach((i) => {
        if (i.webkitGetAsEntry()?.isDirectory) {
          ok = true
          addFromDir(i.webkitGetAsEntry() as FileSystemDirectoryEntry)
        } else if (i.webkitGetAsEntry()?.isFile) {
          ok = true
          const fse = i.webkitGetAsEntry() as FileSystemFileEntry
          fse.file((f) => addFile(f))
        }
      })
    }
    const selectedFiles = event.dataTransfer.files
    if (!ok && selectedFiles && selectedFiles.length > 0) {
      addFiles(selectedFiles)
    }
  }

  const handleRemoveFile = (f: File) => {
    cancelUpload(f)
    setFiles((newFiles) =>
      newFiles.filter((x) => !FileUploadTools.get(x, fileUploaderState).removed)
    )
  }

  useEffect(() => {
    upload(files)
  }, [files, fileUploaderState, upload])

  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Card>
      <Card.Header>
        <Button variant="secondary" onClick={() => inputRef.current?.click()}>
          <Plus></Plus> {selectText}
        </Button>
      </Card.Header>
      <Card.Body style={{ backgroundColor: bgColor }}>
        <div
          className={styles.file_uploader}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          data-testid="drag-and-drop">
          <div>
            <input
              ref={inputRef}
              type="file"
              id="filePicker"
              onChange={handleChange}
              multiple
              hidden
            />
          </div>
          {files.filter((x) => !FileUploadTools.get(x, fileUploaderState).done).length > 0 ? (
            <div className={styles.files}>
              {files
                .filter((x) => !FileUploadTools.get(x, fileUploaderState).done)
                .map((file) => (
                  <div className={styles.file} key={FileUploadTools.key(file)}>
                    <div
                      className={cn(styles.file_name, {
                        [styles.failed]: FileUploadTools.get(file, fileUploaderState).failed
                      })}>
                      {file.webkitRelativePath}
                      {file.name}
                    </div>
                    <div className={styles.file_size}>
                      {FileUploadTools.get(file, fileUploaderState).fileSizeString}
                    </div>
                    <div className={styles.upload_progress}>
                      {FileUploadTools.get(file, fileUploaderState).progressHidden ? null : (
                        <ProgressBar now={FileUploadTools.get(file, fileUploaderState).progress} />
                      )}
                    </div>
                    <div className={styles.cancel_upload}>
                      <Button
                        variant="secondary"
                        {...{ size: 'sm' }}
                        withSpacing
                        onClick={() => handleRemoveFile(file)}>
                        <X className={styles.icon} title={cancelTitle} />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className={styles.info}>{info}</div>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}
