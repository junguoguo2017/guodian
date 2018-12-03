
function WindowToCanvas(t, n, e) {
    var o = t.getBoundingClientRect();
    return {
        x: n - o.left * (t.width / o.width),
        y: e - o.top * (t.height / o.height)
    }
};
function DrawGrid(t, n, e, o) {
    t.save(),
        t.lineWidth = .5,
        t.strokeStyle = n;
    for (var r = e + .5; r < t.canvas.width; r += e)

        t.beginPath(),
            t.moveTo(r, 0),
            t.lineTo(r, t.canvas.height),

            t.stroke();
    for (var r = o + .5; r < t.canvas.height; r += o)
        t.beginPath(),
            t.moveTo(0, r),
            t.lineTo(t.canvas.width, r),
            t.stroke();
    t.restore()
};
var currPos={x:0,y:0},
    mouseStart={x:0,y:0},
    mouseEnd={x:0,y:0},
    drawing=false,
    activeShape=null,
    imgData=null,
    index=-1,
    env={},
    shapes=[];



// function saveImageData(){
// 	imgData=ctx.getImageData(0,0,W,H);
// }
// //将当前canvas数据写回ctx
// function restoreImageData(){
// 	ctx.putImageData(imgData,0,0);
// }



/*function resetDrawType(){
    var elems=document.getElementsByName('type');
    for(var i=0,len=elems.length;i<len;i++){
        elems[i].checked=false;
    }
    drawing=false;
}*/

//初始化图形需要用到的属性，位置，顶点列表，边的宽度，描边颜色，填充颜色，是否填充；
class Graph{
    constructor(pos){
        this.x=pos.x;
        this.y=pos.y;
        this.points=[];
        this.sides=5;
        this.stars=5;
        this.lineWidth=1;
        this.strokeStyle='#f00';
        this.fillStyle='#f00';
        this.isFill=false;
    }
    initUpdate(start,end){
        this.points[1]=end;
        this.x=(start.x+end.x)/2;
        this.y=(start.y+end.y)/2;
    }
    update(i,pos){
        console.log(i)
        if(i==9999){
            var that=this,
                x1=pos.x-this.x,
                y1=pos.y-this.y;
            this.points.forEach((p,i)=>{
                that.points[i]={x:p.x+x1, y:p.y+y1 };
            });
            this.x=Math.round(pos.x);
            this.y=Math.round(pos.y);
        } else {
            this.points[i]=pos;
            var x=0,y=0;
            this.points.forEach(p=>{
                x+=p.x;
                y+=p.y;
            });
            this.x=Math.round(x/this.points.length);
            this.y=Math.round(y/this.points.length);
        }
    }
    createPath(ctx){
        ctx.beginPath();
        this.points.forEach((p,i)=>{
            ctx[i==0?'moveTo':'lineTo'](p.x,p.y);
        });
        ctx.closePath();
    }
    isInPath(ctx,pos){
        for(var i=0,point,len=this.points.length;i<len;i++){
            point=this.points[i];
            ctx.beginPath();
            ctx.arc(point.x,point.y,5,0,Math.PI*2,false);
            if(ctx.isPointInPath(pos.x,pos.y)){
                return i;
            }
        }
        this.createPath(ctx);
        if(ctx.isPointInPath(pos.x,pos.y)){
            return 9999;
        }
        return -1
    }
    drawController(ctx){
        this.drawPoints(ctx);
        this.drawCenter(ctx);
    }
    drawPoints(ctx){
        ctx.save();
        ctx.lineWidth=2;
        ctx.strokeStyle='#999';
        this.points.forEach(p=>{
            ctx.beginPath();
            ctx.arc(p.x,p.y,5,0,Math.PI*2,false);
            ctx.stroke();
        });
        ctx.restore();
    }
    drawCenter(ctx){
        ctx.save();
        ctx.lineWidth=1;
        ctx.strokeStyle='hsla(60,100%,45%,1)';
        ctx.fillStyle='hsla(60,100%,50%,1)';
        ctx.beginPath();
        ctx.arc(this.x,this.y,5,0,Math.PI*2,false);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }
    draw(ctx){
        ctx.save();
        ctx.lineWidth=this.lineWidth;
        ctx.strokeStyle=this.strokeStyle;
        ctx.fillStyle=this.fillStyle;
        this.createPath(ctx);
        ctx.stroke();
        if(this.isFill){ ctx.fill(); }
        ctx.restore();
    }

}
/**
 *实线
  * */
