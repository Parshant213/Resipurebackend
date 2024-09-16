declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DB_HOST: string;
			DB_USER: string;
			DB_PASSWORD: string;
			ADMIN_DB: string;
			JWT_SECRET_KEY: string;
		}
	}
}

export {};
