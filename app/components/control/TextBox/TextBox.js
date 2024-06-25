import { useState } from "react";

const TextBox = ({ id, required, label, value, onChange, validate, invalidText, containerClassName, inputClassName, ...rest }) => {
    const [isValueValid, setisValueValid] = useState(true);

    const handleChange = (e) => {
        const newValue = e.target.value;

        if (!isValueValid) setisValueValid(true);

        onChange(newValue);
    };

    const handleBlur = () => {
        if (validate) {
            setisValueValid(validate(value));
        }
    };

    let containerClassNames = 'onetap-control';
    if (containerClassName) containerClassNames += ` ${containerClassName}`;
    if (!isValueValid) containerClassNames += ` invalid`;

    return (
        <div className={containerClassNames}>
            <label htmlFor={id}>
                {label}
                {' '}
                {required && <span className="required-marker">*</span>}
            </label>
            <input
                {...rest}
                id={id}
                className={inputClassName}
                type={rest.type || 'text'}
                onChange={handleChange}
                onBlur={handleBlur}
                value={value}
            />
            {!isValueValid && (
                <p>{invalidText}</p>
            )}
        </div>
    )
};

export default TextBox;