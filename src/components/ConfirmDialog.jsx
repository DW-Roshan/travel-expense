'use client'

import { useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

// Third-party Imports
import classnames from 'classnames'

const ConfirmDialog = ({
  open,
  setOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Yes',
  cancelText = 'Cancel',
  successMessage = 'Action completed successfully!',
  failureMessage = 'Something went wrong. Please try again.',
  cancelMessage = 'Action cancelled!',
  icon = 'tabler-alert-circle',
  onConfirm = async () => {},
  onCancel = () => {}
}) => {
  const [secondDialog, setSecondDialog] = useState(false)
  const [status, setStatus] = useState('idle') // 'success' | 'error' | 'cancel'
  const [loading, setLoading] = useState(false)

  const handleSecondDialogClose = () => {
    setSecondDialog(false)
    setOpen(false)
  }

  const handleConfirmation = async (confirmed) => {
    if (!confirmed) {

      // user clicked Cancel

      setStatus('cancel')
      setSecondDialog(true)
      setOpen(false)
      onCancel()

      return
    }

    // user clicked Confirm
    setLoading(true)

    try {

      await onConfirm() // wait for API or async task

      setStatus('success')
    } catch (error) {

      // console.error('Error in onConfirm:', error)

      setStatus('error')
    } finally {
      setLoading(false)
      setSecondDialog(true)
      setOpen(false)
    }
  }

  const isSuccess = status === 'success'
  const isError = status === 'error'
  const isCancel = status === 'cancel'

  return (
    <>
      {/* Main confirmation dialog */}
      <Dialog
        fullWidth
        maxWidth='xs'
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition={false}
      >
        <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          <i className={`${icon} text-[88px] mbe-6 text-warning`} />
          <Typography variant='h4'>{title}</Typography>
          <Typography color='text.primary'>{message}</Typography>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button
            variant='contained'
            onClick={() => handleConfirmation(true)}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color='inherit' /> : null}
          >
            {loading ? 'Processing...' : confirmText}
          </Button>
          <Button
            variant='tonal'
            color='secondary'
            onClick={() => handleConfirmation(false)}
            disabled={loading}
          >
            {cancelText}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback dialog */}
      <Dialog open={secondDialog} onClose={handleSecondDialogClose} closeAfterTransition={false}>
        <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          <i
            className={classnames('text-[88px] mbe-6', {
              'tabler-circle-check text-success': isSuccess,
              'tabler-circle-x text-error': isError || isCancel
            })}
          />
          <Typography variant='h4' className='mbe-2'>
            {isSuccess ? 'Success' : isError ? 'Failed' : 'Cancelled'}
          </Typography>
          <Typography color='text.primary'>
            {isSuccess
              ? successMessage
              : isError
              ? failureMessage
              : cancelMessage}
          </Typography>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button
            variant='contained'
            color={isSuccess ? 'success' : isError ? 'error' : 'secondary'}
            onClick={handleSecondDialogClose}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ConfirmDialog