class Line extends Graph{
    constructor(pos){
        super(pos);
        this.points=[pos,pos];
        this.name='直线'
    }
    createPath(ctx){
        ctx.beginPath();
        ctx.arc(this.x,this.y,5,0,Math.PI*2,false);
    }
    draw(ctx){
        ctx.save();
        ctx.lineWidth=this.lineWidth;
        ctx.strokeStyle=this.strokeStyle;
        ctx.beginPath();
        this.points.forEach((p,i)=>{
            if(i==0){
                ctx.moveTo(p.x,p.y);
            } else {
                ctx.lineTo(p.x,p.y);
            }
        });
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

}
/**
* 虚线
 * */
class Dash extends Line{
    constructor(pos){
        super(pos);
        this.name='虚线'
    }
    draw(ctx){
        ctx.save();
        ctx.lineWidth=this.lineWidth;
        ctx.strokeStyle=this.strokeStyle;

        var dashLen=dashLen||5,
            points=this.points;

        ctx.beginPath();
        points.forEach((point,i)=>{

            if(i==0){
                ctx.moveTo(point.x,point.y);
            } else {
                var deltaX=point.x-points[i-1].x,
                    deltaY=point.y-points[i-1].y,
                    dashNums=Math.floor(Math.sqrt(deltaX*deltaX+deltaY*deltaY)/dashLen);
                for(var j=1;j<dashNums;j++){
                    ctx[j%2==0?'moveTo':'lineTo'](Math.floor(points[i-1].x+(deltaX/dashNums)*j),Math.floor(points[i-1].y+(deltaY/dashNums)*j));
                }
                ctx.stroke();
            }
        });
        ctx.restore();
    }

}
/**
* 二次贝塞尔曲线
* */
/*class Bezier extends Line {
    constructor(pos){
        super(pos);
        this.points=[pos,pos,pos,pos];
        this.name='三次贝塞尔曲线'
    }
    initUpdate(start,end){
        var a=Math.round(Math.sqrt(Math.pow(end.x-start.x,2)+Math.pow(end.y-start.y,2)))/2,
            x1=start.x+(end.x-start.x)/2,
            y1=start.y-a,
            y2=end.y+a;

        this.points[1]={x:end.x,y:end.y};
        this.points[2]={x:x1,y:y1<0?0:y1};
        this.points[3]={x:start.x,y:end.y};
        this.points[3]={x:x1,y:y2>H?H:y2};
        this.x=(start.x+end.x)/2;
        this.y=(start.y+end.y)/2;
    }
    drawPoints(ctx){
        ctx.lineWidth=0.5;
        ctx.strokeStyle='#00f';

        //画控制点的连线
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        ctx.lineTo(this.points[2].x, this.points[2].y);
        ctx.moveTo(this.points[1].x, this.points[1].y);
        ctx.lineTo(this.points[3].x, this.points[3].y);
        ctx.stroke();

        //画连接点和控制点
        this.points.forEach(function(point,i){
            ctx.beginPath();
            ctx.arc(point.x,point.y,5,0,Math.PI*2,false);
            ctx.stroke();
        });
    }
    draw(){
        ctx.save();
        ctx.lineWidth=this.lineWidth;
        ctx.strokeStyle=this.strokeStyle;
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        ctx.bezierCurveTo(this.points[2].x,this.points[2].y,this.points[3].x,this.points[3].y,this.points[1].x,this.points[1].y);
        ctx.stroke();
        ctx.restore();
    }

}*/
/**
 * 三次贝塞尔曲线
 * */
/*class Quadratic extends Line{
    constructor(pos){
        super(pos);
        this.points=[pos,pos,pos];
        this.name='二次贝塞尔曲线'
    }
    initUpdate(start,end){
        var a=Math.round(Math.sqrt(Math.pow(end.x-start.x,2)+Math.pow(end.y-start.y,2)))/2,
            x1=start.x+(end.x-start.x)/2,
            y1=start.y-a*1.5;
        this.points[1]={x:end.x,y:end.y};
        this.points[2]={x:x1,y:y1<0?0:y1};
        this.x=(this.points[0].x+this.points[1].x+this.points[2].x)/3;
        this.y=(this.points[0].y+this.points[1].y+this.points[2].y)/3;
    }
    drawPoints(ctx){
        ctx.lineWidth=0.5;
        ctx.strokeStyle='#00f';

        //画控制点的连线
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        ctx.lineTo(this.points[2].x, this.points[2].y);
        ctx.lineTo(this.points[1].x, this.points[1].y);
        ctx.stroke();

        //画连接点和控制点
        this.points.forEach(function(point,i){
            ctx.beginPath();
            ctx.arc(point.x,point.y,5,0,Math.PI*2,false);
            ctx.stroke();
        });
        ctx.restore();
    }
    draw(ctx){
        ctx.save();
        ctx.lineWidth=this.lineWidth;
        ctx.strokeStyle=this.strokeStyle;
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        ctx.quadraticCurveTo(this.points[2].x,this.points[2].y,this.points[1].x,this.points[1].y);
        ctx.stroke();
        ctx.restore();
    }


}*/
/**
 * 多边形
 */
class Polygon extends Graph{
    constructor(pos){
        super(pos);
        this.cPoints=[];
    }
    get name(){
        return this.sides+'边形';
    }
    createPoints(start,end){
        var x1 = end.x - start.x,
            y1 = end.y - start.y,
            angle=0;
        this.points=[];
        for(var i=0;i<this.sides;i++){
            angle=2*Math.PI/this.sides*i;
            var sin=Math.sin(angle),
                cos=Math.cos(angle),
                newX = x1*cos - y1*sin,
                newY = y1*cos + x1*sin;
            this.points.push({
                x:Math.round(start.x + newX),
                y:Math.round(start.y + newY)
            });
        }
    }
    createControlPoint(start,end,len){
        var x1 = end.x - start.x,
            y1 = end.y - start.y,
            angle=Math.atan2(y1,x1),
            c=Math.round(Math.sqrt(x1*x1+y1*y1)),
            l=c+(!len?0:c/len),
            x2 =l * Math.cos(angle) + start.x,
            y2 =l * Math.sin(angle) + start.y;
        return {x:x2,y:y2};
    }
    initUpdate(start,end){
        this.createPoints(start,end);
        this.cPoints[0]=this.createControlPoint(start,end,3);
    }
    update(i,pos){
        if(i==10000){
            var point=this.createControlPoint({x:this.x,y:this.y},pos,-4);
            this.cPoints[0]=pos;
            this.createPoints({x:this.x,y:this.y},point);
        } else if(i==9999){
            var that=this,
                x1=pos.x-this.x,
                y1=pos.y-this.y;
            this.points.forEach((p,i)=>{
                that.points[i]={x:p.x+x1, y:p.y+y1 };
            });
            this.cPoints.forEach((p,i)=>{
                that.cPoints[i]={x:p.x+x1,y:p.y+y1};
            });
            this.x=Math.round(pos.x);
            this.y=Math.round(pos.y);
        } else {
            this.points[i]=pos;
            var x=0,y=0;
            this.points.forEach(p=>{
                x+=p.x;
                y+=p.y;
            });
            this.x=Math.round(x/this.points.length);
            this.y=Math.round(y/this.points.length);
        }
    }
    createCPath(ctx){
        this.cPoints.forEach(p=>{
            ctx.beginPath();
            ctx.arc(p.x,p.y,6,0,Math.PI*2,false);
        });
    }
    isInPath(ctx,pos){
        var index=super.isInPath(ctx,pos);
        if(index>-1) return index;
        this.createCPath(ctx);
        for(var i=0,len=this.cPoints.length;i<len;i++){
            var p=this.cPoints[i];
            ctx.beginPath();
            ctx.arc(p.x,p.y,6,0,Math.PI*2,false);
            if(ctx.isPointInPath(pos.x,pos.y)){
                return 10000+i;break;
            }
        }
        return -1
    }
    drawCPoints(ctx){
        ctx.save();
        ctx.lineWidth=1;
        ctx.strokeStyle='hsla(0,0%,50%,1)';
        ctx.fillStyle='hsla(0,100%,60%,1)';
        this.cPoints.forEach(p=>{
            ctx.beginPath();
            ctx.moveTo(this.x,this.y);
            ctx.lineTo(p.x,p.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(p.x,p.y,6,0,Math.PI*2,false);
            ctx.stroke();
            ctx.fill();
        });
        ctx.restore();
    }
    drawController(ctx){
        this.drawPoints(ctx);
        this.drawCPoints(ctx);
        this.drawCenter(ctx);
    }
}
/**
 * 五角星
 * */
/*class Star extends Polygon{
    constructor(pos){
        super(pos);
        this.cPoints=[];
        this.size=0.5;
    }
    //使用属性自动更新状态
    get name() {
        return this.stars+'角星'
    }
    createPoints(start,end){
        var x1 = end.x - start.x,
            y1 = end.y - start.y,
            x2 =x1*this.size,
            y2 =y1*this.size,
            angle=0,
            angle2=0;
        this.points=[];
        for(var i=0;i<this.stars;i++){
            angle=2*Math.PI/this.stars*i;
            angle2=angle+Math.PI/this.stars;
            var sin=Math.sin(angle),
                cos=Math.cos(angle),
                newX = x1*cos - y1*sin,
                newY = y1*cos + x1*sin,
                sin2=Math.sin(angle2),
                cos2=Math.cos(angle2),
                newX2 = x2*cos2 - y2*sin2,
                newY2 = y2*cos2 + x2*sin2;

            this.points.push({
                x:Math.round(start.x + newX),
                y:Math.round(start.y + newY)
            });
            this.points.push({
                x:Math.round(start.x + newX2),
                y:Math.round(start.y + newY2)
            });
        }
    }
    initUpdate(start,end){
        this.createPoints(start,end);
        this.cPoints[0]=this.createControlPoint(start,end,3);
        this.cPoints[1]=this.createControlPoint(start,this.points[1],3);
    }
    update(i,pos){
        if(i==10000){
            var ang=Math.PI/this.stars,
                angle=Math.atan2(pos.y-this.y,pos.x-this.x),
                sin=Math.sin(ang+angle),
                cos=Math.cos(ang+angle),
                a=Math.sqrt(Math.pow(pos.x-this.x,2)+Math.pow(pos.y-this.y,2));

            this.cPoints[1]={
                x:(a*this.size+10)*cos+this.x,
                y:(a*this.size+10)*sin+this.y
            };
            var point=this.createControlPoint({x:this.x,y:this.y},pos,-4);//第一个顶点坐标
            this.cPoints[0]=pos;//第一个选择控制点坐标
            this.createPoints({x:this.x,y:this.y},point);//更新所有顶点
        } else if(i==10001){
            var x1 = this.points[1].x - this.x,
                y1 = this.points[1].y - this.y,
                angle=Math.atan2(y1,x1),
                a=Math.sqrt(Math.pow(pos.x-this.x,2)+Math.pow(pos.y-this.y,2)),
                b=Math.sqrt(Math.pow(this.points[0].x-this.x,2)+Math.pow(this.points[0].y-this.y,2));

            var x=a*Math.cos(angle),
                y=a*Math.sin(angle);
            this.size=(a-20)/b;
            this.cPoints[1]={x:this.x+x, y:this.y+y };
            this.createPoints({x:this.x,y:this.y},this.points[0]);//更新所有顶点
        } else {
            super.update(i,pos);
        }
    }

}*/

/**
 * 三角形
 */
/*class Triangle extends Graph{
    constructor(pos){
        super(pos);
        this.points=[pos,pos,pos];
        this.name='三角形';
    }
    initUpdate(start,end){
        var x1=Math.round(start.x),
            y1=Math.round(start.y),
            x2=Math.round(end.x),
            y2=Math.round(end.y);

        this.points[0]={x:x1,y:y1};
        this.points[1]={x:x1,y:y2};
        this.points[2]={x:x2,y:y2};
        this.x=Math.round((x1*2+x2)/3);
        this.y=Math.round((y2*2+y1)/3);
    }
}*/
/**
 * 矩形
 */
class Rect extends Graph{
    constructor(pos){
        super(pos);
        this.points=[pos,pos,pos,pos];
        this.name='矩形';
    }
    initUpdate(start,end){
        var x1=Math.round(start.x),
            y1=Math.round(start.y),
            x2=Math.round(end.x),
            y2=Math.round(end.y);
        this.points[0]={x:x1,y:y1};
        this.points[1]={x:x2,y:y1};
        this.points[2]={x:x2,y:y2};
        this.points[3]={x:x1,y:y2};
        this.x=Math.round((x1+x2)/2);
        this.y=Math.round((y1+y2)/2);
    }
}
/**
 * 圆形
 */
class Round extends Graph{
    constructor(pos){
        super(pos);
        this.points=[];
        this.radius=10;
        this.name='圆形';
    }
    update(i,pos){
        if(i==9999){
            /*	if(!this.points[0]){return;}*/
            var x1=pos.x-this.x,
                y1=pos.y-this.y;
            this.points[0].x+=x1;
            this.points[0].y+=y1;
            this.x=pos.x;
            this.y=pos.y;
        } else {
            this.points[0]=pos;
            this.radius=Math.round(Math.sqrt(Math.pow(pos.x-this.x,2)+Math.pow(pos.y-this.y,2)));
        }
    }
    initUpdate(start,end){
        this.points[0]=end;
        this.radius=Math.round(Math.sqrt(Math.pow(end.x-start.x,2)+Math.pow(end.y-start.y,2)));
    }
    createPath(ctx){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
    }

}
/**
 * 椭圆
 */
/*class Ellipse extends Graph{
    constructor(pos){
        super(pos);
        this.angle=0;
        this.a=0;
        this.b=0;
        this.name='椭圆形';
    }
    rotateA(){
        var x1=this.a*Math.cos(Math.PI/2),
            y1=this.b*Math.sin(Math.PI/2),
            cos=Math.cos(this.angle),
            sin=Math.sin(this.angle),
            x2=x1*cos-y1*sin,
            y2=y1*cos-x1*sin;
        this.points[1]={x:this.x-x2,y:this.y-y2};
    }
    rotateB(){
        var x1=this.a*Math.cos(0),
            y1=this.b*Math.sin(0),
            cos=Math.cos(this.angle),
            sin=Math.sin(this.angle),
            x2=x1*cos-y1*sin,
            y2=y1*cos-x1*sin;
        this.points[0]={x:this.x+x2,y:this.y-y2};
    }
    initUpdate(start,end){
        this.points[0]=end;
        this.a=Math.round(Math.sqrt(Math.pow(this.points[0].x-start.x,2)+Math.pow(this.points[0].y-start.y,2)));
        this.b=this.a/2;
        this.angle = Math.atan2(this.points[0].y-this.y,this.points[0].x-this.x);
        this.rotateA();
    }
    update(i,pos){
        if(i==9999){
            var that=this,
                x1=pos.x-this.x,
                y1=pos.y-this.y;
            this.points.forEach((p,i)=>{
                that.points[i]={x:p.x+x1, y:p.y+y1 };
            });
            this.x=pos.x;
            this.y=pos.y;
        } else {
            this.points[i]=pos;
            if(i==0){
                this.a=Math.round(Math.sqrt(Math.pow(this.points[0].x-this.x,2)+Math.pow(this.points[0].y-this.y,2)));
                this.angle = Math.atan2(this.points[0].y-this.y,this.points[0].x-this.x);
                this.rotateA();
            } else if(i==1){
                this.b=Math.round(Math.sqrt(Math.pow(this.points[1].x-this.x,2)+Math.pow(this.points[1].y-this.y,2)));
                this.angle = Math.PI/2+Math.atan2(this.points[1].y-this.y,this.points[1].x-this.x);
                this.rotateB();
            }
        }
    }
    createPath(ctx){
        var k = .5522848,
            x=0, y=0,
            a=this.a, b=this.b,
            ox = a * k, // 水平控制点偏移量
            oy = b * k; // 垂直控制点偏移量
        ctx.beginPath();
        //从椭圆的左端点开始顺时针绘制四条三次贝塞尔曲线
        ctx.moveTo(x - a, y);
        ctx.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
        ctx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
        ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
        ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
        ctx.closePath();
    }
    isInPath(ctx,pos){
        for(var i=0,point,len=this.points.length;i<len;i++){
            point=this.points[i];
            ctx.beginPath();
            ctx.arc(point.x,point.y,5,0,Math.PI*2,false);
            if(ctx.isPointInPath(pos.x,pos.y)){
                return i;
            }
        }
        this.createPath(ctx);
        if(ctx.isPointInPath(pos.x-this.x,pos.y-this.y)){
            return 9999;
        }
        return -1
    }

    draw(){
        ctx.save();
        ctx.lineWidth=this.lineWidth;
        ctx.strokeStyle=this.strokeStyle;
        ctx.fillStyle=this.fillStyle;
        ctx.translate(this.x,this.y);
        ctx.rotate(this.angle);
        this.createPath(ctx);
        ctx.stroke();
        if(this.isFill){
            ctx.fill();
        }
        ctx.restore();
    }

}*/
/*document.getElementsByClassName('toolbar')[0].addEventListener('click',function(e){
    if(e.target.getAttribute('type')=='radio'){
        drawing=true;
    }
},false);*/

export default {
    canvas:null,
    ctx:null,
    W:0,
    H:0,
    opts:{},
    mapshape:{},
    mapInit(canvasId,opts){
        this.canvas=document.getElementById(canvasId);
        this.ctx=this.canvas.getContext('2d');
        this.W=this.canvas.width;
        this.H=this.canvas.height;
        this.opts = opts ||{}
        this.getEnv()
        drawing=true;
        this.canvas.style.cursor='pointer';
        this.drawBG();
        var sf = this;
        /*鼠标按下绘制*/
        this.canvas.addEventListener('mousedown',function(e){
            mouseStart=WindowToCanvas(sf.canvas,e.clientX,e.clientY);
            env=sf.getEnv();

            activeShape=null;
            //新建图形
            if(drawing){
                activeShape = sf.factory(env.type,mouseStart);
                activeShape.lineWidth = env.lineWidth;
                activeShape.strokeStyle = env.strokeStyle;
                activeShape.fillStyle = env.fillStyle;
                activeShape.isFill = env.isFill;
                activeShape.sides = env.sides;
                activeShape.stars = env.stars;
                shapes.push(activeShape);
                index=-1;
                sf.drawGraph();
            } else {
                console.log(123)
                //选中控制点后拖拽修改图形
                for(var i=0,len=shapes.length;i<len;i++){

                    if((index=shapes[i].isInPath(sf.ctx,mouseStart))>-1){
                        console.log('index:',index)
                        sf.canvas.style.cursor='crosshair';
                        activeShape=shapes[i];break;
                    }
                }
            }
            // saveImageData();
            sf.canvas.addEventListener('mousemove',mouseMove,false);
            sf.canvas.addEventListener('mouseup',mouseUp,false);
        },false);
        // 鼠标移动
        function mouseMove(e){
            mouseEnd=WindowToCanvas(sf.canvas,e.clientX,e.clientY);
            if(activeShape){
                if(index>-1){
                    activeShape.update(index,mouseEnd);
                } else {
                    activeShape.initUpdate(mouseStart,mouseEnd);
                }
                sf.drawBG();
                if(env.guid){sf.drawGuidewires(sf.ctx,mouseEnd.x,mouseEnd.y); }
                sf.drawGraph();
            }
            // restoreImageData();
        }
        // 鼠标结束
        function mouseUp(e){
            sf.canvas.style.cursor='pointer';
            console.log(activeShape)
            if(activeShape){
                sf.drawBG();
                sf.drawGraph();
                sf.resetDrawType();
            }
            sf.canvas.removeEventListener('mousemove',mouseMove,false);
            sf.canvas.removeEventListener('mouseup',mouseUp,false);
        }
        /*移动*/
        this.canvas.addEventListener('mousemove',function(e){
            currPos=WindowToCanvas(sf.canvas,e.clientX,e.clientY);
            currPos.x=Math.round(currPos.x);
            currPos.y=Math.round(currPos.y);
            //sf.mapshape.pos=currPos
        },false);
        // 删除图形
        document.body.onkeydown=function(e){
            if(e.keyCode==8){
                for(var i=0,len=shapes.length;i<len;i++){
                    if(shapes[i].isInPath(sf.ctx,currPos)>-1){
                        shapes.splice(i--,1);
                        sf.drawBG();
                        sf.drawGraph();
                        break;
                    }
                }
            }
        };
    },
    // 生成对应图形的对象工厂
    factory(type,pos){
        switch(type){
            case 'line': return new Line(pos);
            case 'dash': return new Dash(pos);
            case 'quadratic': return new Quadratic(pos);
            case 'bezier': return new Bezier(pos);
            case 'triangle': return new Triangle(pos);
            case 'rect': return new Rect(pos);
            case 'round': return new Round(pos);
            case 'polygon': return new Polygon(pos);
            case 'star': return new Star(pos);
            case 'ellipse': return new Ellipse(pos);
            default:return new Line(pos);
        }
    },
    /**
     * 获取操作按钮值
     * */
    getEnv(){
        return {
            lineWidth:this.opts.lineWidth||1,//绘制线条粗细
            strokeStyle:this.opts.strokeStyle||'#000000',//描边颜色
            fillStyle:this.opts.fillStyle||'blue',//填充颜色
            type:this.opts.type||'solid',//所有类型
            sides:this.opts.sides||5,//多边形边数
            stars:this.opts.stars||5,//多角星 星数
            isFill:this.opts.isFill||false,//是否填充
            grid:this.opts.grid||true,//背景格子
            guid:this.opts.guid||true,//导航线
            control:this.opts.control||true,
        };
    },
    drawBG(){//绘制背景
        this.ctx.clearRect(0,0,this.W,this.H);
        if(this.getEnv().grid){DrawGrid(this.ctx,'lightGray',10,10); }
    },
    clearPath(){/*清空图型*/
        shapes.length=0;
        this.drawBG();
    },
    showBg_Con(){/*显示网格 控制线*/
        this.drawBG();
        this.drawGraph();
    },
    drawGuidewires(ctx,x,y){//网格
        ctx.save();
        ctx.strokeStyle='rgba(0,0,230,0.4)';
        ctx.lineWidth=0.5;
        ctx.beginPath();
        ctx.moveTo(x+0.5,0);
        ctx.lineTo(x+0.5,ctx.canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0,y+0.5);
        ctx.lineTo(ctx.canvas.width,y+0.5);
        ctx.stroke();
        ctx.restore();
    },
    drawGraph(){ //绘制图形列表
        var showControl=this.getEnv().control;
        console.log(shapes)
        shapes.forEach(shape=>{
            shape.draw(this.ctx);
            if(showControl){
                shape.drawController(this.ctx);
            }
        });
    },
    /**
     * 重置绘制类型
     * */
     resetDrawType(){
        //type = 'solid'
        drawing=false;
    },
    getPoint(){
        return this.mapshape.point
    },
    setPoint(pos){

    }
}





/*document.getElementById('clear').onclick=function(){
    shapes.length=0;
    drawBG();
    document.getElementById('codes').value='';
}*/
/*document.getElementById('grid').onclick=document.getElementById('control').onclick=function(e){
    drawBG();
    drawGraph();
}*/
/*document.getElementById('size').onchange=setValue;
document.getElementById('strokeColor').onchange=setValue;
document.getElementById('fillColor').onchange=setValue;
function setValue(){
    this.nextElementSibling.innerHTML = this.value;
}*/
/*function showInfo(pos){
    var elem=document.getElementById('pos');
    elem.children[0].innerHTML = pos.x;
    elem.children[1].innerHTML = pos.y;
}*/






