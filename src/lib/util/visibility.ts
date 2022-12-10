export function isHidden(node: HTMLElement) {
   return !node || !node.offsetParent || node.hidden; 
}