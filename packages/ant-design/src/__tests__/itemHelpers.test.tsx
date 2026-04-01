import { createElement } from 'react'
import { describe, expect, it } from 'vitest'

import {
  getSceneChildren,
  getSceneRender,
  normalizeSceneItem,
  renderSceneNode,
  shouldRenderSceneItem,
  transferOptionLabels,
} from '../itemHelpers'

describe('itemHelpers', () => {
  it('should normalize title, type, and options', () => {
    const item = normalizeSceneItem({
      id: 'hello_world',
      options: ['hello_world'],
    })

    expect(item.title).toBe('Hello World')
    expect(item.type).toBe('string')
    expect(item.options).toEqual([{ label: 'Hello World', value: 'hello_world' }])
  })

  it('should transfer option labels for scalar and array values', () => {
    const options = [
      { label: 'Enabled', value: true },
      { label: 'Alpha', value: 'a' },
      { label: 'Beta', value: 'b' },
    ]

    expect(transferOptionLabels('boolean', options, true)).toBe('Enabled')
    expect(transferOptionLabels('string[]', options, ['a', 'b'])).toEqual(['Alpha', 'Beta'])
  })

  it('should resolve scene-specific children and render callbacks', () => {
    const FormComponent = (props: { value?: string }) => createElement('span', null, props.value)
    const tableRender = () => 'table-render'
    const item = {
      id: 'name',
      children: FormComponent,
      tableRender,
    }

    expect(getSceneChildren(item, 'form')).toBe(FormComponent)
    expect(getSceneRender(item, 'table')).toBe(tableRender)
  })

  it('should detect hidden scene items', () => {
    expect(
      shouldRenderSceneItem(
        {
          id: 'hidden',
          descriptionChildren: null,
        },
        'description',
      ),
    ).toBe(false)
  })

  it('should render custom and extend scene nodes', () => {
    const SceneComponent = (props: { value?: string }) => createElement('span', null, props.value)

    const childNode = renderSceneNode({
      scene: 'table',
      item: {
        id: 'name',
        children: SceneComponent,
      },
      value: 'value',
      index: 0,
    })

    expect(childNode.matched).toBe(true)
    expect((childNode.node as any).props.value).toBe('value')

    const extendNode = renderSceneNode({
      scene: 'description',
      item: {
        id: 'name',
        type: 'custom',
      } as any,
      value: 'value',
      index: 0,
      extendType: {
        render: (value) => `extend:${value}`,
      },
    })

    expect(extendNode).toEqual({
      matched: true,
      node: 'extend:value',
    })
  })
})
