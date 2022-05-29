import { patchNativeTypes } from './patches';

export * from './enumerable.interface';
export * from './enumerable';
export * from './enumerator.interface';
export * from './enumerator';
export * from './types';

// Only do this once
let λλWAS_PATCHEDλλ = false;

if (!λλWAS_PATCHEDλλ) {
  patchNativeTypes();
  λλWAS_PATCHEDλλ = true;
}
