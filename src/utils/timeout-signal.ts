/**
 * Creates an AbortSignal that combines user signal with timeout
 * @param userSignal - Optional user-provided AbortSignal
 * @param timeoutMs - Optional timeout in milliseconds
 * @returns Combined AbortSignal and cleanup function
 */
export function createTimeoutSignal(userSignal?: AbortSignal, timeoutMs?: number): {
  signal: AbortSignal;
  cleanup: () => void;
} {
  // If no timeout and no user signal, return a never-aborting signal
  if (!timeoutMs && !userSignal) {
    return {
      signal: new AbortController().signal,
      cleanup: () => {}
    };
  }

  // If only user signal, return it as-is
  if (!timeoutMs && userSignal) {
    return {
      signal: userSignal,
      cleanup: () => {}
    };
  }

  // If only timeout, create timeout signal
  if (timeoutMs && !userSignal) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort(new Error(`Recording timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    return {
      signal: controller.signal,
      cleanup: () => clearTimeout(timeoutId)
    };
  }

  // Both timeout and user signal - combine them
  const controller = new AbortController();
  let timeoutId: NodeJS.Timeout | undefined;

  // Abort if user signal is already aborted
  if (userSignal!.aborted) {
    controller.abort(userSignal!.reason);
  } else {
    // Listen for user signal abortion
    const onUserAbort = () => {
      controller.abort(userSignal!.reason);
    };
    userSignal!.addEventListener('abort', onUserAbort);

    // Set up timeout
    timeoutId = setTimeout(() => {
      controller.abort(new Error(`Recording timed out after ${timeoutMs}ms`));
    }, timeoutMs!);

    // Clean up user signal listener when our signal is aborted
    controller.signal.addEventListener('abort', () => {
      userSignal!.removeEventListener('abort', onUserAbort);
    });
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  };
}
