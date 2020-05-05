import React from 'react';
import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';
import {Button} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";


class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            counter: 0,
            file:'',
            offset:{
                x:0,
                y:0

            },
            canvasCoord:{
                x:0,
                y:0
            },
            lines:[],
            objects:[],
            circles:[],
            curves:[],
            rectangles:[],
            canvas:null,
            mode:'not chosen',
            color:'#008000',
            action:'no action',
            instruction:'Choose mode to get instructions',
            curve:{x: 100, y: 200, cp1y: 300, cp2x: 200, cp2y: 300, cp3x: 300}
        };
    }

    componentDidMount() {
        this.setState({canvas:this.refs.canvas.getContext('2d')})

        let a = ReactDOM.findDOMNode(this.refs['canvas'])
            .getBoundingClientRect();
        // console.log(a.x, a.y)
        this.state.canvasCoord.x =  Math.floor(a.x)
        this.state.canvasCoord.y =  Math.floor(a.y)

        // let curve = this.state.curve

        // this.curve(curve.x,curve.y,curve.cp1y,curve.cp2x,curve.cp2y,curve.cp3x,this.refs.canvas.getContext('2d'))
    }

    point = (x, y, canvas) => {
        canvas.beginPath();
        canvas.moveTo(x, y);
        canvas.lineTo(x+1, y+1);
        canvas.strokeStyle = this.state.color;
        canvas.stroke();
    }

    line = (x, y,xEnd,yEnd, canvas) =>{
        canvas.beginPath();
        canvas.moveTo(x, y);
        canvas.lineTo(xEnd , yEnd);
        canvas.strokeStyle = this.state.color;
        canvas.stroke();
    }

    rectangle = (x, y,xEnd,yEnd, canvas) =>{
        canvas.beginPath();
        canvas.moveTo(x, y);
        canvas.lineTo(x , yEnd);
        canvas.moveTo(x, y);
        canvas.lineTo(xEnd , y);
        canvas.moveTo(xEnd, y);
        canvas.lineTo(xEnd , yEnd);
        canvas.moveTo(xEnd , yEnd);
        canvas.lineTo(x , yEnd);
        canvas.strokeStyle = this.state.color;
        canvas.stroke();



    }

    circle = (x, y,r, canvas) => {
        // x = x - this.state.canvasCoord.x
        // y = y - this.state.canvasCoord.y

        canvas.lineWidth = 1;
        canvas.beginPath();
        canvas.arc(x, y, r, 0, 2 * Math.PI, true);
        canvas.strokeStyle = this.state.color;
        canvas.stroke();
    }

    curve = (x,cp1y,cp2x,cp2y,endX,y,canvas) => {
        // this.state.curves.push({x: x, y: y, cp1x: cp1x, cp2x: cp2x, cp2y: cp2y, cp3x: cp3x})
        // x = this.normalize(x,true)
        // y = this.normalize(y,false)
        canvas.beginPath();
        canvas.moveTo(x, y);
        // console.log(this.normalize(cp1y,false))
        // canvas.bezierCurveTo( x,this.normalize(cp1y,false),this.normalize(cp2x,true) ,this.normalize(cp2y,false) ,this.normalize(cp3x,true), y)
        // canvas.bezierCurveTo( 250,200,700 , 200,250, 300)
        // canvas.bezierCurveTo(250, 200, 700, 200, 700, 250);

        console.log(x,cp1y,cp2x,cp2y,endX,y)

        //canvas.moveTo(250, 250);
        // canvas.bezierCurveTo(250, 100, 700, 100, 700, 250);
        // context.bezierCurveTo(140, 10, 388, 10, 388, 170);
        canvas.bezierCurveTo( x,cp1y,cp2x ,cp2y ,endX, y)
        canvas.strokeStyle = this.state.color;
        canvas.stroke();
    }

    normalize = (val,isX) => {
        if(isX)
            return val +  this.state.canvasCoord.x
        else
            return val + this.state.canvasCoord.y
    }

    showFile = async (e) => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = async (e) => {
            const text = (e.target.result)
            let lines = e.target.result.split('\n');
            for(let line = 0; line < lines.length; line++){
                if(lines[line].startsWith('offset')){
                    this.state.offset.x = parseInt(lines[line].split(',')[1])
                    this.state.offset.y = parseInt(lines[line].split(',')[2])
                    // this.setState({offset.x:})
                }
                else if(lines[line].startsWith('lines')) {
                    let oneLine = lines[line]
                    let data = oneLine.split(':')[1]
                    let alllines = data.split('/')
                    for (let i = 0; i < alllines.length; i++) {
                        let x = alllines[i].split('-')[0].split(',')[0]
                        x = this.normalize(parseInt(x), true)
                        let y = alllines[i].split('-')[0].split(',')[1]
                        y = this.normalize(parseInt(y), false)
                        let x1 = alllines[i].split('-')[1].split(',')[0]
                        x1 = this.normalize(parseInt(x1), true)
                        let y1 = alllines[i].split('-')[1].split(',')[1]
                        y1 = this.normalize(parseInt(y1), false)

                        let line = {x: x, y: y, x1: x1, y1: y1}

                        this.state.lines.push(line)
                    }
                }
                else if(lines[line].startsWith('circles')) {
                    let oneLine = lines[line]
                    let data = oneLine.split(':')[1]
                    let allcircles = data.split('/')
                    for (let i = 0; i < allcircles.length; i++) {
                        let x = allcircles[i].split(',')[0]
                        x = this.normalize(parseInt(x), true)
                        let y = allcircles[i].split(',')[1]
                        y = this.normalize(parseInt(y), false)
                        let r = parseInt(allcircles[i].split(',')[2])
                        // r = this.normalize(parseInt(y), false)

                        let circle = {x: x, y: y, r: r}

                        this.state.circles.push(circle)
                    }
                }
                else if(lines[line].startsWith('curves')) {
                    let oneLine = lines[line]
                    let data = oneLine.split(':')[1]
                    let allcircles = data.split('/')
                    for (let i = 0; i < allcircles.length; i++) {
                        let x = parseInt(allcircles[i].split(',')[0])
                        x = this.normalize(parseInt(x), true)

                        let cp1y = parseInt(allcircles[i].split(',')[1])
                        cp1y = this.normalize(parseInt(cp1y), false)
                        let cp2x = parseInt(allcircles[i].split(',')[2])
                        cp2x = this.normalize(parseInt(cp2x), true)

                        let cp2y = parseInt(allcircles[i].split(',')[3])
                        cp2y = this.normalize(parseInt(cp2y), false)
                        let endX= parseInt(allcircles[i].split(',')[4])
                        endX = this.normalize(parseInt(endX), true)

                        let a = parseInt(allcircles[i].split(',')[5])
                        let b = this.normalize(a,false)
                        this.state.curves.push({x: x, cp1y: cp1y, cp2x: cp2x, cp2y: cp2y,endX:endX, y: b})
                    }


                }
                else if(lines[line].startsWith('rectangles')) {
                    let oneLine = lines[line]
                    let data = oneLine.split(':')[1]
                    let alllines = data.split('/')
                    for (let i = 0; i < alllines.length; i++) {
                        let x = alllines[i].split('-')[0].split(',')[0]
                        x = this.normalize(parseInt(x), true)
                        let y = alllines[i].split('-')[0].split(',')[1]
                        y = this.normalize(parseInt(y), false)
                        let x1 = alllines[i].split('-')[1].split(',')[0]
                        x1 = this.normalize(parseInt(x1), true)
                        let y1 = alllines[i].split('-')[1].split(',')[1]
                        y1 = this.normalize(parseInt(y1), false)

                        let rectangle = {x: x, y: y, x1: x1, y1: y1}
                        this.state.rectangles.push(rectangle)
                    }
                }

                }
                // this.findCenterPoint()
                this.renderOnCanvas()


            // console.log(text)
            this.forceUpdate()
        };
        reader.readAsText(e.target.files[0])
    }

    handleClickOnCanvas = (e) => {
        let x = e.clientX;     // Get the horizontal coordinate
        let y = e.clientY;     // Get the vertical coordinate
        let coor = "X coords: " + x + ", Y coords: " + y;
        console.log(coor)

        if(this.state.mode === 'move'){
            this.moveImage(x,y)
        }

        if(this.state.mode === 'mirror'){



            this.mirrorImage()
        }

        if(this.state.mode === 'scaling'){
            // this.scaling()
        }



        // this.rectangle(500,500,600,600,this.refs.canvas.getContext('2d'))

    }

    scaling = (action,number) => {
        console.log(action)

        this.clearCanvas()
        let factor = 1
        if('plus' === action){
            factor = 1.1
        }
        if('minus' === action){
            factor = 0.9
        }



        let data = []
        this.state.lines.map(one => {
            one.x *= factor
            one.x1 *= factor
            one.y *= factor
            one.y1 *= factor
            data.push(one)
        })
        data = []
        this.state.rectangles.map(one => {
            one.x *= factor
            one.x1 *= factor
            one.y *= factor
            one.y1 *= factor
            data.push(one)
        })
        data = []
        this.state.circles.map(one => {
            one.x *= factor
            one.y *= factor
            one.r *= factor
            data.push(one)
        })
        data = []
        this.state.curves.map(one => {
            one.x *= factor
            one.y *= factor
            one.cp1y *= factor
            one.cp2x *= factor
            one.cp2y *= factor
            one.endX *= factor
            data.push(one)
        })

        this.renderOnCanvas()
    }

    clearCanvas = ( ) => {
        this.refs.canvas.getContext('2d').beginPath();
        this.refs.canvas.getContext('2d').clearRect(0,0, this.normalize(1400,true), this.normalize(700,false));
    }

    moveImage = (x,y) => {
        let center = this.findCenterPoint()
        console.log(center.x)
        console.log(center.y)
        let offsetX = x - center.x
        let offsetY = y - center.y - 200


        x = offsetX
        y = offsetY

        this.clearCanvas()

        let data = []
        this.state.lines.map(one => {
            one.x += x
            one.x1 += x
            one.y += y
            one.y1 += y
            data.push(one)
        })
        data = []
        this.state.rectangles.map(one => {
            one.x += x
            one.x1 += x
            one.y += y
            one.y1 += y
            data.push(one)
        })
        data = []
        this.state.circles.map(one => {
            one.x += x
            one.y += y
            data.push(one)
        })
        data = []
        this.state.curves.map(one => {
            console.log(one)
            console.log(y)
            console.log(x)
            one.cp1y += y
            one.cp2x += x
            one.cp2y += y
            one.endX += x
            // x: NaN
            // y: -113
            one.x += x
            one.y += y
            // one.cp1y += y
            // one.cp2x += x
            // one.cp2y += y
            // one.endX += x

            console.log(one)

            data.push(one)
        })

        this.renderOnCanvas()


    }

    mirrorImageRight = () => {

    }


    mirrorImage = () => {
        console.log('in mirror')

        this.clearCanvas()

        // console.log(this.state.lines)
        // let one = this.state.curve

        // let maxY = Math.max(one.y,one.cp1y,one.cp2y)
        //
        // console.log(this.normalize(maxY,false))

        let flip = this.findCenterPoint()
        // console.log(flip.maxY)
        this.state.lines.map(one => {
            if(one.y === flip.maxY){} else{one.y = (flip.maxY - one.y) + flip.maxY}
            if(one.y1 === flip.maxY){}else {one.y1 = (flip.maxY - one.y1) + flip.maxY}
        })
        this.state.circles.map(one => {
            if(one.y === flip.maxY){} else{one.y = (flip.maxY - one.y) + flip.maxY}
        })
        this.state.rectangles.map(one => {
            if(one.y === flip.maxY){} else{one.y = (flip.maxY - one.y) + flip.maxY}
            if(one.y1 === flip.maxY){}else {one.y1 = (flip.maxY - one.y1) + flip.maxY}

        })
        // this.state.curves.push({x: x, y: y, cp1y: cp1y, cp2x: cp2x, cp2y: cp2y, cp3x: cp3x})
        this.state.curves.map(one => {
            if(one.y === flip.maxY){} else{one.y = (flip.maxY - one.y) + flip.maxY}
            if(one.cp1y === flip.maxY){} else {one.cp1y = (flip.maxY - one.cp1y) + flip.maxY}
            if(one.cp2y === flip.maxY){} else {one.cp2y = (flip.maxY - one.cp2y) + flip.maxY}

        })




        this.renderOnCanvas()
        // console.log(this.state.curve)
        // this.clearCanvas()
        // let curve = this.state.curve
        //
        // this.curve(curve.x,curve.y,curve.cp1y,curve.cp2x,curve.cp2y,curve.cp3x,this.refs.canvas.getContext('2d'))
    }


    renderOnCanvas = () => {
        this.state.lines.map(one => {
            this.line(one.x,one.y,one.x1,one.y1,this.refs.canvas.getContext('2d'))
        })

        this.state.circles.map(one => {
            this.circle(one.x,one.y,one.r,this.refs.canvas.getContext('2d'))
        })

        this.state.curves.map(one => {
            this.curve(one.x,one.cp1y,one.cp2x,one.cp2y,one.endX,one.y,this.refs.canvas.getContext('2d'))
        })

        this.state.rectangles.map(one => {
            this.rectangle(one.x,one.y,one.x1,one.y1,this.refs.canvas.getContext('2d'))
        })


    }

    findCenterPoint = () => {
        let maxX= 0,minX= 99999,maxY= 0,minY = 999999
        this.state.lines.map(one => {
            maxX = Math.max(one.x,one.x1,maxX)
            maxY = Math.max(one.y,one.y1,maxY)
            minX = Math.min(one.x,one.x1,minX)
            minY =Math.min(one.y,one.y1,minY)
        })
        this.state.circles.map(one => {
            maxX = Math.max(one.x,maxX)
            maxY = Math.max(one.y,maxY)
            minX = Math.min(one.x,minX)
            minY = Math.min(one.y,minY)
        })
        this.state.curves.map(one => {
            maxX = Math.max(one.x,one.cp2x,one.endX,maxX)
            maxY = Math.max(one.y,one.cp1y,one.cp2y,maxY)
            minX = Math.min(one.x,one.cp2x,one.endX,minX)
            minY = Math.min(one.y,one.cp1y,one.cp2y,minY)
        })
        this.state.rectangles.map(one => {
            maxX = Math.max(one.x,one.x1,maxX)
            maxY = Math.max(one.y,one.y1,maxY)
            minX = Math.min(one.x,one.x1,maxX)
            minY = Math.min(one.y,one.y1,maxY)
        })


        let centerX = (maxX + minX) /2
        let centerY = (maxY + minY) /2
        return {x:centerX,y:centerY,maxX:maxX,maxY:maxY,minX:minX,minY:minY}
    }

    render() {
        return (
            <div className="App">
                <div>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton edge="start" color="inherit" aria-label="menu">
                            </IconButton>
                            <Typography variant="h6" >
                                Welcome to Easy-Draw
                            </Typography>
                        </Toolbar>
                    </AppBar>

                    <Card>
                        <CardActionArea>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Current mode: {this.state.mode}
                                </Typography>
                                <Typography gutterBottom variant="p" component="h2">
                                    {this.state.instruction}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <canvas ref="canvas" style={styles.board}  height={700}
                        width={1400}  onClick={(e) =>this.handleClickOnCanvas(e)}/>

                        {this.state.mode === 'scaling'?<div>
                            <Button
                                style={{margin:10}}
                                onClick={() =>
                                this.scaling('plus',0)}
                                size="small" variant='contained' color="primary">
                                Enlarge
                            </Button>
                            <Button style={{margin:10}} onClick={() =>
                                    this.scaling('minus',0)}
                                    size="small"
                                    variant='contained'
                                    color="primary">
                                Reduce
                            </Button>
                        </div> : <div/>}

                        {this.state.mode === 'mirror'?<div>
                            <Button
                                style={{margin:10}}
                                onClick={() =>
                                    this.mirrorImageRight()}
                                size="small" variant='contained' color="primary">
                                Right
                            </Button>
                            <Button style={{margin:10}} onClick={() =>
                                this.mirrorImage()}
                                    size="small"
                                    variant='contained'
                                    color="primary">
                                Bottom
                            </Button>
                        </div> : <div/>}

                        <CardActions>
                            <Button
                                variant="contained"
                                component="label"
                                color="primary"
                            > Upload File<input  style={{ display: "none" }} type="file" onChange={(e) => this.showFile(e)} /></Button>
                            <Button
                                variant="contained"
                                component="label"
                                color="primary"
                                onClick={() => {
                                    this.setState({lines:[],circles:[],curves:[],rectangles:[]})
                                    this.clearCanvas()
                                    window.location.reload(true);
                                }}
                            > Clean Canvas</Button>
                            <Typography style={{marginLeft:200}}>Choose a mode:</Typography>
                            <Button disabled={this.state.mode === 'move'} onClick={() => this.setState({mode:'move',instruction:'Click on a point on canvas, the image will be centered in that point'})} size="small" variant='contained' color="primary">
                                Move
                            </Button>
                            <Button disabled={this.state.mode === 'mirror'} onClick={() =>this.setState({mode:'mirror'})} size="small" variant='contained' color="primary">
                                Mirror
                            </Button>
                            <Button disabled={this.state.mode === 'spin'} onClick={() =>this.setState({mode:'spin'})} size="small" variant='contained' color="primary">
                                Spin
                            </Button>
                            <Button disabled={this.state.mode === 'scaling'} onClick={() => this.setState({mode:'scaling'})} size="small" variant='contained' color="primary">
                                Scaling
                            </Button>
                        </CardActions>
                    </Card>
                </div>
            </div>
        );
    }


}


const styles = {

    board:{
        margin:'0 auto',
        height:700,
        width:1400,
        backgroundColor:"lightgray",
        webkitBoxShadow: "1px 3px 1px #9E9E9E",
        mozBoxShadow: "1px 3px 1px #9E9E9E",
        boxShadow: "1px 1px 5px 5px #9E9E9E"

    }

};

export default App;
