import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import mongoose, { ConnectOptions } from 'mongoose';
import logger from 'morgan';
import swaggerJSDoc, { SwaggerDefinition } from 'swagger-jsdoc';
import swaggerUi, { SwaggerOptions } from 'swagger-ui-express';

import { API_TIMEOUT, DB_OPTIONS, DEFAULT_PORT } from './src/constants';
import { jwtTokenValidator } from './src/middleware/auth-middleware';
import memcache from './src/middleware/cache-middleware';
import routes from './src/routes';
import iotRoutes from './src/routes/iot';
import CustomError from './src/classes/CustomError';

const apiLimiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	max: 10
});

const serversForSwagger = [
	{
		url: 'http://app.clairco.io/api/v1',
		description: 'Production server'
	}
];

if (process.env.NODE_ENV !== 'production') {
	serversForSwagger.push({
		url: 'http://localhost:4442/api/v1',
		description: 'Development server'
	});
	dotenv.config();
}

async function connectMongo() {
	const connectOptions: ConnectOptions = { maxPoolSize: DB_OPTIONS.MAX_POOL_SIZE, maxIdleTimeMS: DB_OPTIONS.MAX_IDLE_TIME_MS };
	// const { DB_HOST, DB_USER, DB_PASSWORD, ADMIN_DB } = process.env;
	// if (!DB_HOST || !DB_USER || !DB_PASSWORD) {
	// 	console.log('No DB Credentials provided!!');
	// 	process.exit(1);
	// }
	// const encodedUser = encodeURIComponent(DB_USER!);
	// const encodedPassword = encodeURIComponent(DB_PASSWORD!);
	
	// await mongoose.connect(`mongodb+srv://${encodedUser}:${encodedPassword}@${DB_HOST}/${ADMIN_DB}`, connectOptions);
	// await mongoose.connect(`mongodb://${DB_HOST}/${ADMIN_DB}`, connectOptions);
	//await  mongoose.connect(`mongodb+srv://claircodb:Clairco2024@clairco.zdz7uwg.mongodb.net/clairco`)
	await mongoose.connect('mongodb+srv://parshantrajput12345:TjaQT4F6nUw4Fnvz@testcluster.zso9133.mongodb.net/?retryWrites=true&w=majority&appName=TestCluster');
}
connectMongo()
	.then(() => {
		console.log('Connected to Mongo');
	})
	.catch((err) => console.log(err));

const handleConnections = () => {
	console.log('Closing server');
	mongoose.connection.close();
	process.exit();
};

const swaggerDefinition: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'Sensiable API Doc',
		version: '1.0.0',
		description: 'Sensiable API Documentation',
		contact: {
			name: 'Sensiable',
			url: 'https://sensiable.io'
		}
	},
	servers: serversForSwagger,
	authAction: { JWT: { name: 'JWT', schema: { type: 'apiKey', in: 'header', name: 'Authorization', description: '' }, value: 'Bearer <JWT>' } }
};

const options: SwaggerOptions = {
	swaggerDefinition,
	apis: ['@/apiDocs/**/*.yaml']
};

const swaggerSpec = swaggerJSDoc(options);

const port: number = +(process.env.PORT || DEFAULT_PORT);
// Initialize the express engine
const app: express.Application = express();

app.use(compression());
// parse form data
app.use(express.urlencoded({ extended: false }));

// Log requests to the console.
app.use(logger('[:method] :url :status :res[content-length] - :response-time ms'));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(cors());
app.locals.memcache = memcache({ stdTTL: 10 * 60, checkperiod: 11 * 60 });

app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/ping', (req: express.Request, res: express.Response) => {
	res.json({ message: 'Status healthy' });
});
app.get('/clear-cache', (req: express.Request, res: express.Response) => {
	req.app.locals.memcache?.flushAll();
	res.json({ message: 'Done' });
});

app.use('/api/v1', routes);
// Use swagger docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/iot', iotRoutes);

app.use((req: express.Request, res: express.Response) => {
	res.status(404).json({ err: `${req.path} not found!` });
});

app.use((error: CustomError, req: express.Request, res: express.Response, _: NextFunction): void => {
	const errorObjForLog = { error: { url: req.url, status: error.statusCode, message: error.message, stackTrace: error.stack, time: new Date().toISOString() } };
	console.log(JSON.stringify(errorObjForLog, null, '\t'));
	const status = error.statusCode || 400;
	const errorResponse: { message: string; stackTrace?: string } = { message: error.message };
	if (process.env.NODE_ENV !== 'production') {
		errorResponse.stackTrace = error.stack;
	}
	res.status(status).json(errorResponse);
});

// Server setup
const server = app.listen(port,'0.0.0.0',() => {
	console.log(`Server running on http://localhost:${port}/`);
});
server.setTimeout(API_TIMEOUT);
server.on('close', handleConnections);

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) => process.on(signal, handleConnections));
