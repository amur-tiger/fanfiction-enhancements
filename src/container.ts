import { Api, ApiImmediate } from "./api/api";
import { Cache } from "./api/cache";

export class Container {
	private api: Api;
	private apiImmediate: ApiImmediate;
	private cache: Cache;

	public getApi(): Api {
		return this.api || (this.api = new Api(this.getCache(), this.getApiImmediate()));
	}

	public getApiImmediate(): ApiImmediate {
		return this.apiImmediate || (this.apiImmediate = new ApiImmediate());
	}

	public getCache(): Cache {
		return this.cache || (this.cache = new Cache(this.getStorage()));
	}

	public getContainer(): Container {
		return this;
	}

	public getStorage(): Storage {
		return localStorage;
	}
}
