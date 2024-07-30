import replace from 'lodash/replace';

const patternEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

const isValidPhoneNumber = number => {
  const numberPhoneValid = replace(number, /[+ ]/g, '');

  return (
    numberPhoneValid.length >= 12 ||
    numberPhoneValid.length === 0
  );
};

const allowPositive = e => {
  const { value } = e.target;

  e.target.value = value
    .replace(/[^.\d]/g, '')
    .replace(/^(\d*\.?)|(\d*)\.?/g, '$1$2');

  return e;
};

export { patternEmail, isValidPhoneNumber, allowPositive };
