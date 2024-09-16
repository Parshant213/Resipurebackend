import NodeCache from 'node-cache';

const memcache = (options: NodeCache.Options) => {
	return new NodeCache(options);
};

export default memcache;
