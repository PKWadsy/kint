/**
 * Tries to run a function and returns the result or an error if the function throws an error.
 * @param run The function to run.
 * @returns Either the result of the function or an error.
 */
export function safeRun<T>(run: () => T): TryRunResult<T> {
  try {
    return { success: true, result: run() };
  } catch (e) {
    return { success: false, error: e };
  }
}

export type TryRunSuccess<T> = {
  success: true;
  result: T;
};

export type TryRunFailure = {
  success: false;
  error: unknown;
};

export type TryRunResult<T> = TryRunSuccess<T> | TryRunFailure;
