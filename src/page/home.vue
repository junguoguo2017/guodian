<template>
    <div >
        <!--<mapLayer>
            <Gmarker :coords="coords" @markerClick="markerClick"></Gmarker>
            <circleFence :areas="areas"></circleFence>
        </mapLayer>-->
    </div>
</template>

<script>
    import mapLayer from '../canvas/maplayer'
    import Gmarker from '../canvas/marker'
    import circleFence from '../canvas/circleFence'
    export default {
        name: "gl",
        components:{
            mapLayer,Gmarker,circleFence
        },
        data(){
            return{
                testPath:[],
                coords:[],
                areas:[]
            }
        },
        mounted(){
            var self = this;
           /* setInterval(()=>{
                self.coords = []
                for(var i=0;i<50;i++){
                    self.coords.push({
                        x:Math.random()*800,
                        y:Math.random()*500,
                        label:'点'+i
                    })
                }
            },2000)
            for(var i=0;i<50;i++){
                self.coords.push({
                    x:Math.random()*800,
                    y:Math.random()*500,
                    label:'点'+i,
                    color:'rgba('+Math.random()*255+','+Math.random()*255+','+Math.random()*255+')'
                })
            }
            for(var i=0;i<5;i++){
                self.areas.push({
                    center:[Math.random()*800,Math.random()*500],
                    radius:40,
                    fillcolor:'rgba('+Math.random()*255+','+Math.random()*255+','+Math.random()*255+')',
                    strokecolor:'rgba('+Math.random()*255+','+Math.random()*255+','+Math.random()*255+')',
                    label:'圆'+i,
                })
            }*/
        },
        methods:{
            markerClick(val){
                console.log(val)
            }
        }
    }
</script>

<style scoped>

</style>
