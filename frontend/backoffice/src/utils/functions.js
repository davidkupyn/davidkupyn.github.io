export const formatPhoneNumber = (number) =>
  number
    .toString()
    .match(/.{1,3}/g)
    .join(' ');

export const delay = (ms) => new Promise((res) => setTimeout(res, ms));
