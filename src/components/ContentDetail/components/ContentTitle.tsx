import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface ContentTitleProps {
  icon?: LucideIcon;
  title: string;
  level?: 'h2' | 'h3';
  children?: ReactNode;
  className?: string;
}

export default function ContentTitle({ 
  icon: Icon, 
  title, 
  level = 'h3', 
  children,
  className = '' 
}: ContentTitleProps) {
  const baseClasses = 'flex items-center gap-2 font-bold text-gray-900';
  const levelClasses = {
    h2: 'text-2xl',
    h3: 'text-xl'
  };
  
  const combinedClasses = `${baseClasses} ${levelClasses[level]} ${className}`;

  const content = (
    <>
      {Icon && <Icon className={level === 'h2' ? 'size-6' : 'size-5'} />}
      {title}
      {children}
    </>
  );

  if (level === 'h2') {
    return <h2 className={combinedClasses}>{content}</h2>;
  }

  return <h3 className={combinedClasses}>{content}</h3>;
}