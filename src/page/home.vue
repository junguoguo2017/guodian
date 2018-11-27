<template>
    <div >
        <div style="position: relative;">
            <canvas id="canvas" width="800" height="500"></canvas>
        </div>

    </div>
</template>

<script>
    export default {
        name: "gl",
        data(){
            return{
                testPath:[],
            }
        },
        mounted(){
            for(var i=0;i<50;i++){
                this.testPath.push({
                    x:Math.random()*800,
                    y:Math.random()*500
                })
            }
            this.init(this.testPath)
        },
        methods:{
            init(Path) {
                var canvas = document.getElementById('canvas')
                var ctx = canvas.getContext('2d');

                ctx.fillStyle = 'red'
                Path.forEach((item)=>{
                    ctx.beginPath();
                    ctx.arc(item.x,item.y,4,0,Math.PI*2)
                    ctx.fill()
                    ctx.closePath();
                });

            }
        }
    }
</script>

<style scoped>

</style>
