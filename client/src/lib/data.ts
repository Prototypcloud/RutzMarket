// Static data and utility functions for the RÜTZ application
export const navigationItems = [
  { name: 'Health Concerns', href: '/health-concerns' },
  { name: 'Products', href: '/chaga-portfolio' },
  { name: 'Plant Explorer', href: '/plant-explorer' },
  { name: 'Plant Orbit', href: '/plant-orbit' },
  { name: 'AI Recommendations', href: '/plant-recommendations' },
  { name: 'Ask Healer', href: '/journey' },
  { name: 'Impact Rewards', href: '/impact-rewards' },
  { name: 'Science', href: '/science' },
  { name: 'About', href: '/about' }
];

export const productCategories = [
  { key: 'all', label: 'All Products' },
  { key: 'extracts', label: 'Extracts' },
  { key: 'supplements', label: 'Supplements' },
  { key: 'raw', label: 'Raw Materials' }
];

export const trustIndicators = [
  {
    icon: 'microscope',
    label: 'Fraunhofer Research'
  },
  {
    icon: 'certificate',
    label: 'Organic Certified'
  },
  {
    icon: 'qrcode',
    label: 'Track Origin'
  },
  {
    icon: 'heart',
    label: 'Fair Trade'
  }
];

export const socialLinks = [
  { platform: 'instagram', url: '#', icon: 'instagram' },
  { platform: 'facebook', url: '#', icon: 'facebook' },
  { platform: 'linkedin', url: '#', icon: 'linkedin' },
  { platform: 'youtube', url: '#', icon: 'youtube' }
];

export const footerLinks = {
  products: [
    { name: 'Extracts', href: '/products?category=extracts' },
    { name: 'Supplements', href: '/products?category=supplements' },
    { name: 'Raw Materials', href: '/products?category=raw' },
    { name: 'New Arrivals', href: '/products?sort=newest' }
  ],
  company: [
    { name: 'Our Story', href: '#story' },
    { name: 'Scientific Research', href: '#research' },
    { name: 'Community Impact', href: '#impact' },
    { name: 'Sustainability', href: '#sustainability' }
  ],
  support: [
    { name: 'Contact Us', href: '#contact' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Shipping Info', href: '#shipping' },
    { name: 'Track Order', href: '#track' }
  ]
};

export const legalLinks = [
  { name: 'Privacy Policy', href: '#privacy' },
  { name: 'Terms of Service', href: '#terms' },
  { name: 'Cookie Policy', href: '#cookies' }
];
