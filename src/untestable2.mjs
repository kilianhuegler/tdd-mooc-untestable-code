// The code is untestable, because it depends on a global random number generator (Math.random).
// So in the test this cannot be controlled and the outcome is random.
// Therefore the branches of diceHandValue cannot be tested deterministically and cannot assert the wanted correct behavior.
// The solution in this case is to inject the random number generator as a dependency.

function diceRoll() {
  const min = 1;
  const max = 6;
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

export function diceHandValue() {
  const die1 = diceRoll();
  const die2 = diceRoll();
  if (die1 === die2) {
    // one pair
    return 100 + die1;
  } else {
    // high die
    return Math.max(die1, die2);
  }
}
