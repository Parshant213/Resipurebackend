import { NextFunction, Request, Response } from 'express';
import APIError from '../../classes/APIError';
import HttpStatusCode from '../../enums/HttpStatusCode';
import { createNewUser, deleteUserById, findManyUsers, findUser, loginUser, updateUserData } from '../../services/user';

export const getAllUsersForCustomer = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { customerId } = req.params;
		const users = await findManyUsers({ customerId }, { token: 0, password: 0, isSuperAdmin: 0 });
		res.json(users);
	} catch (error) {
		next(error);
	}
};
export const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			throw new APIError(`Email and password is required!`, HttpStatusCode.BAD_REQUEST);
		}
		const {
			token,
			userData: { id, name, customerId, companyAdmin }
		} = await loginUser(req, { email, password });

		return res.json({ user: { id, name, customerId }, token });
	} catch (error) {
		next(error);
	}
};
export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			throw new APIError(`Email and password is required!`, HttpStatusCode.BAD_REQUEST);
		}
		const { token, userData } = await loginUser(req, { email, password });
		res.setHeader('auth_token', token);
		res.setHeader('Access-Control-Expose-Headers', '*');
		return res.json(userData);
	} catch (error) {
		next(error);
	}
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { userId, customerId } = req.params;
		const queryFields = { userId, customerId };
		const user = await findUser(queryFields, { password: 0, isAdmin: 0, isSuperAdmin: 0, token: 0 });
		if (!user) {
			throw new APIError(`User Not found!`, HttpStatusCode.NOT_FOUND);
		}
		res.json(user);
	} catch (error) {
		next(error);
	}
};
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
	const { userId, customerId } = req.params;
	const queryFields = { userId, customerId };
	const userData = req.body;
	try {
		const updatedUser = await updateUserData(queryFields, userData);
		if(!updatedUser){
			throw new APIError('User not found', HttpStatusCode.NOT_FOUND);
		}
		res.status(200).json({ "message": 'User updated successfully', updatedUser });
	} catch (error) {
		next(error);
	}
};
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, email, password, ...otherData } = req.body;
		const { customerId } = req.params;
		if (!name || !email || !password || !customerId) {
			throw new APIError("name, email, password are required fields", HttpStatusCode.BAD_REQUEST);
		}
		const { createdUser } = await createNewUser({ name, email, password, customerId, ...otherData });
		res.status(201).json({"message":"User created successfully", createdUser});
	} catch (error) {
		next(error);
	}
};
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { userId, customerId } = req.params;
		const deletedUser = await deleteUserById(userId, customerId);
		if(!deletedUser){
			throw new APIError("User not found", HttpStatusCode.NOT_FOUND);
		}
		res.status(200).json({ "message": "User Deleted successfully", deletedUser });
	} catch (error) {
		next(error);
	}
};
export const resetUserPassword = (req: Request, res: Response, next: NextFunction) => {
	return res.json({ message: 'Not yet implemented' });
};
