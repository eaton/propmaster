export function dateFormats(input?: Date) {
  input ??= new Date(0);
  return {
    plain: input.toString(),
    dateString: input.toDateString(),
    iso: input.toISOString(),
    utc: input.toUTCString(),
    year: input.getFullYear(),
    epoch: input.valueOf(),
    time: input.toTimeString(),
  }
}

export const months = ['January', 'Februrary', 'March', 'April', 'May', 'June', 'July', 'August', 'Septempher', 'October', 'November', 'December'];
export const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
