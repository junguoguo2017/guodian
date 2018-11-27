<template>
    <div >
        <div style="position: relative;">
            <canvas id="canvas" width="800" height="500"></canvas>
        </div>

    </div>
</template>

<script>
    export default {
        name: "mouseLine",
        data(){
            return{
                testPath:[],
                index:0
            }
        },
        mounted(){
            this.init()
        },
        methods:{
            init(){
                function windowToCanvas(canvas, x, y){
                    let rect = canvas.getBoundingClientRect();
                    console.log(rect)
                    return {
                        x: x - rect.left * (canvas.width/rect.width),
                        y: y - rect.top * (canvas.height/rect.height)
                    }
                }
                let theCanvas = document.querySelector('#canvas')
                if (!theCanvas || !theCanvas.getContext) {
                    return false
                } else {
                    let context = theCanvas.getContext('2d')
                    let isAllowDrawLine = false
                    theCanvas.onmousedown = function(e) {
                        isAllowDrawLine = true
                        let ele = windowToCanvas(theCanvas, e.clientX, e.clientY)
                        let { x, y } = ele

                        context.moveTo(x, y)
                        theCanvas.onmousemove = (e) => {
                            if (isAllowDrawLine) {
                                let ele = windowToCanvas(theCanvas, e.clientX, e.clientY)
                                let { x, y } = ele
                                context.lineTo(x, y)
                                context.stroke()
                            }
                        }
                    }
                    theCanvas.onmouseup = function() {
                        isAllowDrawLine = false
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
