import { Dialog } from '@headlessui/react';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { ConfirmationModalProps } from 'types/common';

export default function ConfirmationCredential({
  open,
  setOpen,
  confirmationDelete,
  title,
  subTitle,
}: ConfirmationModalProps) {
  return (
    <div>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <div className="fixed inset-0 bg-gray-500/75" aria-hidden="true" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Dialog.Panel className="relative overflow-hidden rounded-lg bg-white text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-base font-semibold text-gray-900">
                      {title}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{subTitle}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 gap-4 sm:flex sm:flex-row-reverse sm:px-6">
                <MyButton
                  type="button"
                  onClick={confirmationDelete}
                  variant="primary"
                  className={'w-[60px]'}
                >
                  Ok
                </MyButton>
                <MyButton
                  type="button"
                  data-autofocus
                  variant="secondary"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </MyButton>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
