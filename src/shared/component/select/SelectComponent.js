import Select, { components } from "react-select";
import React, { useState } from "react";

const SelectComponent = (props) => {
  const {
    isIntable,
    title,
    list,
    value,
    name,
    onChange,
    bindLabel,
    bindValue,
    notFirstDefault,
    firstRecord,
    optionIcon,
    disabled,
    clearable,
    isMulti,
    isSubmit,
    defaultValue, // Dùng cho select multi (Lưu ý: Chỉ truyền default value, k truyền value)
    required,
  } = props;
  const [onFocus, setOnFocus] = useState(false);
  const [valueTemp, setValueTemp] = useState();
  const firstRecordTemp = notFirstDefault
    ? {
        label: null,
        value: null,
      }
    : firstRecord || {
        label: "Tất cả",
        value: "",
      };

  const Option = (props) => {
    // const CComponent = props.icon;
    return (
      <div
        style={{
          display: "flex",
          backgroundColor: "white",
        }}
      >
        {/*<CComponent />*/}

        <components.Option {...props}>
          <div
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {optionIcon && (
              <i className={(props[optionIcon] || " ml-2 ") + " mr-2"}></i>
            )}
            <span>{props?.label}</span>
          </div>
        </components.Option>
      </div>
    );
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      // state.isFocused can display different borderColor if you need it
      borderColor: state.isFocused ? "#ddd" : checkIsValid() ? "#ddd" : "red",

      // overwrittes hover style
      "&:hover": {
        borderColor: state.isFocused ? "#ddd" : checkIsValid() ? "#ddd" : "red",
      },
    }),
  };
  const checkIsValid = () => {
    if (isMulti) {
      if (valueTemp?.length > 0) return true;
    } else {
      if (valueTemp) return true;
    }
    if (value?.length > 0) return true;
    return false;
  };

  return (
    <div className={isIntable ? "mt-2 " : "mb-2 "}>
      {title ? (
        <label>
          <span>
            {title} {required && <span className="ml-1 text-danger">(*)</span>}
          </span>
        </label>
      ) : null}

      <Select
        menuPosition={isIntable ? "fixed" : "absolute"}
        styles={isSubmit && required ? customStyles : {}}
        defaultValue={
          isMulti
            ? defaultValue?.map((x) => {
                const obj = list?.find((z) => z?.[bindValue] === x);
                return obj;
              })
            : list?.find((x) => x?.[bindValue] === defaultValue) ||
              firstRecordTemp
        }
        isClearable={clearable}
        components={{ Option }}
        valid={true}
        //   invalid={
        //     (isFocus && required && !value) || (isSubmit && required && !value)
        //   }
        // clearable={clearable}
        isDisabled={disabled}
        isMulti={isMulti}
        placeholder={"-- Chọn --"}
        name={name}
        value={
          isMulti
            ? value?.map((x) => {
                const obj = list?.find((z) => z[bindValue] === x);
                return obj;
              })
            : list?.find((x) => x[bindValue] === value) || firstRecordTemp
        }
        onChange={(val) => {
          setOnFocus(true);
          setValueTemp(val);
          onChange(val);
        }}
        options={[
          ...(isMulti && notFirstDefault ? [] : [firstRecordTemp]),
          ...list?.map((x) => {
            x.label = x[bindLabel];
            x.value = x[bindValue];
            return x;
          }),
        ]}
      ></Select>
    </div>
  );
};

export default SelectComponent;
