export function delay(ms = 200) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function random(min, max) {
  return min + Math.floor(Math.random() * (max - min) + 0.5);
}
