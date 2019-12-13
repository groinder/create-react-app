---
to: src/components/<%= name %>.stories.tsx
---
import React from 'react';
import { text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { <%= name %> } from './<%= name %>';

export default { title: 'components / <%= name %>' };

export const Default = () => (
  <<%= name %>
  // onClick={action('Click')}
  >
    {text('Text', 'Example')}
  </<%= name %>>
);
