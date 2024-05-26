import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';

const Test = () => {
	const [val, setVal] = useState(false);

	function toggle() {
		setVal(prev => {
			console.log(!prev);
			return !prev;
		});
	}
	return (
		<div className="container">
			<Checkbox checked={val} onCheckedChange={toggle} />
		</div>
	);
};

export default Test;
