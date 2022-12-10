import { ReactElement, Ref } from "react";
import {isMemo, isForwardRef} from 'react-is';

export function supportRef(element: ReactElement) {
   // fowardRef包装的函数组建支持ref
   if (isForwardRef(element)) {
      return true;
   }
   // 判断是否由memo包装返回的react element
   const type = isMemo(element) ? (element.type as any).type : element.type;
   // 函数组建不支持ref
   if (typeof type === "function") {
      return false;
   }
   return true;
}

export function composeRef(...refs: Ref<any>[]) {
   const validRefs = refs.filter(ref => ref);
   return (node: any) => {
      for(const ref of validRefs) {
         if (typeof ref === "function") {
            ref(node);
         } else {
            (ref as any).current = node;
         }
      }
   }
}