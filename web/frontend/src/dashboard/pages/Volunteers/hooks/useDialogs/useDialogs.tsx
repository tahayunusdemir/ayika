import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import useEventCallback from '@mui/utils/useEventCallback';
import DialogsContext from './DialogsContext';
import type { OpenDialog, CloseDialog, DialogProps, OpenDialogOptions } from './types';

export type { OpenDialog, CloseDialog, DialogProps, OpenDialogOptions } from './types';

export interface AlertOptions extends OpenDialogOptions<void> {
  /**
   * A title for the dialog. Defaults to `'Alert'`.
   */
  title?: React.ReactNode;
  /**
   * The text to show in the "Ok" button. Defaults to `'Ok'`.
   */
  okText?: React.ReactNode;
}

export interface ConfirmOptions extends OpenDialogOptions<boolean> {
  /**
   * A title for the dialog. Defaults to `'Confirm'`.
   */
  title?: React.ReactNode;
  /**
   * The text to show in the "Ok" button. Defaults to `'Ok'`.
   */
  okText?: React.ReactNode;
  /**
   * Denotes the purpose of the dialog. This will affect the color of the
   * "Ok" button. Defaults to `undefined`.
   */
  severity?: 'error' | 'info' | 'success' | 'warning';
  /**
   * The text to show in the "Cancel" button. Defaults to `'Cancel'`.
   */
  cancelText?: React.ReactNode;
}

export interface PromptOptions extends OpenDialogOptions<string | null> {
  /**
   * A title for the dialog. Defaults to `'Prompt'`.
   */
  title?: React.ReactNode;
  /**
   * The text to show in the "Ok" button. Defaults to `'Ok'`.
   */
  okText?: React.ReactNode;
  /**
   * The text to show in the "Cancel" button. Defaults to `'Cancel'`.
   */
  cancelText?: React.ReactNode;
}

export interface OpenAlertDialog {
  /**
   * Open an alert dialog. Returns a promise that resolves when the user
   * closes the dialog.
   *
   * @param msg The message to show in the dialog.
   * @param options Additional options for the dialog.
   * @returns A promise that resolves when the dialog is closed.
   */
  (msg: React.ReactNode, options?: AlertOptions): Promise<void>;
}

export interface OpenConfirmDialog {
  /**
   * Open a confirmation dialog. Returns a promise that resolves to true if
   * the user confirms, false if the user cancels.
   *
   * @param msg The message to show in the dialog.
   * @param options Additional options for the dialog.
   * @returns A promise that resolves to true if the user confirms, false if the user cancels.
   */
  (msg: React.ReactNode, options?: ConfirmOptions): Promise<boolean>;
}

export interface OpenPromptDialog {
  /**
   * Open a prompt dialog to request user input. Returns a promise that resolves to the input
   * if the user confirms, null if the user cancels.
   *
   * @param msg The message to show in the dialog.
   * @param options Additional options for the dialog.
   * @returns A promise that resolves to the user input if the user confirms, null if the user cancels.
   */
  (msg: React.ReactNode, options?: PromptOptions): Promise<string | null>;
}


export interface DialogHook {
  alert: OpenAlertDialog;
  confirm: OpenConfirmDialog;
  prompt: OpenPromptDialog;
  open: OpenDialog;
  close: CloseDialog;
}

function useDialogLoadingButton(onClose: () => Promise<void>) {
  const [loading, setLoading] = React.useState(false);
  const handleClick = async () => {
    try {
      setLoading(true);
      await onClose();
    } finally {
      setLoading(false);
    }
  };
  return {
    onClick: handleClick,
    loading,
  };
}

export interface AlertDialogPayload extends AlertOptions {
  msg: React.ReactNode;
}

export interface AlertDialogProps extends DialogProps<AlertDialogPayload, void> {}

export function AlertDialog({ open, payload, onClose }: AlertDialogProps) {
  const okButtonProps = useDialogLoadingButton(() => onClose());

  return (
    <Dialog maxWidth="xs" fullWidth open={open} onClose={() => onClose()}>
      <DialogTitle>{payload.title ?? 'Alert'}</DialogTitle>
      <DialogContent>{payload.msg}</DialogContent>
      <DialogActions>
        <Button disabled={!open} {...okButtonProps}>
          {payload.okText ?? 'Ok'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export interface ConfirmDialogPayload extends ConfirmOptions {
  msg: React.ReactNode;
}

export interface ConfirmDialogProps
  extends DialogProps<ConfirmDialogPayload, boolean> {}

export function ConfirmDialog({ open, payload, onClose }: ConfirmDialogProps) {
  const cancelButtonProps = useDialogLoadingButton(() => onClose(false));
  const okButtonProps = useDialogLoadingButton(() => onClose(true));

  return (
    <Dialog maxWidth="xs" fullWidth open={open} onClose={() => onClose(false)}>
      <DialogTitle>{payload.title ?? 'Confirm'}</DialogTitle>
      <DialogContent>{payload.msg}</DialogContent>
      <DialogActions>
        <Button autoFocus disabled={!open} {...cancelButtonProps}>
          {payload.cancelText ?? 'Cancel'}
        </Button>
        <Button color={payload.severity} disabled={!open} {...okButtonProps}>
          {payload.okText ?? 'Ok'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export interface PromptDialogPayload extends PromptOptions {
  msg: React.ReactNode;
}

export interface PromptDialogProps
  extends DialogProps<PromptDialogPayload, string | null> {}

export function PromptDialog({ open, payload, onClose }: PromptDialogProps) {
  const [input, setInput] = React.useState('');
  const cancelButtonProps = useDialogLoadingButton(() => onClose(null));

  const [loading, setLoading] = React.useState(false);

  const name = 'input';
  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      open={open}
      onClose={() => onClose(null)}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            try {
              setLoading(true);
              const formData = new FormData(event.currentTarget);
              const value = formData.get(name) ?? '';

              if (typeof value !== 'string') {
                throw new Error('Value must come from a text input.');
              }

              await onClose(value);
            } finally {
              setLoading(false);
            }
          },
        },
      }}
    >
      <DialogTitle>{payload.title ?? 'Confirm'}</DialogTitle>
      <DialogContent>
        <DialogContentText>{payload.msg} </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="name"
          name={name}
          type="text"
          fullWidth
          variant="standard"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={!open} {...cancelButtonProps}>
          {payload.cancelText ?? 'Cancel'}
        </Button>
        <Button disabled={!open || loading} type="submit">
          {payload.okText ?? 'Ok'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function useDialogs(): DialogHook {
  const dialogsContext = React.useContext(DialogsContext);
  if (!dialogsContext) {
    throw new Error('Dialogs context was used without a provider.');
  }
  const { open, close } = dialogsContext;

  const alert = useEventCallback<OpenAlertDialog>(
    (msg, { onClose, ...options } = {}) =>
      open(AlertDialog, { ...options, msg }, { onClose }),
  );

  const confirm = useEventCallback<OpenConfirmDialog>(
    (msg, { onClose, ...options } = {}) =>
      open(ConfirmDialog, { ...options, msg }, { onClose }),
  );

  const prompt = useEventCallback<OpenPromptDialog>(
    (msg, { onClose, ...options } = {}) =>
      open(PromptDialog, { ...options, msg }, { onClose }),
  );

  return React.useMemo(
    () => ({
      alert,
      confirm,
      prompt,
      open,
      close,
    }),
    [alert, close, confirm, open, prompt],
  );
}
