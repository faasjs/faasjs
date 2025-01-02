import { expect, it } from 'vitest'
import * as All from '..'

it('should work', () => {
  expect(Object.keys(All)).toEqual([
    'Color',
    'LevelColor',
    'colorfy',
    'Logger',
    'Transport',
    'getTransport',
    'registerTransportHandler',
    'unregisterTransportHandler',
    'CachedMessages',
    'insertMessageToTransport',
    'flushTransportMessages',
    'startTransport',
    'stopTransport',
    'resetTransport',
  ])
})
