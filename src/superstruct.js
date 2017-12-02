
import TYPES from './types'
import KINDS from './kinds'
import StructError from './error'
import isStruct, { IS_STRUCT } from './is-struct'

/**
 * Create a struct factory with a `config`.
 *
 * @param {Object} config
 * @return {Function}
 */

function superstruct(config = {}) {
  const types = {
    ...TYPES,
    ...(config.types || {}),
  }

  /**
   * Create a `kind` struct with `schema`, `defaults` and `options`.
   *
   * @param {Any} schema
   * @param {Any} defaults
   * @param {Object} options
   * @return {Function}
   */

  function struct(schema, defaults, options = {}) {
    if (isStruct(schema)) schema = schema.schema

    const kind = KINDS.any(schema, defaults, { ...options, types })

    function Struct(data) {
      if (this instanceof Struct) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error('The `Struct` creation function should not be used with the `new` keyword.')
        } else {
          throw new Error('Invalid `new` keyword!')
        }
      }

      return Struct.assert(data)
    }

    Object.defineProperty(Struct, IS_STRUCT, { value: true })
    Object.defineProperty(Struct, '__kind', { value: kind })

    Struct.kind = kind.name
    Struct.type = kind.type
    Struct.schema = schema
    Struct.defaults = defaults
    Struct.options = options

    Struct.assert = (value) => {
      const [ error, result ] = kind.validate(value)
      if (error) throw new StructError(error)
      return result
    }

    Struct.test = (value) => {
      const [ error ] = kind.validate(value)
      return !error
    }

    Struct.validate = (value) => {
      const [ error, result ] = kind.validate(value)
      if (error) return [new StructError(error)]
      return [undefined, result]
    }

    return Struct
  }

  /**
   * Mix in a factory for each specific kind of struct.
   */

  Object.keys(KINDS).forEach((name) => {
    const kind = KINDS[name]

    struct[name] = (schema, defaults, options) => {
      const type = kind(schema, defaults, { ...options, types })
      const s = struct(type, defaults, options)
      return s
    }
  })

  /**
   * Return the struct factory.
   */

  return struct
}

/**
 * Export.
 *
 * @type {Function}
 */

export default superstruct
