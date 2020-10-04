export const required = value => value.trim() !== ''

export const validateLength = value => {
  let isValid = true
  let valueTrimmed = value.trim().length
  let min = 6

  if (min < valueTrimmed) {
    isValid = true
  }
  if (min > valueTrimmed) {
    isValid = false
  }
  return isValid
}

export const validateEmail = value =>
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
    value
)
