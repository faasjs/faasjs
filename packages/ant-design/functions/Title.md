[@faasjs/ant-design](../README.md) / Title

# Function: Title()

> **Title**(`props`): `JSX.Element`

Title is used to change the title of the page

Return null by default.

```tsx
// return null
<Title title='hi' /> // => change the document.title to 'hi'
<Title title={['a', 'b']} /> // => change the document.title to 'a - b'

// return h1
<Title title='hi' h1 /> // => <h1>hi</h1>
<Title title={['a', 'b']} h1 /> // => <h1>a</h1>

// return children
<Title title='hi'><CustomTitle /></Title> // => <CustomTitle />
```

## Parameters

• **props**: [`TitleProps`](../interfaces/TitleProps.md)

## Returns

`JSX.Element`
