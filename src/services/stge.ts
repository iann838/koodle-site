import { App } from 'vue'

import localforage from 'localforage'

class StorageService {

    install (app: App) : void {
        app.config.globalProperties.$stge = this
        this.checkDefaults()
    }

    get loc (): Storage {
        return localStorage
    }

    get db (): typeof localforage {
        return localforage
    }

    checkDefaults(): void {
        this.setLocDefault('selectedCurrency', 'USD')
    }

    setLocDefault(name: string, value: string): void {
        if (this.loc[name] == undefined)
            this.loc[name] = value
    }

}


function createStorage (): StorageService {
    return new StorageService()
}


declare module '@vue/runtime-core' {

    interface ComponentCustomProperties {
        $stge: StorageService
    }
}

export { createStorage, StorageService }
