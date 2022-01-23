import { App } from 'vue'

interface Option {
    title: string
    value: string
}

class Const {

    install (app: App) : void {
        app.config.globalProperties.$const = this
    }

    categories: Array<Option> = [
        {title: "All Products", value: "all"},
        {title: "Arts & Crafts", value: "arts"},
        {title: "Automotive", value: "automotive"},
        {title: "Baby", value: "baby"},
        {title: "Beauty", value: "beauty"},
        {title: "Books", value: "books"},
        {title: "Boy's", value: "boys"},
        {title: "Computers", value: "computers"},
        {title: "Electronics", value: "electronics"},
        {title: "Girl's", value: "girls"},
        {title: "Health", value: "health"},
        {title: "Kitchen", value: "kitchen"},
        {title: "Industrial", value: "industrial"},
        {title: "Men's", value: "mens"},
        {title: "Pets", value: "pets"},
        {title: "Sports", value: "sports"},
        {title: "Games", value: "games"},
        {title: "Travel", value: "travel"},
        {title: "Women's", value: "womens"},
    ]

    allowedCategories = [
        "all",
        "arts",
        "automotive",
        "baby",
        "beauty",
        "books",
        "boys",
        "computers",
        "electronics",
        "girls",
        "health",
        "kitchen",
        "industrial",
        "mens",
        "pets",
        "sports",
        "games",
        "travel",
        "womens",
    ]

}


function createConst (): Const {
    return new Const()
}


declare module '@vue/runtime-core' {

    interface ComponentCustomProperties {
        $const: Const
    }
}

export { createConst, Const }
