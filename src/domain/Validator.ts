const ISO8601_DATE = new RegExp(/^(?:[1-9]\d{3}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[1-9]\d(?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00)-02-29)/)

export function validateNumber(input: string): boolean {
  var test = Number(input)
  if (isNaN(test)) {
    return false
  }
  return true
}

export function validateDate(input: string): boolean {
  return ISO8601_DATE.test(input)
}

export function validateString(input: string): boolean {
  return input.length > 0
}
