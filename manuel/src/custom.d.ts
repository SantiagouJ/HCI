// Type declarations for CSS Modules used in the manuel app
// This file enables importing `*.module.css` files in TypeScript without errors.
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const content: { [key: string]: string };
  export default content;
}
