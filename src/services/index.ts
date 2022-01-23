import { createApi } from './api'
import { createStorage } from './stge'
import { createConst } from './const'

const api = createApi()
const stge = createStorage()
const _const = createConst()

export { api, stge, _const }
