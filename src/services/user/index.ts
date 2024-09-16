import { Request } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User, UserLoginLog } from '../../models';
import { JWT_TOKEN_EXPIRY, USER_PERMISSION_KEY } from '../../constants';
import { getValueFromCache, setValueInCache } from '../memcache';
import HttpStatusCode from '../../enums/HttpStatusCode';
import APIError from '../../classes/APIError';
import { IUser } from '../../interfaces/IUser';

interface UserQueryParams {
	userId: string;
	customerId?: string;
}

export const findUser = async ({ userId, customerId }: UserQueryParams, props = {}) => {
	try {
		const searchQuery = { _id: userId, customerId };
		if (!customerId) {
			delete searchQuery.customerId;
		}
		const user = await User.findOne(searchQuery, { ...props });
		if (!user) {
			return null;
		}
		return user;
	} catch (error) {
		return null;
	}
};

export const findManyUsers = async ({ customerId }: { customerId: string }, props = {}) => {
	try {
		const searchQuery = { customerId };
		const users = await User.find(searchQuery, { ...props });
		return users;
	} catch (error) {
		return null;
	}
};

export const saveUserPermissionInCache = (req: Request, user: IUser): void => {
	const cacheKey = USER_PERMISSION_KEY.replace('$userId', user.id);
	const { isAdmin = false, isSuperAdmin = false } = user || {};
	setValueInCache(req, cacheKey, { isAdmin, isSuperAdmin });
};

export const getUserPermissions = async (req: Request): Promise<{ isAdmin?: boolean}> => {
	const { userId, customerId } = req.headers;
	if (!userId) {
		return {};
	}
	const cachedPermissions = getValueFromCache(req, USER_PERMISSION_KEY.replace('$userId', userId as string));
	if (!cachedPermissions) {
		const searchQuery = { userId: userId as string, customerId: customerId as string };
		const user: IUser | null = await findUser(searchQuery);
		if (!user) {
			return {};
		}
		saveUserPermissionInCache(req, user);
		return { isAdmin: user.isAdmin};
	}
	return cachedPermissions;
};

export const loginUser = async (req: Request, { email, password }: { email: string; password: string }) => {
	const user = await User.findOne({ email }, { name: 1, email: 1, password: 1, customerId: 1, isAdmin: 1 });
	if (!user) {
		throw new APIError(`Invalid Credentials!!`, HttpStatusCode.FORBIDDEN);
	}
	const passwordCheck = await bcrypt.compare(password, user.password);
	if (!passwordCheck) {
		throw new APIError(`Invalid Credentials!!`, HttpStatusCode.FORBIDDEN);
	}
	const userLoginLog = new UserLoginLog({
		userId: user.id,
		ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
		deviceDetails: req.headers['user-agent']
	});
	await userLoginLog.save();
	const tokenPayload = {
		user: {
			id: user.id,
			email: user.email,
			customerId: user.customerId
		}
	};
	const token = jwt.sign(tokenPayload,'sev', { expiresIn: JWT_TOKEN_EXPIRY });
	saveUserPermissionInCache(req, user);
	await User.findByIdAndUpdate(user.id, { token });
	return { token, userData: { id: user.id, email: user.email, customerId: user.customerId, name: user.name, companyAdmin: user.isAdmin, globalAdmin: user.isAdmin } };
};

export const createNewUser = async (userData: IUser) => {
	const newUser = new User({
		customerId: userData.customerId,
		name: userData.name,
		email: userData.email,
		password: userData.password,
		isAdmin: userData.isAdmin,
		phone: userData.phone,
		notification: userData.notification
	});
	const createdUser = await newUser.save();
	return { createdUser };
};

export const updateUserData = async ({ userId, customerId }: UserQueryParams, userData: IUser, props = {}) => {
	const userParams = {
		name: userData.name,
		password: userData.password,
		isAdmin: userData.isAdmin,
		phone: userData.phone,
		notification: userData.notification
	};

	const updatedUser = await User.findOneAndUpdate({ _id: userId, customerId }, userParams);
	return { updatedUser };
};

export const deleteUserById = async (userId: string, customerId: string) => {
	const searchQuery = { userId, customerId };
	const userToDelete = await findUser(searchQuery);
	if (!userToDelete) {
		throw new APIError(`User Not found!`, HttpStatusCode.NOT_FOUND);
	}
	return User.deleteOne({ _id: userId, customerId });
};
