<template>
    <div class="py-4 py-lg-5 text-start container">
        <h3>Product Comparison:</h3>
        <div class="mt-3">
            <span @click="$router.go(-1)" class="cursor-pointer">
                <Icon name="chevron-left" :size="16" /> Go back
            </span>
        </div>
        <div class="mt-4" v-if="pivotProduct">
            <h5 class="fw-bold">Pivot Product:</h5>
            <div class="py-4 d-lg-flex">
                <div class="text-center">
                    <img :src="pivotProduct.img" style="width: 280px" class="image-auto-height" alt="">
                </div>
                <div class="ms-lg-4 mt-4 mt-lg-0">
                    <div>
                        <a
                            :href="pivotProduct.link"
                            @click="$api.get(`click/${pivotProduct.request.category}/${pivotProduct.request.name}`)"
                            target="_blank" class="fst"
                        ><h5><u>{{pivotProduct.title || "No product name - Click to check product name at store"}}</u></h5></a>
                    </div>
                    <div class="mt-3 text-success">
                        <h5 class="fw-bold" v-if="pivotProduct.rating">
                            <Icon name="star-fill" size="18px" /> {{pivotProduct.rating}} out of 5 stars · <span class="capfirst">{{pivotProduct.store}}</span>
                        </h5>
                        <h5 class="" v-else>
                            No rating found · <span class="capfirst">{{pivotProduct.store}}</span>
                        </h5>
                    </div>
                    <div class="mt-3">
                        <h4 class="text-primary fw-bold" v-if="pivotProduct.price_range">
                            ${{pivotProduct.price_range[0]}} ~ ${{pivotProduct.price_range[1]}}
                            <span class="text-danger" v-if="$store.state.selectedCurrency != 'USD'">
                                ({{$store.state.selectedCurrency}}
                                {{round(pivotProduct.price_range[0] * $store.state.currenciesRates[$store.state.selectedCurrency], 100)}}
                                ~
                                {{round(pivotProduct.price_range[1] * $store.state.currenciesRates[$store.state.selectedCurrency], 100)}})
                            </span>
                        </h4>
                        <h4 class="text-primary fw-bold" v-else-if="pivotProduct.price">
                            ${{pivotProduct.price}}
                            <span class="text-danger" v-if="$store.state.selectedCurrency != 'USD'">
                                ({{$store.state.selectedCurrency}}
                                {{round(pivotProduct.price * $store.state.currenciesRates[$store.state.selectedCurrency], 100)}})
                            </span>
                        </h4>
                        <h5 class="text-primary" v-else>No price available - Click to check price at store</h5>
                    </div>
                    <div class="mt-3">
                        <a @click="$api.get(`click/${pivotProduct.request.category}/${pivotProduct.request.name}`)" :href="pivotProduct.link" target="_blank" class="">
                            <button class="btn btn-primary d-inline-block">Buy at store</button>
                        </a>
                    </div>
                    <div class="mt-3 pt-3 border-top border-muted">
                        <button
                            class="btn btn-danger d-inline-block"
                            @click="$store.commit('clearComparingItems'); pivotProduct = null"
                        >
                            Clear comparing products <Icon name="trash-fill" size="16px" />
                        </button>
                    </div>
                </div>
            </div>
            <h5 class="fw-bold mt-2">
                <span class="me-3">
                    Comparing Products:
                </span>
                <Select
                    class="bg-info mt-3"
                    dropdown-class="currency-dropdown-bg px-3 fw-normal small"
                    width="200px"
                    :options="sortOptions"
                    v-model="selectedSort"
                />
            </h5>
            <div v-for="(product, ind) in products" :key="'compare' + ind">
                <div
                    class="py-4 d-lg-flex border-bottom border-secondary"
                    v-if="product.id != pivotProduct.id"
                >
                    <div class="text-center">
                        <img :src="product.img" style="width: 280px" class="image-auto-height" alt="">
                    </div>
                    <div class="ms-lg-4 mt-4 mt-lg-0">
                        <div>
                            <a
                                :href="product.link"
                                @click="$api.get(`click/${product.request.category}/${product.request.name}`)"
                                target="_blank" class="fst"
                            ><h5><u>{{product.title || "No product name - Click to check product name at store"}}</u></h5></a>
                        </div>
                        <div class="mt-3 text-success">
                            <h5 class="fw-bold" v-if="product.rating">
                                <Icon name="star-fill" size="18px" /> {{product.rating}} out of 5 stars
                                <span class="text-dark" v-if="product.rating && pivotProduct.rating">({{priceSigned(round(product.rating - pivotProduct.rating, 10))}})</span>
                                · <span class="capfirst">{{product.store}}</span>
                            </h5>
                            <h5 class="" v-else>
                                No rating found · <span class="capfirst">{{product.store}}</span>
                            </h5>
                        </div>
                        <div class="mt-3">
                            <h4 class="text-primary fw-bold" v-if="product.price_range">
                                <div>
                                    ${{product.price_range[0]}} ~ ${{product.price_range[1]}}
                                    <span class="text-dark">
                                        ({{priceSigned(round(product.price_range[0] - pivotProduct.price, 100))}} ~
                                        {{priceSigned(round(product.price_range[1] - pivotProduct.price, 100))}})
                                    </span>
                                </div>
                                <div class="text-danger mt-2" v-if="$store.state.selectedCurrency != 'USD'">
                                    {{$store.state.selectedCurrency}}
                                    {{round(product.price_range[0] * $store.state.currenciesRates[$store.state.selectedCurrency], 100)}}
                                    ~
                                    {{round(product.price_range[1] * $store.state.currenciesRates[$store.state.selectedCurrency], 100)}}
                                    <span class="text-dark">
                                        ({{$store.state.selectedCurrency}}
                                        {{priceSigned(round((product.price_range[0] - pivotProduct.price) * $store.state.currenciesRates[$store.state.selectedCurrency], 100))}}
                                        ~
                                        {{priceSigned(round((product.price_range[1] - pivotProduct.price) * $store.state.currenciesRates[$store.state.selectedCurrency], 100))}})
                                    </span>
                                </div>
                            </h4>
                            <h4 class="text-primary fw-bold" v-else-if="product.price">
                                <div>
                                    ${{product.price}} <span class="text-dark">({{priceSigned(round(product.price - pivotProduct.price, 100))}})</span>
                                </div>
                                <div class="text-danger mt-2" v-if="$store.state.selectedCurrency != 'USD'">
                                    {{$store.state.selectedCurrency}}
                                    {{round(product.price * $store.state.currenciesRates[$store.state.selectedCurrency], 100)}}
                                    <span class="text-dark">
                                        ({{priceSigned(round((product.price - pivotProduct.price) * $store.state.currenciesRates[$store.state.selectedCurrency], 100))}})
                                    </span>
                                </div>
                            </h4>
                            <h5 class="text-primary" v-else>No price available - Check price at store</h5>
                        </div>
                        <div class="">
                            <a @click="$api.get(`click/${product.request.category}/${product.request.name}`)" :href="product.link" target="_blank" class="">
                                <button class="btn btn-primary mt-3 d-inline-block">Buy at store</button>
                            </a>
                            <button
                                class="btn btn-success mt-3 d-inline-block mx-3"
                                @click="pivotProduct = product"
                            >
                                Set as pivot product
                            </button>
                            <button
                                class="btn btn-danger mt-3 d-inline-block"
                                @click="$store.commit('removeComparingItem', product.id); updateProducts()"
                            >
                                Remove from compare
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="mt-4 fw-bold">
            *You have not selected any products for comparison*
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
export default class Compare extends Vue {

