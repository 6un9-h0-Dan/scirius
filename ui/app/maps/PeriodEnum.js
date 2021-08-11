// the actual numbers are in milliseconds!
export const PeriodEnum = {
  H1: {
    name: 'last 1h',
    title: 'last 1 hour',
    seconds: 3600000,
  },
  H6: {
    name: 'last 6h',
    title: 'last 6 hours',
    seconds: 21600000,
  },
  H24: {
    name: 'last 24h',
    title: 'last 24 hours',
    seconds: 86400000,
  },
  D2: {
    name: 'last 2d',
    title: 'last 2 days',
    seconds: 172800000,
  },
  D7: {
    name: 'last 7d',
    title: 'last 7 days',
    seconds: 604800000,
  },
  D30: {
    name: 'last 30d',
    title: 'last 30 days',
    seconds: 2592000000,
  },
  Y1: {
    name: 'last 1y',
    title: 'last 1 year',
    seconds: 31536000000,
  },
  All: {
    name: 'all',
    title: 'all',
    seconds: 'All',
  },
};
