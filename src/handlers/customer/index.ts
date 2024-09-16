import { Request, Response, NextFunction } from 'express';
import * as CustomerService from '../../services/customer';
import { getCustomerCounts } from '../../services/customer';

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const customers = await CustomerService.findCustomers();
		res.json(customers);
	} catch (error) {
		next(error);
	}
};

export const getCustomersForDistributor = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { distributorId } = req.params;
		const customers = await CustomerService.findCustomerForDistributor(distributorId);
		res.json(customers);
	} catch (error) {
		next(error);
	}
};

export const getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { customerId } = req.params;
		const customer = await CustomerService.findCustomerById(customerId);

		if (!customer) {
			return res.status(404).json({ error: 'Customer not found' });
		}

		res.json(customer);
	} catch (error) {
		next(error);
	}
};

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, type, distributorId, locationId, logo } = req.body;

		if (!name || !type) {
			return res.status(400).json({ error: 'Name and Type are required fields' });
		}

		const customer = await CustomerService.createCustomer({ name, type, distributorId, locationId, logo });
		res.status(201).json(customer);
	} catch (error) {
		next(error);
	}
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { customerId } = req.params;
		const { name, type, distributorId, locationId, logo } = req.body;

		if (!name && !type && !distributorId && !locationId && !logo) {
			return res.status(400).json({ error: 'At least one field is required for update' });
		}

		const customer = await CustomerService.findCustomerById(customerId);
		if (!customer) {
			return res.status(404).json({ error: 'Customer not found' });
		}

		const updatedCustomer = await CustomerService.updateCustomerById(customerId, { name, type, distributorId, locationId, logo });
		res.json(updatedCustomer);
	} catch (error) {
		next(error);
	}
};


export const deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { customerId } = req.params;

        if (!customerId) {
            return res.status(400).json({ error: 'Customer ID is required for deletion' });
        }

        const customerExists = await CustomerService.findCustomerById(customerId);

        if (!customerExists) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        await CustomerService.deleteCustomerById(customerId);
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        next(error);
    }
};


export const getCustomerStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customerStats = await getCustomerCounts();
    res.status(200).json(customerStats);
  } catch (error) {
    console.error('Error fetching aggregate data:', error);
    res.status(500).json({ error: 'An error occurred while fetching aggregate data' });
  }
};

export const getTotalCustomersByDeviceTypeHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { deviceTypeId } = req.query;
        const totalCustomers = await CustomerService.getTotalCustomersByDeviceType(deviceTypeId as string);
        res.status(200).json({ totalCustomers });
    } catch (error) {
        console.error('Error fetching total customers by device type:', error);
        res.status(500).json({ error: 'An error occurred while fetching the total customers by device type' });
    }
};

export const customerListInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await CustomerService.fetchCustomerListInfo();
    res.json(data).status(200);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch customer data" });
  }
};

export const resipureCustomerInfo = async(req:Request,res:Response,next:NextFunction)=>{
	try {
		const {customerId} = req.params;
		const summary = await CustomerService.resipureCustomerSummary(customerId);
		res.status(200).json(summary);
	} catch (error) {
		next(error);
	}
}