const options = {
	method: 'GET',
	next: {
		revalidate: 60 * 60, // 1 hour
	},
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
	},
};
export default options;
