
import { Service, NavItem, TeamMember } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
];

export const SERVICES: Service[] = [
  {
    id: 'ai',
    title: 'Generative AI Strategy',
    description: 'We help enterprises integrate LLMs and custom AI solutions to automate complex workflows and boost productivity.',
    icon: 'fa-brain',
    color: 'bg-blue-500'
  },
  {
    id: 'cloud',
    title: 'Cloud Architecture',
    description: 'Scalable, secure, and cost-effective cloud infrastructure design utilizing AWS, GCP, and Azure best practices.',
    icon: 'fa-cloud',
    color: 'bg-indigo-500'
  },
  {
    id: 'custom-dev',
    title: 'Custom Software',
    description: 'End-to-end development of robust web and mobile applications tailored to your specific business needs.',
    icon: 'fa-code',
    color: 'bg-purple-500'
  },
  {
    id: 'data-analytics',
    title: 'Data Intelligence',
    description: 'Turn your raw data into actionable insights with our advanced visualization and predictive modeling services.',
    icon: 'fa-chart-pie',
    color: 'bg-pink-500'
  }
];

export const TEAM: TeamMember[] = [
  {
    name: 'Sarah Jenkins',
    role: 'Chief Executive Officer',
    image: 'https://picsum.photos/seed/sarah/400/400',
    bio: 'Former VP of Tech at Google with 20+ years of experience in scaling startups.'
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Chief AI Architect',
    image: 'https://picsum.photos/seed/michael/400/400',
    bio: 'PhD in Computer Science with a focus on neural networks and deep learning.'
  },
  {
    name: 'Elena Rodriguez',
    role: 'Head of Design',
    image: 'https://picsum.photos/seed/elena/400/400',
    bio: 'Award-winning UX designer dedicated to making complex tech intuitive.'
  }
];
