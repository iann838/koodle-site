import { App } from 'vue'
import axios from 'axios'


class ApiService {

    install (app: App) : void {
        app.config.globalProperties.$api = this
    }

    readonly baseUrl = process.env.VUE_APP_BACKEND_URL

    url (path: string | number | Array<string | number>): string {
        return `${this.baseUrl}/${Array.isArray(path) ? path.join("/") : path}`
    }

    async get<T> (path: string | number | Array<string | number>): Promise<T> {
        const res = await axios.get(this.url(path))
        return res.data
    }

}


function createApi (): ApiService {
    return new ApiService()
}


declare module '@vue/runtime-core' {

    interface ComponentCustomProperties {
        $api: ApiService
    }
}

export { createApi, ApiService }
