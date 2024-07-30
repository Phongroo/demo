import { Input } from "reactstrap";
import React from "react";
import { useState } from "react";

const InputComponent = (props) => {
	const { title, value, name, onChange, required, disabled, type, rows, isSubmit, maxLength } = props;
	const [isFocus, setIsFocus] = useState(false);

	return (
		<div className="mb-2">
			<label>
				<span>{title}</span>
				{required && <span className="ml-1 text-danger">(*)</span>}
			</label>
			<Input
				name={name}
				value={value}
				id={name}
				onFocus={() => {
					setIsFocus(true);
				}}
				disabled={disabled}
				type={type ? type : "text"}
				valid={required && value && isFocus}
				invalid={(isFocus && required && !value) || (isSubmit && required && !value)}
				rows={rows}
				placeholder={title ? "Nhập " + title?.toLowerCase() : ""}
				onChange={(event) => onChange(event?.target?.value)}
				maxLength={maxLength}
			/>
		</div>
	);
};

export default InputComponent;
