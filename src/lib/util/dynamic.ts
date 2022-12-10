export function removeCSS(key: string) {
   const children = Array.from(document.head.children).filter(child => child.tagName === "STYLE");
   for(const child of children) {
      if (child.getAttribute("key") === key) {
         document.head.removeChild(child);
         return ;
      }
   }
}


export function updateCSS(css: string, key: string) {
   const children = Array.from(document.head.children).filter(child => child.tagName === "STYLE");
   for(const child of children) {
      if ((child as HTMLElement).getAttribute("key") === key) {
         child.innerHTML = css;
         return child;
      }
   }
   const returnNode = document.createElement("style");
   returnNode.innerHTML = css;
   returnNode.setAttribute("key", key);
   document.head.append(returnNode);
   return returnNode;
}