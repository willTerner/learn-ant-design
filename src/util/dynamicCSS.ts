function getContainer() {
  return document.head ?? document.body;
}

export function removeCSS(key: string) {
  const container = getContainer();
  const children = Array.from(container.children).filter(
    (child) => child.tagName === "STYLE"
  );
  for (let i = 0; i < children.length; i++) {
    if (children[i].getAttribute("data-key") === key) {
      container.removeChild(children[i]);
      return true;
    }
  }
  return false;
}

export function updateCSS(css: string, key: string) {
  const container = getContainer();
  const children = Array.from(container.children).filter(
    (el) => el.tagName === "STYLE"
  );
  for (let i = 0; i < children.length; i++) {
    if (children[i].getAttribute("data-key") === key) {
      children[i].innerHTML = css;
      return children[i];
    }
  }
  const newNode = document.createElement("style");
  newNode.setAttribute("data-key", key);
  newNode.innerHTML = css;
  container.insertBefore(newNode, children[children.length - 1].nextSibling);
  return newNode;
}
