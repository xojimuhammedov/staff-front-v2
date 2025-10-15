import React from 'react';
import { LucideProps, icons } from 'lucide-react';

interface Props extends LucideProps {
  name: keyof typeof icons;
  color?: string;
}

const IconByName: React.FC<Props> = ({ name, color, ...rest }) => {
  const SelectedIcon = icons[name];

  return <SelectedIcon color={color} {...rest} />;
};

export default IconByName;
