import { Request, Response, NextFunction } from 'express';
import { ALLOWED_URLS } from '../constants';
import { VerifyToken, verifyToken } from '../utils/jwt';
import { JwtAuthPayload } from '../interfaces/jwt-auth';

export const jwtTokenValidator = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
	if (ALLOWED_URLS.includes(req.originalUrl)) {
		next();
	} else {
		const { authorization } = req.headers;
		if (!authorization) {
			return res.status(401).json({ message: 'No Token found' });
		}
		const token = authorization.split(' ')[1];
		const { status, data }: VerifyToken = verifyToken(token);
		if (!status || !data) {
			return res.status(401).json({ message: 'Session Expired' });
		}
		const {
			user: { id, email, customerId }
		} = data as JwtAuthPayload;
		req.headers.userId = id;
		req.headers.email = email;
		req.headers.customerId = customerId;
		next();
	}
};
