import assert from 'node:assert';
import { videokitten, VideokittenError } from 'videokitten';

// Check main factory function
assert(typeof videokitten === 'function', 'videokitten should be a function');

// Check error classes with instanceof assertions
const baseError = new VideokittenError('test error');
assert(baseError instanceof Error, 'VideokittenError should extend Error');
