import test from 'node:test';
import assert from 'node:assert/strict';
import { mulberry32, splitWords, defaultFocus, cutCount, cutAt, pickMime, filler } from '../src/core.js';

test('same seed gives the same sequence', () => {
  const a = mulberry32(42), b = mulberry32(42);
  assert.deepEqual([a(), a(), a()], [b(), b(), b()]);
  assert.notEqual(mulberry32(1)(), mulberry32(2)());
});

test('splitWords and defaultFocus', () => {
  assert.deepEqual(splitWords('  Markets  jittery. '), ['Markets', 'jittery.']);
  assert.deepEqual(splitWords('   '), []);
  assert.equal(defaultFocus(['is', 'everything', 'ok!!!!!!!!!!']), 1); // punctuation does not count
  assert.equal(defaultFocus(['aa', 'bb']), 0);
});

test('cutCount never drops below one', () => {
  assert.equal(cutCount(5, 12), 60);
  assert.equal(cutCount(0, 12), 1);
});

test('cutAt maps frames to cuts without drift', () => {
  assert.equal(cutAt(0, 30, 12), 0);
  assert.equal(cutAt(2, 30, 12), 0);
  assert.equal(cutAt(3, 30, 12), 1); // 12 cuts/s at 30 fps: a new cut every 2.5 frames
  assert.equal(cutAt(149, 30, 12), 59); // last frame of 5 s is the 60th cut
});

test('pickMime prefers the asked container and falls back', () => {
  const all = () => true, webmOnly = (m) => m.startsWith('video/webm'), none = () => false;
  assert.match(pickMime(all, 'mp4', true), /^video\/mp4.*mp4a/);
  assert.doesNotMatch(pickMime(all, 'mp4', false), /mp4a/);
  assert.match(pickMime(all, 'webm'), /^video\/webm/);
  assert.match(pickMime(webmOnly, 'mp4'), /^video\/webm/);
  assert.equal(pickMime(none), '');
});

test('filler returns n words, deterministic per seed', () => {
  assert.equal(filler(mulberry32(7), 20).split(' ').length, 20);
  assert.equal(filler(mulberry32(7), 20), filler(mulberry32(7), 20));
});
