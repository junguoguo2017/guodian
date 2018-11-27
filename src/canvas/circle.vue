<template>
    <div >
        <div style="border: 1px solid #4a4a4a;width:800px">
            <canvas id="canvas" width="800" height="500"></canvas>
        </div>

    </div>
</template>

<script>
    export default {
        name: "circle",
        data(){
            return{
                testPath:[],
                center:{
                    x:0,
                    y:0
                },
                radius:0

            }
        },
        mounted(){
            this.init()
        },
        methods:{
            init(){
                function windowToCanvas(canvas, x, y){
                    let rect = canvas.getBoundingClientRect();
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
                        self.center = ele

                        theCanvas.onmousemove = (e) => {
                            if (isAllowDrawLine) {

                                context.clearRect(0,0,theCanvas.width,theCanvas.height);
                                let ele = windowToCanvas(theCanvas, e.clientX, e.clientY)
                                let { x, y } = ele;
                                var dx = Math.abs(self.center.x - x);
                                var dy = Math.abs(self.center.y - y);
                                var dis = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
                                context.beginPath()
                                context.fillStyle = '#000'
                                context.arc(self.center.x,  self.center.y, 4, 0, 2 * Math.PI);
                                context.fill()
                                context.closePath()

                                context.beginPath()
                                context.fillStyle='rgba(234,75,56,.5)'
                                context.strokeStyle = '#000'
                                context.arc(self.center.x,  self.center.y, dis, 0, 2 * Math.PI);
                                context.fill()
                                context.stroke()
                                context.closePath()
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
