'use strict';

const assert = require('node:assert/strict');
const { GESTURES, canonicalGesture, suggestGesture, outcome } = require('./lib/rules');

assert.equal(GESTURES.length, 101);
assert.equal(new Set(GESTURES).size, 101);
assert.equal(canonicalGesture(' dragon '), 'Dragon');
assert.equal(canonicalGesture('VIDEO-GAME'), 'Video Game');
assert.equal(canonicalGesture('hasufhiaofhaiosf'), null);
assert.equal(suggestGesture('dragdkon')?.gesture, 'Dragon');

// Gesture 1 beats the next 50, then loses to the following 50.
assert.equal(outcome('Dynamite', 'Tornado').winner, 1);
assert.equal(outcome('Dynamite', 'Cockroach').winner, 1);
assert.equal(outcome('Dynamite', 'Brain').winner, 2);
assert.equal(outcome('Dynamite', 'Helicopter').winner, 2);
assert.equal(outcome('Dragon', 'Diamond').winner, 1);
assert.equal(outcome('Dragon', 'Dynamite').winner, 1); // wrap-around check
assert.equal(outcome('Rock', 'Rock').winner, 0);

// Every gesture must beat exactly 50 and lose to exactly 50.
for (const a of GESTURES) {
  let wins = 0;
  let losses = 0;
  for (const b of GESTURES) {
    if (a === b) continue;
    const result = outcome(a, b);
    if (result.winner === 1) wins += 1;
    else losses += 1;
  }
  assert.equal(wins, 50, `${a} should have 50 wins`);
  assert.equal(losses, 50, `${a} should have 50 losses`);
}

console.log('All RPS-101 rule tests passed.');

// Full 5,050 Czech flavor-pack integrity test.
const FLAVOR5050 = require('./lib/flavor5050.json');
const LABELS_CS = require('./lib/labels-cs.json');

assert.strictEqual(Object.keys(FLAVOR5050).length, 5050, 'Flavor pack must contain exactly 5,050 winning matchups');
assert.strictEqual(Object.keys(LABELS_CS).length, 101, 'There must be exactly 101 Czech labels');

const flavorTexts = new Set();
let expectedPairs = 0;
for (let i = 0; i < GESTURES.length; i += 1) {
  for (let j = i + 1; j < GESTURES.length; j += 1) {
    expectedPairs += 1;
    const a = GESTURES[i];
    const b = GESTURES[j];
    const result = outcome(a, b);
    const winner = result.winner === 1 ? a : b;
    const loser = result.winner === 1 ? b : a;
    const key = `${winner}|${loser}`;
    const entry = FLAVOR5050[key];
    assert(entry, `Missing flavor entry for ${key}`);
    assert.strictEqual(entry.winner, winner, `Wrong winner in flavor entry ${key}`);
    assert.strictEqual(entry.loser, loser, `Wrong loser in flavor entry ${key}`);
    assert(Array.isArray(entry.sentences) && entry.sentences.length === 3, `${key} must contain exactly three sentences`);
    assert(entry.sentences.every((sentence) => typeof sentence === 'string' && sentence.trim().length > 10), `${key} has an empty/short sentence`);
    assert(!flavorTexts.has(entry.text), `Duplicate flavor text found at ${key}`);
    flavorTexts.add(entry.text);
  }
}
assert.strictEqual(expectedPairs, 5050);
assert.strictEqual(flavorTexts.size, 5050, 'All 5,050 flavor texts must be unique');
console.log('All 5,050 Czech flavor entries passed integrity tests.');
