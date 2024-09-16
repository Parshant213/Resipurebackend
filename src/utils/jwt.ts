import jwt, { JwtPayload } from 'jsonwebtoken';

export interface VerifyToken {
	status: boolean;
	data?: JwtPayload | string;
	error?: null | unknown;
}

export const verifyToken = (token: string): VerifyToken => {
	try {
		const decodedData: string | JwtPayload = jwt.verify(token, process.env.JWT_SECRET_KEY!);
		if (!decodedData) {
			return { status: false, error: null };
		}
		return { status: true, data: decodedData };
	} catch (err) {
		return { status: false, error: err };
	}
};
