<template>
    <div >
        <p><button @click="run(testPath)">轨迹回放</button></p>
        <div style="position: relative;">
            <canvas style="position: absolute;left: 0;top: 0;" id='line' width="600" height="200"></canvas>
            <canvas style="position: absolute;left: 0;top: 0;" id='marker' width="600" height="200"></canvas>
        </div>

    </div>
</template>

<script>
    export default {
        name: "track",
        data(){
            return{
                testPath:[],
                index:0
            }
        },
        mounted(){
            for(var i=0;i<200;i++){
                var x = i;
                var y = i;
                this.testPath.push({
                    x:x,
                    y:y
                })
            };
        },
        methods:{
            run(Path){
                /*轨迹回放*/
                let self = this;
                var lineIndex = 0,pointIndex = 0,line2;
                var obj = document.getElementById('line');
                var cxt = obj.getContext('2d');
                cxt.lineWidth = 1;
                cxt.strokeStyle = 'red';
                cxt.lineCap = 'round';
                cxt.clearRect(0,0,600,200);
                function drawBegin(){
                    cxt.beginPath();
                    pointIndex=0;
                    var intervalHandle = window.setInterval(function () {
                        line2 = Path[pointIndex];
                        if (!line2) {
                            window.clearInterval(intervalHandle);
                            if (lineIndex < Path.length - 1) {
                                lineIndex = lineIndex + 1;
                                drawBegin();
                            }
                        }else{
                            if (pointIndex == 0) {
                                cxt.moveTo(line2.x, line2.y);
                            }
                            pointIndex = pointIndex + 1;
                            cxt.lineTo(line2.x, line2.y);
                            cxt.stroke();
                        }
                    },100);
                }
                drawBegin();
                setInterval(()=>{
                    self.runMarker(Path)
                },100)

            },
            runMarker(Path){
                let self = this;
                let oCanvas = document.getElementById("marker");
                let content = oCanvas.getContext("2d");

                var line = Path
                if(!line[self.index])return;

                content.clearRect(0, 0, 400, 400);
                content.beginPath();
                content.moveTo(line[self.index].x, line[self.index].y);
                content.arc(line[self.index].x, line[self.index].y, 5, 0, 2 * Math.PI, false);
                content.fillStyle = "black";
                content.fill();

                content.font = 'bold 12px Arial';
                content.textAlign = 'left';
                content.textBaseline = 'bottom';
                content.fillStyle = '#333';
                content.fillText("x:"+parseInt(line[self.index].x), line[self.index].x, line[self.index].y-24);
                content.fillText("y:"+parseInt(line[self.index].y), line[self.index].x, line[self.index].y-12);
                content.closePath()
                self.index=self.index+1

                /*i2 += 0.1;
                x2 = i2 * 20;
                y2 = Math.sin(i2) * 50 + 200;*/
                ;
            },
        }
    }
</script>

<style scoped>

</style>
