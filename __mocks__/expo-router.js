const React = require('react');

module.exports = {
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    pathname: '/',
  }),
  useLocalSearchParams: () => ({}),
  Link: ({ children, href, style }) => React.createElement('a', { href, style }, children),
  Stack: {
    Screen: () => null,
    Group: ({ children }) => React.createElement('div', null, children),
  },
  Tabs: ({ children }) => React.createElement('div', null, children),
};
