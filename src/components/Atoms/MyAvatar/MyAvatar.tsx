import { CircleUserRound } from 'lucide-react';
import { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type ImageWithWithoutRefType = ComponentPropsWithoutRef<'img'>;

interface MyAvatarProps extends ImageWithWithoutRefType {
  size?: 'small' | 'medium' | 'large';
  shape?: 'circle' | 'square';
  imageUrl?: string;
  children?: ReactNode;
  isString?: boolean;
}

/**
 * Renders an avatar component with customizable size, shape, and content.
 * This component supports displaying an image via `imageUrl` or custom children elements.
 * The appearance can be adjusted with `size` and `shape` props to fit various UI requirements.
 *
 * @component
 * @param {MyAvatarProps} props - Properties to configure the MyAvatar component.
 * @param {'small' | 'medium' | 'large'} [props.size='small'] - Determines the size of the avatar. Default is 'small'.
 * @param {'circle' | 'square'} [props.shape='circle'] - Defines the shape of the avatar. Default is 'circle'.
 * @param {string} [props.imageUrl] - The URL of the image to be displayed as the avatar. If not provided, children will be used.
 * @param {ReactNode} [props.children] - Fallback or additional content to display in the avatar. This is used when `imageUrl` is not provided or as supplementary content.
 * @param {boolean} [props.isString=true] - Flag to indicate if the children are plain text. Helps with styling decisions.
 * @param {ComponentPropsWithoutRef<'img'>} [rest] - Any other properties supported by an `<img>` element that should be applied to the avatar when using an image.
 *
 * @example
 * // To render an avatar with a medium size, circular shape, and an image
 * <MyAvatar size="medium" shape="circle" imageUrl="path/to/image.jpg" />
 *
 * @example
 * // To render an avatar with custom text content, large size, and square shape
 * <MyAvatar size="large" shape="square" isString>{'User Initials'}</MyAvatar>
 *
 * @returns {React.ReactElement} The rendered avatar component.
 */

const MyAvatar: FC<MyAvatarProps> = ({
  size = 'small',
  shape = 'circle',
  imageUrl,
  children,
  isString = true,
  ...rest
}) => {
  const generalStyles = ['shadow-shadow-base bg-base  flex items-center justify-center '];

  const smallStyles = ['w-8 h-8'];
  const mediumStyles = ['w-10 h-10'];
  const largeStyles = ['w-16 h-16'];

  const circleStyles = ['rounded-full'];
  const squareStyles = ['rounded-m'];

  return (
    <div
      className={twMerge([
        generalStyles,
        size === 'small' && smallStyles,
        size === 'medium' && mediumStyles,
        size === 'large' && largeStyles,
        shape === 'circle' && circleStyles,
        shape === 'square' && squareStyles
      ])}>
      <div
        className={twMerge([
          'flex h-full w-full items-center justify-center bg-bg-subtle',
          shape === 'circle' && circleStyles,
          shape === 'square' && squareStyles
        ])}>
        {imageUrl ? (
          <img
            className={twMerge(
              [shape === 'circle' && circleStyles, shape === 'square' && squareStyles],
              'max-w-max sm:h-8 min-[320px]:w-8 min-[320px]:h-8 sm:w-8 lg:h-10 lg:w-10'
            )}
            src={imageUrl}
            {...rest}
          />
        ) : isString ? (
          <p
            className={twMerge([
              'text-text-subtle',
              size === 'small' && 'text-c-m-p',
              size === 'medium' && 'text-c-m-p',
              size === 'large' && 'text-c-l-p'
            ])}>
            <div className="h-10 w-10 rounded-full border-[0.5px] border-solid  border-border-base"></div>
            {/* <CircleUserRound className="h-10 w-10" stroke="gray" /> */}
          </p>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default MyAvatar;
