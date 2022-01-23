import { createStore } from 'vuex'
import { Store } from 'vuex'
import { Option, Product } from '@/interfaces'

interface State {
    selectedCurrency: string
    currencies: Array<Option>
    currenciesRates: Record<string, number>
    comparingIds: Record<string, boolean>,
    comparingItems: Array<Product>,
}

declare module '@vue/runtime-core' {

    interface ComponentCustomProperties {
        $store: Store<State>
    }
}

export default createStore({
    state: {
        selectedCurrency: 'USD',
        currencies: [],
        currenciesRates: {},
        comparingIds: {},
        comparingItems: [],
    },
    mutations: {
        setCurrencies (state: State, currencies: Record<string, number>): void {
            state.currenciesRates = currencies
            const currenciesOptions: Array<Option> = []
            for (const currency of Object.keys(currencies))
                currenciesOptions.push({title: currency, value: currency})
            state.currencies = currenciesOptions
        },
        setCurrency (state: State, selectedCurrency: string): void {
            state.selectedCurrency = selectedCurrency
        },
        addComparingItem (state: State, item: Product) {
            state.comparingIds[item.id] = true
            state.comparingItems.push(item)
        },
        removeComparingItem (state: State, id: string) {
            delete state.comparingIds[id]
            state.comparingItems = state.comparingItems.filter((o) => o.id != id)
        },
        clearComparingItems (state: State) {
            state.comparingIds = {}
            state.comparingItems = []
        }
    },
    actions: {
    },
    modules: {
    }
})
