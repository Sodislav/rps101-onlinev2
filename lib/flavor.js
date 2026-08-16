'use strict';

const FLAVOR = require('./flavor5050.json');
const LABELS = require('./labels-cs.json');
const { emojiFor } = require('./flavor-legacy');

function labelFor(gesture) {
  return LABELS[gesture] ?? gesture;
}

function battleFlavor(winner, loser) {
  const entry = FLAVOR[`${winner}|${loser}`];
  const winnerLabel = labelFor(winner);
  const loserLabel = labelFor(loser);

  if (!entry) {
    return {
      title: `${emojiFor(winner)} ${winnerLabel} vítězí`,
      headline: `${winnerLabel} poráží ${loserLabel}`,
      description: `Souboj „${winnerLabel}“ vs. „${loserLabel}“ vyhrává „${winnerLabel}“.`,
      winnerEmoji: emojiFor(winner),
      loserEmoji: emojiFor(loser)
    };
  }

  return {
    title: `${emojiFor(winner)} ${winnerLabel} vítězí`,
    headline: `${winnerLabel} > ${loserLabel}`,
    description: entry.text,
    sentences: entry.sentences,
    winnerEmoji: emojiFor(winner),
    loserEmoji: emojiFor(loser)
  };
}

function tieDescription(a, b) {
  const label = labelFor(a);
  return {
    title: `${emojiFor(a)} Remíza`,
    headline: `${label} = ${label}`,
    description: `Oba hráči zvolili „${label}“. Aréna se na okamžik změnila v dokonale symetrický problém bez vítěze. Rozhodčí rozdělí nulu bodů spravedlivě mezi oba a tváří se, že přesně tak to plánoval.`,
    winnerEmoji: emojiFor(a),
    loserEmoji: emojiFor(b)
  };
}

module.exports = {
  labelFor,
  emojiFor,
  battleFlavor,
  tieDescription
};
