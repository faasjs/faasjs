# create-faas-app

Quickly scaffold a FaasJS project with the shared FaasJS Vite and TypeScript defaults.

## Templates

- `basic`: default starter with `@faasjs/react`
- `antd`: Ant Design starter with `@faasjs/ant-design`

## Usage

```bash
npx create-faas-app --name faasjs
npx create-faas-app --name faasjs-admin --template antd
```

Generated projects reuse the shared `@faasjs/dev` config exports and the
`@faasjs/types/tsconfig/build.json` preset.

## Functions

- [main](functions/main.md)
