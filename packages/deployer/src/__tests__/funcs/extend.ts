import {
  Plugin, InvokeData, Next
} from '@faasjs/func'

export default class Extend implements Plugin {
  public readonly type: string
  public readonly name: string

  constructor () {
    this.type = 'Extend'
  }

  onInvoke (data: InvokeData, next: Next): void {
    data.event++
    next()
  }
}
