import { Request } from 'express';

export const setValueInCache = (req: Request, key: string, value: unknown) => {
	if (req.app.locals.memcache) {
		req.app.locals.memcache.set(key, value);
		return true;
	}
	return false;
};
export const getValueFromCache = (req: Request, key: string) => {
	if (req.app.locals.memcache) {
		return req.app.locals.memcache.get(key);
	}
	return null;
};

export const deleteValueInCache = (req: Request, key: string) => {
	if (req.app.locals.memcache) {
		req.app.locals.memcache.del(key);
	}
};

export const flushCache = (req: Request) => {
	if (req.app.locals.memcache) {
		req.app.locals.memcache.flushAll();
	}
};
