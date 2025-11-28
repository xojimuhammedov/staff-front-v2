import { Dispatch, SetStateAction } from 'react';

type ReactText = string | number;
import { ReactElement, ReactPortal, SVGProps } from 'react';

type ReactChild = ReactElement | ReactText;

interface ReactNodeArray extends Array<ReactNode> { }
type ReactFragment = ReactNodeArray;
export type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;

export type SvgComponentProps = SVGProps<SVGSVGElement>;


export interface BaseModalProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    isLoading?: boolean;
    title: string,
    subTitle: string
}
export interface ConfirmationModalProps extends BaseModalProps {
    confirmationDelete: () => void;
}