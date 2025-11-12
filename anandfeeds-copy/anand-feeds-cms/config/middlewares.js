module.exports = [
  'strapi::errors',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: ['*'], // Allow all origins (or specify your domain/IP)
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true
    },
  },
  'strapi::security',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
