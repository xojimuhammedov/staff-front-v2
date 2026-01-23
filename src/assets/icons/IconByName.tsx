import React from 'react';
import { LucideProps, icons, HelpCircle } from 'lucide-react';

interface Props extends LucideProps {
  name: string;
  color?: string;
}

const IconByName: React.FC<Props> = ({ name, color, ...rest }) => {
  const SelectedIcon = icons[name as keyof typeof icons];

  if (!SelectedIcon) {
    return <HelpCircle color={color} {...rest} />;
  }

  return <SelectedIcon color={color} {...rest} />;
};

export default IconByName;
