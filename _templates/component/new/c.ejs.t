---
to: src/components/<%= name %>.tsx
---
import React, { FC } from 'react';
import { <%= name %>Props } from './<%= name %>.interface';

export const <%= name %>: FC<<%= name %>Props> = ({ children }) => (
  <>{children}</>
)<%= null %>;
