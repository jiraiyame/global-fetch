export default function isObject(target: any): boolean {
  return Object.prototype.toString.call(target) === '[object Object]';
}
