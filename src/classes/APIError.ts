import HttpStatusCode from '../enums/HttpStatusCode';
import CustomError from './CustomError';

class APIError extends CustomError {
	constructor(message: string, statusCode: HttpStatusCode) {
		super(message, statusCode);
	}
}

export default APIError;
