import type { DefineWorkflowOptions, WorkflowDefinition, WorkflowSteps } from './types'

/**
 * Define a workflow. The definition is explicit and is not registered globally.
 *
 * @param options - Workflow type, root step name, and step handlers.
 */
export function defineWorkflow<TSteps extends WorkflowSteps>(
  options: DefineWorkflowOptions<TSteps>,
): WorkflowDefinition<TSteps> {
  if (!options || typeof options !== 'object') {
    throw Error('[workflow] options must be an object.')
  }

  if (typeof options.type !== 'string' || !options.type.trim()) {
    throw Error('[workflow] type must not be empty.')
  }

  if (typeof options.root !== 'string' || !options.root.trim()) {
    throw Error('[workflow] root must not be empty.')
  }

  if (!options.steps || typeof options.steps !== 'object') {
    throw Error('[workflow] steps must be an object.')
  }

  if (!Object.keys(options.steps).length) {
    throw Error('[workflow] steps must not be empty.')
  }

  if (typeof options.steps[options.root] !== 'function') {
    throw Error(`[workflow] root step "${options.root}" is missing.`)
  }

  for (const [name, handler] of Object.entries(options.steps)) {
    if (!name.trim()) throw Error('[workflow] step name must not be empty.')
    if (typeof handler !== 'function') {
      throw Error(`[workflow] step "${name}" handler must be a function.`)
    }
  }

  return Object.freeze({
    type: options.type,
    root: options.root,
    steps: options.steps,
  })
}
