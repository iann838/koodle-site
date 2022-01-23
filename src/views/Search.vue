<template>
    <div class="py-4 py-lg-5 text-start container">
        <h3>Search Results for: {{$route.params.name}}</h3>
        <div class="mt-4 d-lg-flex">
            <div class="col-12 col-lg-6">
                <div class="fw-bold fs-5">
                    Filters: 
                </div>
                <div class="d-flex align-items-center mt-2 flex-wrap">
                    <Select
                        class="bg-info"
                        dropdown-class="currency-dropdown-bg px-3"
                        :options="storeOptions"
                        v-model="filteredStore"
                    />
                    <div class="ms-3 d-flex align-items-center">
                        <div class="me-2 text-nowrap">
                            Price range:
                        </div>
                        <input
                            class="nav-search-input input-number-noarrows"
                            v-model.lazy="minPrice"
                            type="number"
                            placeholder="Min"
                            style="width: 50px"
                            onkeypress="return event.charCode >= 48"
                            min="0"
                        >
                        <div class="mx-1">
                            -
                        </div>
                        <input
                            class="nav-search-input input-number-noarrows"
                            v-model.lazy="maxPrice"
                            type="number"
                            placeholder="Max"
                            style="width: 50px"
                            onkeypress="return event.charCode >= 48"
                            min="0"
                        >
                    </div>
                </div>
            </div>
            <div class="mt-3 mt-lg-0 ms-lg-4 col-12 col-lg-6">
                <div class="fw-bold fs-5">
                    Sort: 
                </div>
                <div class="mt-2 d-flex align-items-center flex-wrap">
                    <Select
                        class="bg-info"
                        dropdown-class="currency-dropdown-bg px-3"
                        width="200px"
                        :options="sortOptions"
                        v-model="selectedSort"
                    />
                </div>
            </div>
        </div>
        <div class="mt-4">
            <div v-if="loading" class="fw-bold">
                <div class="d-flex justify-content-center py-5">
                    <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
            <div v-else-if="results.length == 0" class="fw-bold">
                *No products found or products does not meet filter criterias. Try reloading page if needed*
            </div>
            <div
                v-for="(result, ind) in results"
                :key="'result' + ind"
                class="py-4 border-bottom border-secondary d-lg-flex"
            >
                <div class="text-center">
                    <img :src="result.img" style="width: 280px" class="image-auto-height" alt="">
                </div>
                <div class="ms-lg-4 mt-4 mt-lg-0">
                    <div>
                        <a :href="result.link" target="_blank" class="fst"><h5><u>{{result.title || "No product name - Click to check product name at store"}}</u></h5></a>
                    </div>
                    <div class="mt-3 text-success">
                        <h5 class="fw-bold" v-if="result.rating">
                            <Icon name="star-fill" size="18px" /> {{result.rating}} out of 5 stars · <span class="capfirst">{{result.store}}</span>
                        </h5>
                        <h5 class="" v-else>
                            No rating found · <span class="capfirst">{{result.store}}</span>
                        </h5>
                    </div>
                    <div class="mt-3">
                        <h4 class="text-primary fw-bold" v-if="result.price_range">
                            ${{result.price_range[0]}} ~ ${{result.price_range[1]}}
                            <span class="text-danger" v-if="$store.state.selectedCurrency != 'USD'">
                                ({{$store.state.selectedCurrency}}
                                {{round(result.price_range[0] * $store.state.currenciesRates[$store.state.selectedCurrency], 100)}}
                                ~
                                {{round(result.price_range[1] * $store.state.currenciesRates[$store.state.selectedCurrency], 100)}})
                            </span>
                        </h4>
                        <h4 class="text-primary fw-bold" v-else-if="result.price">
                            ${{result.price}}
                            <span class="text-danger" v-if="$store.state.selectedCurrency != 'USD'">
                                ({{$store.state.selectedCurrency}}
                                {{round(result.price * $store.state.currenciesRates[$store.state.selectedCurrency], 100)}})
                            </span>
                        </h4>
                        <h5 class="text-primary" v-else>No price available - Check price at store</h5>
                    </div>
                    <div class="mt-3">
                        <a :href="result.link" target="_blank" class="">
                            <button class="btn btn-primary d-inline-block">Buy at store</button>
                        </a>
                        <button
                            class="btn btn-secondary d-inline-block ms-3"
                            disabled
                            v-if="$store.state.comparingItems.length >= 99 && !$store.state.comparingIds[result.id]"
                        >
                            Cannot compare more (Limit: 99)
                        </button>
                        <button
                            class="btn btn-danger d-inline-block ms-3"
                            v-else-if="$store.state.comparingIds[result.id]"
                            @click="$store.commit('removeComparingItem', result.id)"
                        >
                            Remove from compare
                        </button>
                        <button
                            class="btn btn-success d-inline-block ms-3"
                            v-else
                            @click="$store.commit('addComparingItem', result)"
                        >Add to compare</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">

</style>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import { Watch } from "vue-property-decorator"
import { Product } from "@/interfaces"


@Options({})
export default class Search extends Vue {

    loading = false
    real_results: Array<Product> = []
    results: Array<Product> = []

    storeOptions = [
        {title: "All", value: ""},
        {title: "Amazon", value: "amazon"},
        {title: "Alibaba", value: "alibaba"},
        {title: "Ebay", value: "ebay"},
    ]
    filteredStore = ""
    minPrice = ""
    maxPrice = ""
    selectedSort = "featured"

    sortOptions = [
        {title: "Featured", value: "featured"},
        {title: "Price: Low to High", value: "price_asc"},
        {title: "Price: High to Low", value: "price_des"},
        {title: "Rating: Low to High", value: "rating_asc"},
        {title: "Rating: High to Low", value: "rating_des"}
    ]

    @Watch('filteredStore')
    @Watch('selectedSort')
    @Watch('minPrice')
    @Watch('maxPrice')
    updateResults (): void {
        let results = [...this.real_results]
        if (this.filteredStore)
            results = results.filter((result) => result.store == this.filteredStore)
        if (this.minPrice != "" && this.maxPrice != "")
            results = results.filter((result) => result.price >= parseInt(this.minPrice) && result.price <= parseInt(this.maxPrice))
        if (this.selectedSort == 'featured')
            results.sort((a, b) => a.featured_index - b.featured_index)
        if (this.selectedSort == 'price_asc')
            results.sort((a, b) => a.price - b.price)
        if (this.selectedSort == 'price_des')
            results.sort((a, b) => b.price - a.price)
        if (this.selectedSort == 'rating_asc')
            results.sort((a, b) => a.rating - b.rating)
        if (this.selectedSort == 'rating_des')
            results.sort((a, b) => b.rating - a.rating)
        this.results = results
    }

    async created(): Promise<void> {
        this.loading = true
        try {
            this.real_results = await this.$api.get(`search/${this.$route.params.category}/${this.$route.params.name}`)
        } finally {
            this.loading = false
        }
        this.updateResults()
    }

    round (num: number, factor: number): number {
        return Math.round(num * factor) / factor;
    }

}
</script>
