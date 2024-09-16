export interface JwtAuthPayload {
	user: {
		id: string;
		email: string;
		customerId: string;
	};
}
