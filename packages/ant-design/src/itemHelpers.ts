import type { ReactNode } from 'react'

import {
  type BaseOption,
  cloneUnionFaasItemElement,
  type FaasItemProps,
  type FaasItemType,
  idToTitle,
  transferOptions,
  type UnionFaasItemElement,
  type UnionFaasItemRender,
  type UnionScene,
} from './data'

type SceneAwareItem<Value = any, Values = any> = FaasItemProps & {
  children?: UnionFaasItemElement<Value, Values> | null
  render?: UnionFaasItemRender<Value, Values> | null
  formChildren?: UnionFaasItemElement<Value, Values> | null
  formRender?: UnionFaasItemRender<Value, Values> | null
  descriptionChildren?: UnionFaasItemElement<Value, Values> | null
  descriptionRender?: UnionFaasItemRender<Value, Values> | null
  tableChildren?: UnionFaasItemElement<Value, Values> | null
  tableRender?: UnionFaasItemRender<Value, Values> | null
}

type SceneExtendType<Value = any, Values = any> = {
  children?: UnionFaasItemElement<Value, Values>
  render?: UnionFaasItemRender<Value, Values>
}

const sceneKeys: Record<
  UnionScene,
  {
    children: keyof SceneAwareItem
    render: keyof SceneAwareItem
  }
> = {
  form: {
    children: 'formChildren',
    render: 'formRender',
  },
  description: {
    children: 'descriptionChildren',
    render: 'descriptionRender',
  },
  table: {
    children: 'tableChildren',
    render: 'tableRender',
  },
}

export function normalizeSceneItem<T extends SceneAwareItem>(
  item: T,
): T & {
  title: string
  type: FaasItemType
} {
  item.title = item.title ?? idToTitle(item.id)
  item.type = (item.type ?? 'string') as FaasItemType

  if (item.options?.length) item.options = transferOptions(item.options as BaseOption[]) as any

  return item as T & {
    title: string
    type: FaasItemType
  }
}

export function transferOptionLabels(
  type: string | null | undefined,
  options:
    | {
        label: string
        value: any
      }[]
    | undefined,
  value: any,
): any {
  if (!options?.length || value === null) return value

  if (type?.endsWith('[]'))
    return (value as any[]).map(
      (item) => options.find((option) => option.value === item)?.label || item,
    )

  if (type && ['string', 'number', 'boolean'].includes(type))
    return options.find((option) => option.value === value)?.label || value

  return value
}

export function shouldRenderSceneItem(item: SceneAwareItem, scene: UnionScene): boolean {
  const keys = sceneKeys[scene]

  return !(
    item[keys.children] === null ||
    item.children === null ||
    item[keys.render] === null ||
    item.render === null
  )
}

export function getSceneChildren(
  item: SceneAwareItem,
  scene: UnionScene,
): UnionFaasItemElement | null | undefined {
  const keys = sceneKeys[scene]

  return (item[keys.children] as UnionFaasItemElement | null | undefined) || item.children
}

export function getSceneRender(
  item: SceneAwareItem,
  scene: UnionScene,
): UnionFaasItemRender | null | undefined {
  const keys = sceneKeys[scene]

  return (item[keys.render] as UnionFaasItemRender | null | undefined) || item.render
}

export function renderSceneNode({
  scene,
  item,
  value,
  values,
  index,
  extendType,
}: {
  scene: UnionScene
  item: SceneAwareItem
  value: any
  values?: any
  index: number
  extendType?: SceneExtendType
}): {
  matched: boolean
  node: ReactNode
} {
  const children = getSceneChildren(item, scene)

  if (children)
    return {
      matched: true,
      node: cloneUnionFaasItemElement(children, {
        scene,
        value,
        values,
        index,
      }),
    }

  const render = getSceneRender(item, scene)

  if (render)
    return {
      matched: true,
      node: render(value, values as any, index, scene),
    }

  if (extendType?.children)
    return {
      matched: true,
      node: cloneUnionFaasItemElement(extendType.children, {
        scene,
        value,
        values,
        index,
      }),
    }

  if (extendType?.render)
    return {
      matched: true,
      node: extendType.render(value, values as any, index, scene),
    }

  if (extendType) throw Error(`${item.type} requires children or render`)

  return {
    matched: false,
    node: null,
  }
}
