
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}
