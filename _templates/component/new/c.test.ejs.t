---
to: src/components/<%= name %>.test.tsx
---
import React from 'react';
import { render } from '@testing-library/react';
import { <%= name %> } from './<%= name %>';

describe('components / <%= name %>', () => {
  it('should render', () => {
    const { container } = render(<<%= name %> />);
    expect(container).toMatchSnapshot();
  });
});
