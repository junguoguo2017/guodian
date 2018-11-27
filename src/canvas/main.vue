<template>
    <div>
        <p><button @click="run(testPath)">轨迹回放</button></p>
        <canvas id='test' width="600" height="200"></canvas>
    </div>
</template>

<script>
    var i2 = 0;
    var x2 = 1;
    var y2 = 200;
    var index = 0
    export default {
        name: "home",
        data(){
            return {
                testPath:[]
            }
        },
        mounted(){
            let self = this;
            this.testPath = [{
                "path": [
                    {
                        "x": 82,
                        "y": 43
                    },
                    {
                        "x": 83,
                        "y": 43
                    },
                    {
                        "x": 84,
                        "y": 45
                    },
                    {
                        "x": 86,
                        "y": 47
                    },
                    {
                        "x": 86,
                        "y": 49
                    },
                    {
                        "x": 86,
                        "y": 54
                    },
                    {
                        "x": 86,
                        "y": 59
                    },
                    {
                        "x": 86,
                        "y": 64
                    },
                    {
                        "x": 86,
                        "y": 69
                    },
                    {
                        "x": 86,
                        "y": 74
                    },
                    {
                        "x": 86,
                        "y": 78
                    },
                    {
                        "x": 86,
                        "y": 83
                    },
                    {
                        "x": 86,
                        "y": 87
                    },
                    {
                        "x": 86,
                        "y": 89
                    },
                    {
                        "x": 86,
                        "y": 91
                    },
                    {
                        "x": 86,
                        "y": 92
                    },
                    {
                        "x": 86,
                        "y": 93
                    },
                    {
                        "x": 86,
                        "y": 94
                    },
                    {
                        "x": 86,
                        "y": 95
                    },
                    {
                        "x": 100,
                        "y": 95
                    },
                    {
                        "x": 100,
                        "y": 104
                    }
                ]
            },{
                "path": [
                    {
                        "x": 129,
                        "y": 36
                    },
                    {
                        "x": 129,
                        "y": 39
                    },
                    {
                        "x": 129,
                        "y": 44
                    },
                    {
                        "x": 129,
                        "y": 49
                    },
                    {
                        "x": 129,
                        "y": 54
                    },
                    {
                        "x": 129,
                        "y": 59
                    },
                    {
                        "x": 128,
                        "y": 65
                    },
                    {
                        "x": 127,
                        "y": 73
                    },
                    {
                        "x": 125,
                        "y": 78
                    },
                    {
                        "x": 125,
                        "y": 81
                    },
                    {
                        "x": 124,
                        "y": 88
                    },
                    {
                        "x": 123,
                        "y": 91
                    },
                    {
                        "x": 123,
                        "y": 94
                    },
                    {
                        "x": 123,
                        "y": 96
                    },
                    {
                        "x": 123,
                        "y": 97
                    },
                    {
                        "x": 123,
                        "y": 98
                    },
                    {
                        "x": 123,
                        "y": 99
                    },
                    {
                        "x": 122,
                        "y": 100
                    }
                ]
            }];
            setInterval(()=>{
                self.runMarker(self.testPath[0])
            },300)
            this.huizhiPath(this.testPath)
            /*this.animation()*/
        },
        methods: {
            run(Path){
                /*轨迹回放*/
                let self = this;
                var lineIndex = 0,pointIndex = 0,line2;
                var obj = document.getElementById('test');
                var cxt = obj.getContext('2d');
                cxt.lineWidth = 1;
                cxt.strokeStyle = 'red';
                cxt.lineCap = 'round';
                cxt.clearRect(0,0,600,200);
                function drawBegin(){
                    cxt.beginPath();
                    pointIndex=0;
                    var intervalHandle = window.setInterval(function () {
                        line2 = Path[lineIndex].path[pointIndex];
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
                    },300);
                }
                drawBegin();
            },
            runMarker(Path){
                let oCanvas = document.getElementById("test");
                let content = oCanvas.getContext("2d");

                var line = Path.path
                if(!line[index])return;

                content.clearRect(0, 0, 400, 400);
                content.beginPath();
                content.moveTo(line[index].x, line[index].y);
                content.arc(line[index].x, line[index].y, 5, 0, 2 * Math.PI, false);
                content.fillStyle = "black";
                content.fill();

                content.font = 'bold 12px Arial';
                content.textAlign = 'left';
                content.textBaseline = 'bottom';
                content.fillStyle = '#333';
                content.fillText("x:"+parseInt(line[index].x), line[index].x, line[index].y-24);
                content.fillText("y:"+parseInt(line[index].y), line[index].x, line[index].y-12);
                content.closePath()
                index=index+1

                /*i2 += 0.1;
                x2 = i2 * 20;
                y2 = Math.sin(i2) * 50 + 200;*/
                ;
            },
            huizhiPath(Path){
                var obj = document.getElementById('test');
                var cxt = obj.getContext('2d');
                cxt.lineWidth = 3;
                cxt.strokeStyle = 'red';
                cxt.lineCap = 'round';
                cxt.clearRect(0,0,600,200);
                function drawBegin(){
                    Path.forEach((item)=>{
                        cxt.beginPath();
                        item.path.forEach((line)=>{
                            cxt.lineTo(line.x, line.y);
                            cxt.stroke();
                        })
                        cxt.closePath();
                    })
                }
                drawBegin();
            },
            animation(){
                let self = this;
                var fps = 30;
                var now;
                var pause = false;
                var then = Date.now();
                var interval = 1000/fps;
                var delta;
                window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
                if(pause) return;
                if(window.requestAnimationFrame){
                    requestAnimationFrame(self.animation);
                    now = Date.now();
                    delta = now - then;
                    if (delta > interval) {
                        // 这里不能简单then=now，否则还会出现上边简单做法的细微时间差问题。例如fps=10，每帧100ms，而现在每16ms（60fps）执行一次draw。16*7=112>100，需要7次才实际绘制一次。这个情况下，实际10帧需要112*10=1120ms>1000ms才绘制完成。
                        then = now - (delta % interval);
                        //draw(); // ... Code for Drawing the Frame ...
                    }
                }else{
                    setTimeout(self.animation, interval);
                    //draw();
                }
            }
        }
    }
</script>

<style scoped>

</style>
