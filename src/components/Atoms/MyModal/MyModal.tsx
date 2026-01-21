import {
  Modal,
  ModalFooterProps,
  ModalBodyProps,
  ModalHeaderProps,
  ModalProps
} from 'flowbite-react';
import { ReactNode, FC } from 'react';
import { twMerge } from 'tailwind-merge';

type TypeWithChildren<T> = T & { children?: ReactNode; className?: string | string[] };

interface MyModalProps {
  modalProps?: TypeWithChildren<ModalProps>;
  footerProps?: TypeWithChildren<ModalFooterProps>;
  bodyProps?: TypeWithChildren<ModalBodyProps>;
  headerProps?: TypeWithChildren<ModalHeaderProps>;
  children?: ReactNode;
}

const MyModal: FC<MyModalProps> = ({
  bodyProps,
  modalProps,
  footerProps,
  headerProps,
  children
}) => {
  return (
    <Modal dismissible {...modalProps} className={twMerge(['dark:bg-bg-dark-bg', modalProps?.className])}>
      <Modal.Header
        {...headerProps}
        className={twMerge(['border-none px-4 pt-4 dark:bg-bg-dark-bg dark:border-gray-700', headerProps?.className])}>
        {headerProps?.children}
      </Modal.Header>
      <Modal.Body {...bodyProps} className={twMerge(['px-4 py-0 dark:bg-bg-dark-bg', bodyProps?.className])}>
        {bodyProps?.children || children}
      </Modal.Body>
      <Modal.Footer
        {...footerProps}
        className={twMerge(['pb-t border-none px-4 pt-0 dark:bg-bg-dark-bg dark:border-gray-700', footerProps?.className])}>
        {footerProps?.children}
      </Modal.Footer>
    </Modal>
  );
};

export default MyModal;
