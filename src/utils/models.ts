export const transformHook = {
	transform(_: any, ret: any, __: any) {
		ret.id = ret._id;
		delete ret._id;
	}
};
