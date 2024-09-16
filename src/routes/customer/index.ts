import { Router } from 'express';
import { createCustomer, deleteCustomer, getCustomers, getCustomerById, updateCustomer, getCustomersForDistributor, getTotalCustomersByDeviceTypeHandler, customerListInfo } from '../../handlers/customer';
import { permissionCheck, } from '../../middleware/permission-middleware';
import buildingAdminRouter from './building';
import { adminRouter as userAdminRouter } from './user';
import { getCustomerStats } from '../../handlers/customer';

const router: Router = Router();
const superAdminRouter: Router = Router();

router.get('/countbydevicetype',getTotalCustomersByDeviceTypeHandler)
router.get('/stats', getCustomerStats);

superAdminRouter
	.get('/all', permissionCheck, getCustomers)
	.get('/:distributorId/customers', permissionCheck, getCustomersForDistributor)
	.post('/',  createCustomer)
	.get('/:customerId', permissionCheck, getCustomerById)
	.patch('/:customerId', permissionCheck, updateCustomer)
	.delete('/:customerId', permissionCheck, deleteCustomer)
      .get("/lists/fetchCustomerList", permissionCheck, customerListInfo);

router.use('/:customerId/users', userAdminRouter);
router.use('/:customerId/buildings',  buildingAdminRouter);
router.use(superAdminRouter);



export default router;
