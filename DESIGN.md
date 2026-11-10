# Bulls and Cows — Project Design

## 1. Data Structures and Algorithms

### 1.1. Game State

The game state is represented by the `GameState` interface in `src/state/gameState.ts`.

It contains:

- `settings` — current game configuration, including secret length and number system.
- `secret` — the generated secret number, represented as a string.
- `history` — an array of previous guesses and their results.
- `status` — current game status: `settings`, `playing`, or `won`.
- `startedAt` and `finishedAt` — timestamps used to calculate the game duration.

The state is updated immutably. Instead of modifying existing objects, the application creates new objects using the spread operator. Guess history is extended with `[...state.history, entry]`.

The `readonly` modifier is used in interfaces to prevent accidental modifications.

### 1.2. Guess History

Each history entry is represented by the `GuessEntry` interface.

It stores:

- The submitted guess.
- The number of bulls.
- The number of cows.
- The submission timestamp.

The history is stored as an array. Every new attempt creates a new array, preserving previous entries without mutation.

The secret number is stored as a string rather than a numeric value. This allows leading zeros to be preserved, for example, `0123`.

### 1.3. evaluateGuess Algorithm

The `evaluateGuess(secret, guess)` function is implemented in `src/logic/evaluateGuess.ts`.

It compares the secret number with the player's guess and returns an object containing `bulls` and `cows`.

The algorithm works as follows:

1. Both strings are converted to lowercase to make hexadecimal comparisons case-insensitive.
2. The secret digits are converted into a `Set` for efficient membership checks.
3. Bulls are calculated using `map` and `reduce`: each digit is compared with the digit at the same position.
4. Matching digits are collected into a `Set`.
5. Cows are calculated by subtracting the number of bulls from the number of matching unique digits.

The function uses array methods and sets instead of manually maintaining counters in loops.

### 1.4. countPossibleSecrets Algorithm

The `countPossibleSecrets(length, base)` function is implemented in `src/logic/countPossibleSecrets.ts`.

It calculates the number of possible secret combinations without repeated digits.

The mathematical formula is:

P(base, length) = base! / (base - length)!

The function uses recursion:

- The base case is when `length === 1`, returning `base`.
- Otherwise, it calculates `base * countPossibleSecrets(length - 1, base - 1)`.

Memoization is implemented using a `Map`. Previously calculated results are stored using a key composed of the requested length and base.

This prevents repeated calculations for the same parameters.

Leading zeros are allowed, so no additional restriction is applied to the first digit.

## 2. Time and Space Complexity (Big O)

### 2.1. generateSecret(length, base)

**Time complexity: O(base + length)**

The function first creates an array containing all available digits, which takes O(base) time. It then performs a partial Fisher–Yates shuffle for the requested number of positions, taking O(length) time.

**Space complexity: O(base)**

The digits array stores all available digits in the selected number system.

### 2.2. evaluateGuess(secret, guess)

**Time complexity: O(n)**

Both strings are processed a constant number of times. Array methods and Set operations require linear time relative to the number of digits, assuming average constant-time Set operations.

**Space complexity: O(n)**

Additional arrays and sets are created to store digits and matching values.

### 2.3. isValidGuess(guess, length, base)

**Time complexity: O(n)**

The function checks the guess length, validates every digit using `every`, and checks uniqueness using a `Set`.

**Space complexity: O(n)**

The normalized guess and the Set of unique digits require additional linear memory.

### 2.4. countPossibleSecrets(length, base)

**Time complexity: O(length)** for a calculation that is not already cached.

The recursive calculation creates at most `length` new states along the recursion path. Memoization allows previously calculated results to be reused. A request already present in the cache takes O(1) lookup time.

**Space complexity: O(length)** for a new calculation, including the recursion stack and newly stored cache entries.

The cache is shared between calls, so previously calculated combinations remain available for later requests.

## 3. Clean Code Principles

### 3.1. Separation of Responsibilities

The project is divided into separate modules:

- `src/logic/` — pure game logic and validation.
- `src/state/` — immutable game state management.
- `src/ui/` — DOM creation, rendering and user interactions.

This separation makes the game logic independent of the browser interface and allows it to be tested separately.

### 3.2. Pure Functions

Functions such as `evaluateGuess`, `isValidGuess`, `createDigitValidator` and `countPossibleSecrets` perform calculations without modifying external state.

This makes their behavior predictable and simplifies testing.

### 3.3. Immutability

The application avoids direct mutation of game state.

New state objects are created using the spread operator, while guess history is updated using a new array.

Readonly interfaces help protect data from accidental changes.

### 3.4. Single Responsibility

Each function has a clearly defined purpose:

- `generateSecret` generates a unique secret.
- `isValidGuess` validates a player's attempt.
- `evaluateGuess` calculates bulls and cows.
- `countPossibleSecrets` calculates the number of possible combinations.
- `createDigitValidator` creates a digit validation function for a selected number system.

This makes the code easier to understand, test and maintain.

### 3.5. Higher-Order Functions and Functional Techniques

Array methods such as `map`, `filter`, `reduce`, `every` and `some` are used to process collections.

The `createDigitValidator(base)` function returns a predicate that validates individual characters. The selected base is captured in a closure and reused during input validation.

Recursion is used in `countPossibleSecrets`, while memoization prevents unnecessary repeated calculations.

### 3.6. Readability and Type Safety

TypeScript interfaces and explicit types describe the structure of game data.

Descriptive function and variable names make the code easier to understand. Early validation and guard clauses help prevent invalid states and unnecessary processing.

The project uses ESLint and Prettier to maintain consistent code formatting and quality.
