import { Router } from 'express';
import { adminLogin, createUser, deleteUser, getAllUsersForCustomer, getUserById, login, resetUserPassword, updateUser } from '../../../handlers/user';

const router: Router = Router();
const adminRouter: Router = Router({ mergeParams: true });
adminRouter.post('/', createUser).get('/all', getAllUsersForCustomer).get('/:userId', getUserById).patch('/:userId', updateUser).delete('/:userId', deleteUser);

router.post('/login', login).post('/admin-login', adminLogin).post('/reset-password', resetUserPassword);

export { router, adminRouter };
