// All entries from A and B
// [a,b], [b,c] => [a,b,c]
export const union = (a, b) => new Set([...a, ...b]);

// Entries which are both in A and in B
// [a,b], [b,c] => [b]
export const intersection = (a, b) => new Set([...a].filter(x => b.has(x)));

// Set A minus B
// [a,b], [b,c] => [a]
export const difference = (a, b) => new Set([...a].filter(x => !b.has(x)));

// Reverse of the difference, useful when currying
// [a,b], [b,c] => [c]
export const relativeComplement = (a, b) => difference(b, a);

// A.k.a. Disjunctive union
// Reverse of intersection
// [a,b], [b,c] => [a,c]
export const symmetricDifference = (a, b) => union(difference(a, b), difference(b, a));

export default { union, intersection, difference, relativeComplement, symmetricDifference }

