import { patchNativeTypes } from './patches';

export * from './enumerable.interface';
export * from './enumerable';
export * from './enumerator.interface';
export * from './enumerator';
export * from './types';

export * from './patches';

// Only do this once
let λλIS_ENUMERABLE_PATCHEDλλ = false;

if (!λλIS_ENUMERABLE_PATCHEDλλ) {
  patchNativeTypes();
  λλIS_ENUMERABLE_PATCHEDλλ = true;
}
