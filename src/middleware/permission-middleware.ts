import { NextFunction, Request, Response } from 'express';
import { findUser, getUserPermissions } from '../services/user';
import APIError from '../classes/APIError';
import HttpStatusCode from '../enums/HttpStatusCode';
import { CUSTOMER_TYPE } from '../models';
import { findDistributorForCustomer } from '../services/customer';

const OPERATION_NOT_ALLWOED = new APIError(`Operation not allowed!!`, HttpStatusCode.FORBIDDEN);

export const permissionCheck = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userPermissions = await getUserPermissions(req);
		const { customerId, userId } = req.headers as { [key: string]: string };
		const { customerId: paramsCustomerId, userId: paramsUserId } = req.params;
		res.locals.userPermissions = userPermissions;

		if (!userPermissions?.isAdmin && !userPermissions?.isAdmin) {
			throw OPERATION_NOT_ALLWOED;
		}
		if (userPermissions?.isAdmin) {
			return next();
		}
		const isDistributorForCustomer = await checkUserCustomerAccess(userId, customerId, paramsCustomerId);
		if (userPermissions?.isAdmin && (customerId !== paramsCustomerId || !isDistributorForCustomer)) {
			throw OPERATION_NOT_ALLWOED;
		}
		if (paramsUserId && !userPermissions?.isAdmin && userId !== paramsUserId) {
			throw OPERATION_NOT_ALLWOED;
		}
		next();
	} catch (error) {
		next(error);
	}
};

const checkUserCustomerAccess = async (userId: string, customerId: string, paramsCustomerId: string) => {
	try {
		const user = await findUser({ userId, customerId });
		if (!user) {
			return false;
		}
		const distributorCustomer = await findDistributorForCustomer(paramsCustomerId, customerId);
		return !!distributorCustomer;
	} catch (error) {
		console.error(error);
		return false;
	}
};
