<template>
    <div class="d-flex flex-column">
        <div class="main-bg">
        </div>
        <div class="rounded-3 py-5 px-3 px-lg-5 bg-white mx-auto home-input" style="margin-top: -180px">
            <div class="d-flex align-items-center justify-content-center">
                <img src="/logo-dark.png" alt="">
                <img class="ms-5 d-none d-lg-block" src="/logo-text.png" alt="">
            </div>
            <div class="mt-5">
                <Select
                    v-model="searchCategory"
                    class="nav-search-button-bg d-lg-none extra-small rounded-2 pt-1"
                    dropdown-class="currency-dropdown-bg"
                    :options="$const.categories"
                    width="100%"
                />
            </div>
            <div class="d-flex px-3 px-lg-5">
                <Select
                    v-model="searchCategory"
                    class="nav-search-button-bg d-none d-lg-block extra-small rounded-2 pt-1"
                    dropdown-class="currency-dropdown-bg"
                    :options="$const.categories"
                    width="120px"
                />
                <input
                    type="text"
                    v-model="searchName"
                    class="flex-fill px-lg-2"
                    placeholder="Search Product"
                    @keyup.enter="$refs.searchButton.$el.click()"
                >
                <router-link
                    class="btn btn-info"
                    :to="searchName ? `/search/${searchCategory}/${searchName}`: '#'"
                    ref="searchButton"
                >
                    <Icon name="search" size="16px" />
                </router-link>
            </div>
            <div class="mt-4 mt-lg-5">
                <h2>Products gathered from popular stores on Amazon, Alibaba and Ebay.</h2>
            </div>
        </div>
    </div>
</template>

<style lang="scss">

.main-bg {
    background: url("https://www.nevadaart.org/wp-content/uploads/2019/05/2019_MuseumShop_Hero.jpg") no-repeat center/cover fixed;
    height: max(40vh, 280px);
}

.home-input {
    width: max(60vw, 360px);
}

</style>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class Home extends Vue {

    searchName = ""
    searchCategory = "all"

}
</script>
