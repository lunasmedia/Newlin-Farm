const React = require('react');
const { Text, View } = require('react-native');

module.exports = {
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    pathname: '/',
  }),
  useLocalSearchParams: () => ({}),
  Link: ({ children, href, style }) => React.createElement(Text, { accessibilityRole: 'link', href, style }, children),
  Stack: {
    Screen: () => null,
    Group: ({ children }) => React.createElement(View, null, children),
  },
  Tabs: ({ children }) => React.createElement(View, null, children),
};
