const config = {
  production: {
    base_url: process.env.BASE_URL || '',
    site: {
      url: process.env.SITE_URL || 'http://example.com',
      title: 'Hephaestus',
    }
  },
  development: {
    base_url: process.env.DEV_BASE_URL || '',
    site: {
      url: process.env.DEV_SITE_URL || 'http://localhost:8000',
      title: 'Hephaestus',
    }
  }
};

module.exports = config;
