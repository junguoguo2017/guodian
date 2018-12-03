<template>
    <canvas class="layer" id="drawCanvas" :style="{zIndex:zIndex}"></canvas>
</template>

<script>
    import drawMap from '@/js/draw'
	export default {
		name: "draw",
        props:{
		    opts:{
		        type:Object,
                default:function () {
                    return {}
                }
            },
            zIndex:{
		        type:Number,
                default:199
            }
        },
        data(){
           return {
               width:0,
               height: 0,
           }
        },
        mounted(){
           let self = this;
           var drawCanvas = document.getElementById('drawCanvas')
		    setTimeout(()=>{
                self.height = self.$parent.height;
                self.width = self.$parent.width;
                drawCanvas.width = self.width;
                drawCanvas.height = self.height;
                drawCanvas.style.width = self.width+'px';
                drawCanvas.style.height = self.height+'px';
                drawMap.mapInit('drawCanvas',self.opts)
            },300)

        },
        methods:{

        }
	}
</script>

<style scoped>

</style>
