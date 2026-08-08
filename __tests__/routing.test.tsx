import React from 'react';
import { render, screen } from '@testing-library/react-native';
import HomeTab from '../src/app/(tabs)/index';
import Profile from '../src/app/profile';

describe('Routing screens', () => {
  it('renders Home tab content', () => {
    const { getByText } = render(React.createElement(HomeTab));
    expect(getByText('Home (Tabs)')).toBeTruthy();
    expect(getByText(/Tabs Home/)).toBeTruthy();
  });

  it('renders Profile and displays id param as unknown by default', () => {
    const { getByText } = render(React.createElement(Profile));
    expect(getByText('Profile')).toBeTruthy();
    expect(getByText(/User ID:/)).toBeTruthy();
  });
});
