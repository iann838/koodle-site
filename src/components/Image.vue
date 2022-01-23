<template>
    <img v-if="!to"
        :src="src"
        :alt="alt"
        :style="{
            maxWidth: Iwidth,
            minWidth: Iwidth,
            maxHeight: Iheight,
            minHeight: Iheight,
            cursor: cursor
        }"
        :class="rounded ? 'rounded': ''"
    />
    <router-link :to="to" v-else>
        <img
            :src="src"
            :alt="alt"
            :style="{
                maxWidth: Iwidth,
                minWidth: Iwidth,
                maxHeight: Iheight,
                minHeight: Iheight,
                cursor: cursor
            }"
            :class="rounded ? 'rounded': ''"
        />
    </router-link>
</template>

<style lang="scss" scoped>
.rounded {
    border-radius: 50%;
    overflow: hidden;
}
</style>

<script lang="ts">
import { Vue } from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

export default class Image extends Vue {

    Iwidth: number | string = 0;
    Iheight: number | string = 0;
    Isize: number | string = 0;

    @Prop({default: "100%"}) readonly size!: number
    @Prop({default: null}) readonly width!: number
    @Prop({default: null}) readonly height!: number
    @Prop({default: false}) readonly rounded!: number
    @Prop({default: ""}) readonly alt!: string
    @Prop({default: ""}) readonly src!: string
    @Prop({default: null}) readonly to!: string

    created(): void {
        this.parseDimensions()
    }

    @Watch('size')
    @Watch('width')
    @Watch('height')
    dimensionsChanged (): void {
        this.parseDimensions()
    }

    parseDimensions (): void {
        if (!isNaN(this.size))
            this.Isize = this.asDimension(this.size)
        this.Iwidth = this.width || this.size
        this.Iheight = this.height || this.size
        if (!isNaN(this.Iwidth))
            this.Iwidth = this.asDimension(this.Iwidth)
        if (!isNaN(this.Iheight))
            this.Iheight = this.asDimension(this.Iheight)
    }
    
    asDimension (val: number, metric = 'px'): string {
        if (!isNaN(val))
            return val.toString() + metric
        return val.toString()
    }

    get cursor(): string {
        return (this.to ? "pointer": "default")
    }

}
</script>
