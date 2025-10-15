import { ReactNode, FC } from 'react';

interface SocialCellProps {
  title: ReactNode;
}

/**
 * `SocialCell` displays a social media icon or avatar next to a title, typically used within a table or list to represent social media links or user names. It provides a standardized layout for social media information, with a placeholder for an icon and accompanying text.
 *
 * @component
 * @param {SocialCellProps} props - The properties of the SocialCell component.
 * @param {ReactNode} props.title - The title or text to display next to the social media icon or avatar.
 * @returns {React.ReactElement} - A flex container with a placeholder for an icon and the title text.
 *
 * Example Usage:
 * ```
 * <SocialCell title="Username" />
 * ```
 * This will render a social cell with the given username as the title. The icon space is reserved for future customization or dynamic content.
 */

const SocialCell: FC<SocialCellProps> = ({ title }) => {
  return (
    <div className="flex flex-row items-center gap-4">
      <div className="h-8 w-8 rounded-m bg-bg-base shadow-base" />
      <p className="text-c-m text-text-base">{title}</p>
    </div>
  );
};

export default SocialCell;
