import React from 'react';
import { createComponent } from '@lit-labs/react';
import { NNRoundRange as NNRoundRangeWC } from '../nn-round-range';

export const NNRoundRange = createComponent(
  React,
  'nn-round-range',
  NNRoundRangeWC,
  {
    onchange: 'change',
  }
);
