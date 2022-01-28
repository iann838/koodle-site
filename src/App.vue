<template>
    <nav class="navbar navbar-expand-lg bg-info fixed-top" style="height: 68px">
        <div class="container d-flex bg-info">
            <div class="navbar-brand" style="text-decoration: none">
                <router-link to="/">
                    <Image src="/logo.png" size="40" />
                    <span class="fw-bold d-inline-block ms-3">
                        Koodle
                    </span>
                </router-link>
            </div>
            <button class="navbar-toggler ms-auto btn nav-search-button-bg p-1" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                <Icon name="menu" size="24px" />
            </button>
            <div class="flex-fill d-none d-lg-flex align-items-center px-5">
                <Select
                    v-model="searchCategory"
                    class="nav-search-button-bg extra-small rounded-2 pt-1"
                    dropdown-class="currency-dropdown-bg"
                    :options="$const.categories"
                    width="120px"
                />
                <input
                    class="nav-search-input flex-fill px-lg-2"
                    v-model="searchName"
                    type="text"
                    placeholder="Search Product"
                    @keyup.enter="$refs.searchButton.$el.click()"
                >
                <router-link
                    class="btn nav-search-button-bg"
                    :to="searchName ? `/search/${searchCategory}/${searchName}`: '#'"
                    ref="searchButton"
                >
                    <Icon name="search" size="16px" />
                </router-link>
            </div>
            <div>
                <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
                    <div class="d-flex navbar-item py-3 py-lg-0">
                        <div class="d-flex" style="width: 150px">
                            <router-link
                                class="btn nav-search-button-bg px-0"
                                to="/compare"
                                style="width: 120px"
                            >
                                Compare ({{$store.state.comparingItems.length}})
                            </router-link>
                            <div class="btn nav-search-button-bg px-1" style="width: 30px" @click="$store.commit('clearComparingItems')">
                                <Icon name="trash-fill" size="16px" />
                            </div>
                        </div>
                        <div style="width: 80px" class="ms-2">
                            <Select v-if="$store.state.currencies && selectedCurrency" v-model="selectedCurrency" class="nav-search-button-bg" dropdown-class="currency-dropdown-bg" :options="$store.state.currencies" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
            <component :is="Component" :key="$route.fullPath" />
        </transition>
    </router-view>
    <div class="text-secondary fst-italic p-3"><small>*Disclaimer: This website only serves for educational purpose only | <a href="https://github.com/paaksing/koodle-api" class="text-primary">Open Source</a>*</small></div>
</template>

<style lang="scss">
@import '@/scss/globals.scss';
@import '@/scss/transitions.scss';

@include fade('fade', .06s);

#app {
    font-family: 'Open Sans', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    padding-top: 68px;
}

a {
    text-decoration: none;
    color: inherit;

    &:hover {
        color: inherit;
    }
}

.nav-search-input {
    height: 38px;
    border-radius: 5px;
    background-color: rgb(219, 219, 255);
}

.nav-search-button-bg {
    background-color: rgb(89, 153, 231);
}

.currency-dropdown-bg {
    background-color: rgb(105, 161, 230);
}

</style>

<script lang="ts">
import { Options, Vue } from "vue-class-component"
import { Watch } from "vue-property-decorator"

@Options({})
export default class Home extends Vue {

    searchName = ""
    searchCategory = "all"
    selectedCurrency = ""

    @Watch('selectedCurrency')
    selectedCurrencyChanged(after: string): void {
        this.$stge.loc.setItem("selectedCurrency", after)
        this.$store.commit("setCurrency", after)
    }

    @Watch('$route')
    routeChanged(after: Record<string, any>): void {
        if (this.$const.allowedCategories.includes(after.params.category))
            this.searchCategory = after.params.category
        if (after.params.name)
            this.searchName = after.params.name
    }

    async created(): Promise<void> {
        this.$store.commit('setCurrencies', await this.$api.get("currencies"))
        this.selectedCurrency = this.$stge.loc.getItem("selectedCurrency") || "USD"
    }

}
</script>
