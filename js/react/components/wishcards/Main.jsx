import { useState, useEffect } from 'react';

export default function WishCards(_props) {
	const [isLoading, setLoading] = useState(true);
	const [response, setResponse] = useState({});

	const fetchData = async () => {
		setLoading(true);
		const res = await fetch('/api/wishcards');
		const data = await res.json();
		setResponse(data);
		setLoading(false);
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div>
			<h1>{!isLoading && response.message}</h1>
		</div>
	);
}
