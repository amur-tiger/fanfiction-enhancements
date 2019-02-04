type GMValue = string | number | boolean;

// Important note: All used functions, despite being declared in this file, still need to be declared in the
// user-script header @grant section to be made available to the script by the user-script runner.

/**
 * Deletes an existing key/value pair from storage.
 * @param {string} name
 * @deprecated
 */
declare function GM_deleteValue(name: string): void;

/**
 * Retrieves a value from storage that was set with GM_setValue.
 * @param {string} name
 * @param {GMValue} def
 * @deprecated
 */
declare function GM_getValue(name: string, def?: GMValue): GMValue;

/**
 * Retrieves a list of keys for values in storage.
 * @deprecated
 */
declare function GM_listValues(): string[];

/**
 * Saves a value to storage.
 * @param {string} name
 * @param {GMValue} value
 * @deprecated
 */
declare function GM_setValue(name: string, value: GMValue): void;

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
declare function GM_removeValueChangeListener(listenerId: ListenerId);

interface UserScriptFunctions {
	/**
	 * Deletes an existing key/value pair from storage.
	 * @param {string} name
	 */
	deleteValue(name: string): Promise<void>;

	/**
	 * Retrieves a value from storage that was set with setValue.
	 * @param {string} name
	 * @param {GMValue?} def
	 */
	getValue(name: string, def?: GMValue): Promise<GMValue>;

	/**
	 * Retrieves a list of keys for values in storage.
	 */
	listValues(): Promise<string[]>;

	/**
	 * Saves a value to storage.
	 * @param {string} name
	 * @param {GMValue} value
	 */
	setValue(name: string, value: GMValue): Promise<void>;
}

declare const GM: UserScriptFunctions;
