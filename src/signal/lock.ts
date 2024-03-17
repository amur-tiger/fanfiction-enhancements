export interface Lock {
  /**
   * Executes a callback only if it is not nested inside itself, to prevent recursion.
   * @param callback
   */
  (callback: () => void): void;
}

export default function createLock(): Lock {
  let isRunning = false;
  return (callback) => {
    if (!isRunning) {
      try {
        isRunning = true;
        callback();
      } finally {
        isRunning = false;
      }
    }
  };
}
