<template>
    <canvas class="layer" id="circleCanvas" :style="{zIndex:zIndex}"></canvas>
</template>

<script>
	export default {
		name: "draw",
        data:{
            width:0,
            height: 0,
            markerCanvas:{},
            ctx:{},
            clickPointX:0,
            clickPointY:0,
            zIndex:100
        },
        mounted(){

        },
        methods:{

        }
	}
</script>

<style scoped>

</style>
