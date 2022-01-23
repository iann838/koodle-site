<template>
    <div class="d-inline-block pos-absolute rounded-2">
        <button
            class="select d-flex align-items-center btn"
            :style="{width: width}"
            @click="toggle"
        >
            <div class="mx-auto font-size-modify">
                {{selectedTitle}}
            </div>
            <div class="dropdown-toggle ms-auto"></div>
        </button>
        <transition name="y-open">
            <ul :class="['select-dropdown', dropdownClass]"
                v-if="dropdownToggle"
                :style="{width: width, zIndex}"
            >
                <li v-for="o in options"
                    :key="o.title"
                    @click="value = o.value; toggle()"
                >
                    {{o.title}}
                </li>
            </ul>
        </transition>
    </div>
</template>

<style lang="scss" scoped>
@import "@/scss/transitions.scss";

@include y-open("y-open", 100px);

.pos-relative {
    position: relative;
}

.select {
    font-size: 1rem;
}

.select-dropdown {
    position: absolute;
    list-style: none;
    list-style-type: none;
    padding: 10px 0;
    border-top: none;
    overflow: hidden;
    max-height: 250px;
    overflow-y: auto;
    overflow-x: auto;
    border-radius: 5px;

    & > li:hover {
        cursor: pointer;
    }
}

</style>

<script lang="ts">
import { Emit, Model, Prop, Watch } from 'vue-property-decorator'
import { Vue } from 'vue-class-component'

interface Option {
    title: string
    value: any
}

export default class Select extends Vue {

    selectedTitle: string | null = ""
    dropdownToggle = false

    @Prop({default: ''}) readonly name!: string
    @Prop({default: '100px'}) readonly width!: string | number
    @Prop({default: []}) readonly options!: Array<Option>
    @Prop({default: 1}) readonly zIndex!: string | number
    @Prop({default: ''}) readonly dropdownClass!: string

    @Model('modelValue', {default: null})
    readonly value!: any

    @Emit("change")
    valueChangedEmit(): number {
        return this.value
    }

    @Watch("value")
    valueChanged(): void {
        for (const o of this.options)
            if (o.value == this.value)
                this.selectedTitle = o.title
        this.$emit("change")
    }

    created (): void {
        for (const o of this.options)
            if (o.value == this.value)
                this.selectedTitle = o.title
    }

    toggle (): void {
        this.dropdownToggle = !this.dropdownToggle
    }

}
</script>
