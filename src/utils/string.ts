export function generateOTP(length = 6) {
  return Math.random().toFixed(length).slice(-length);
}