    pivotProduct: Product | null = null
    products: Array<Product> = []

    selectedSort = "featured"    
    sortOptions = [
        {title: "Featured", value: "featured"},
        {title: "Price: Low to High", value: "price_asc"},
        {title: "Price: High to Low", value: "price_des"},
        {title: "Rating: Low to High", value: "rating_asc"},
        {title: "Rating: High to Low", value: "rating_des"}
    ]

    @Watch('selectedSort')
    updateProducts (): void {
        let products = [...this.$store.state.comparingItems]
        if (this.selectedSort == 'featured')
            products.sort((a, b) => a.featured_index - b.featured_index)
        if (this.selectedSort == 'price_asc')
            products.sort((a, b) => a.price - b.price)
        if (this.selectedSort == 'price_des')
            products.sort((a, b) => b.price - a.price)
        if (this.selectedSort == 'rating_asc')
            products.sort((a, b) => a.rating - b.rating)
        if (this.selectedSort == 'rating_des')
            products.sort((a, b) => b.rating - a.rating)
        this.products = products
    }

    created(): void {
        if (this.$store.state.comparingItems)
            this.pivotProduct = this.$store.state.comparingItems[0]
        this.updateProducts()
    }

    round (num: number, factor: number): number {
        return Math.round(num * factor) / factor;
    }

    priceSigned (price: number): string {
        if (price >= 0)
            return '+' + price
        return price.toString()
    }

}
</script>
