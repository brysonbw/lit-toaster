// @ts-nocheck
import { describe, expect, it } from 'vitest';
import { GUID } from '../utils.ts';

describe('GUID()', () => {
  it('returns unique (string) ID when invoked', () => {
    let id = GUID();
    expect(id).toBeDefined();
    expect(id).toBeTypeOf('string');
    expect(id).toEqual('1');
    id = GUID();
    expect(id).toBeDefined();
    expect(id).toBeTypeOf('string');
    expect(id).toEqual('2');
  });
});
