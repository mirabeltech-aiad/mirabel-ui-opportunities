
// Filter mappings for products and business units

export const mapProductFilter = (productValue) => {
  const productMapping = {
    'digital-ads': 'Digital Advertising',
    'print-ads': 'Print Advertising',
    'sponsored-content': 'Sponsored Content',
    'events': 'Events & Conferences',
    'newsletters': 'Newsletter Sponsorship',
    'webinars': 'Webinar Solutions'
  };
  return productMapping[productValue] || productValue;
};

export const mapBusinessUnitFilter = (unitValue) => {
  const unitMapping = {
    'enterprise': 'Enterprise Solutions',
    'mid-market': 'Mid-Market',
    'small-business': 'Small Business',
    'government': 'Government & Public Sector',
    'healthcare': 'Healthcare',
    'education': 'Education'
  };
  return unitMapping[unitValue] || unitValue;
};
