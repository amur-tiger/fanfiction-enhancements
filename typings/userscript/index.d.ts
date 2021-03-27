/* eslint-disable @typescript-eslint/naming-convention */

type GMValue = string | number | boolean;

// Important note: All used functions, despite being declared in this file, still need to be declared in the
// user-script header @grant section to be made available to the script by the user-script runner.
// The following functions are also only available using TamperMonkey. Check their existence before using them.

type ListenerId = number;

interface GMValueChangedCallback {
  (name: string, oldValue: GMValue, newValue: GMValue, remote: boolean): any;
}

/**
 * Adds a change listener to the storage for the given key.
 * Important: This function may not be supported by all user-script runners.
 * @param {string} name
 * @param {GMValueChangedCallback} callback
 */
declare function GM_addValueChangeListener(name: string, callback: GMValueChangedCallback): ListenerId;

/**
 * Removes a change listener from storage by its id.
 * Important: This function may not be supported by all user-script runners.
 * @param listenerId
 */
declare function GM_removeValueChangeListener(listenerId: ListenerId): void;
