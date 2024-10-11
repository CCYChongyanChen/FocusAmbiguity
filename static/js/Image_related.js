

var closeEnough=5;
var UpdateCloseEnough=false;
// init canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
canvas.addEventListener('mousemove', mouseMove, false);



//=======================basic============================================================
function mouseMove(e) {
    //Can draw
    var finished = finishFlags['finishFlag'+activate_tab+activate_answer.toString()];
    if (CanvasThreshold()>N_threshold  && (!NoDraw())){
        
        if (finished){
            //undate once more time to get it changed to yellow
            if (UpdateCloseEnough==true){
                draw_canvas();
                canvas.style.cursor = "auto";}
            else{

                canvas.style.cursor = "auto";
            }

        }

        else{
            canvas.style.cursor = "crosshair";
            var mousePos = getMousePos(canvas, e);
            // not finished && Close Enough
            tmpFlag= finished==false && XY_names['xy'+activate_tab+activate_answer.toString()].length>2 && checkCloseEnough(mousePos.x, XY_names['xy'+activate_tab+activate_answer.toString()][0].x) && checkCloseEnough(mousePos.y, XY_names['xy'+activate_tab+activate_answer.toString()][0].y)
            if(UpdateCloseEnough==false && tmpFlag)
                {
                draw_canvas(style="#791E94");
                UpdateCloseEnough=true;
                } 
            
            //not finished && not closed enough
            else if (!tmpFlag)
            {
                draw_canvas();
                UpdateCloseEnough=false;
            }
        }
    }
    // Cannot draw
    else{

        canvas.style.cursor = "not-allowed";
    }
}

function drawCircle(ctx,x,y, radius) {
    ctx.fillStyle = "#111111";
    ctx.strokeStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x,y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}


function checkCloseEnough(p1, p2) {
    return Math.abs(p1 - p2) < closeEnough;
}

//====================================draw a path and draw canvas========================================
// click to draw path

canvas.addEventListener('click', function(evt) {
    // $('#nodraw:checked').length>0   -> nodraw = check = true
    if (CanvasThreshold()>N_threshold  && (!NoDraw())){
        
        if (finishFlags['finishFlag'+activate_tab+activate_answer.toString()]==false){
            var mousePos = getMousePos(canvas, evt);
            if(XY_names['xy'+activate_tab+activate_answer.toString()].length>2 && checkCloseEnough(mousePos.x, XY_names['xy'+activate_tab+activate_answer.toString()][0].x) && checkCloseEnough(mousePos.y, XY_names['xy'+activate_tab+activate_answer.toString()][0].y)){
                finishOne(canvas);
            }
            else{
                XY_names['xy'+activate_tab+activate_answer.toString()].push(mousePos);
                draw_canvas(); //not finished; drawing; push a new point into it.
            }
            // smallRec(canvas,mousePos);
        }
    }

  }, false);


// draw line
function draw_canvas(style="#F0C132",inputxy=-1){
    
    var ctx=canvas.getContext("2d");
    ctx.lineWidth = 3;
    ctx.strokeStyle = style;
    var i;
    if (inputxy==-1){

        var Xycoo=XY_names['xy'+activate_tab+activate_answer.toString()];
    }
    else{
        var Xycoo=inputxy;
    }
    clearCanvas();
    ctx.beginPath();  
    for (i=0;i<Xycoo.length;i++){
        
        if (i==0){
            ctx.moveTo(Xycoo[i].x,Xycoo[i].y);
        } else {
            ctx.lineTo(Xycoo[i].x,Xycoo[i].y);
        }
    }
    
    ctx.stroke();


    
    for (i=0;i<Xycoo.length;i++){
        drawCircle(ctx,Xycoo[i].x,Xycoo[i].y,closeEnough);
    }

    if (finishFlags['finishFlag'+activate_tab+activate_answer.toString()]==true && inputxy==-1){
        ctx.strokeStyle = "#F0C132";
        ctx.lineTo(XY_names['xy'+activate_tab+activate_answer.toString()][0].x,XY_names['xy'+activate_tab+activate_answer.toString()][0].y);
        ctx.closePath();
        ctx.stroke();
        // 
        // ctx.fillStyle="red";
        // ctx.fill();
        // ctx.globalAlpha=0.5;
    }




    }




//===========================================undo/delete/finish=======================================


// clear canvas. Remember to set finishFlag=False
function clearCanvas(){
    var context= canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
}



// change xycoor, clear canvas, finishFlag=false, draw canvas according to xycoor
function UnDo(){
    if (XY_names['xy'+activate_tab+activate_answer.toString()].length>0){
        XY_names['xy'+activate_tab+activate_answer.toString()].pop();
        finishFlags['finishFlag'+activate_tab+activate_answer.toString()]=false;
        draw_canvas();
    }
    else {
        // XY_names['xy'+activate_tab+activate_answer.toString()].pop();
        // draw_canvas();
        // xyToStoredxy();
        DeleteAllThenInit();
    }
    
    // uncheck the checkbox
    $('#WholeImage').prop('checked', false); // Unchecks it 
}


// Undo  using ctrl+z
//   Finish one label using ENTER
window.addEventListener("keydown", function(event){
    if (event.ctrlKey && event.key == 'z') {
        UnDo();
        ControlAnswer();
        ControlNext();
      }
    else if (event.keyCode == 13) {   
        finishOne();
        ControlAnswer();
        ControlNext();
       }
   },false);

// xycoordinate_names['xycoordinatesTAB'+i]={}; 
//used by button only
//xycoor should only be changed if finished or delete all 
function DeleteAllThenInit(){
    //delete xy, storedxy, n,canvas,button according to xycoord list
    XY_names['xy'+activate_tab+activate_answer.toString()]=[];
    // xyToStoredxy();
    clearCanvas();
    finishFlags['finishFlag'+activate_tab+activate_answer.toString()]=false;
    
    // uncheck the checkbox
    $('#WholeImage').prop('checked', false); // Unchecks it 
    Group.reload(-2);
    Group.delete();
    // console.log("delete",Group.groups_dict);
    // console.log("XY:",JSON.stringify(XY_names['xy'+activate_tab+activate_answer.toString()]));
}
    


function finishOne(){
    if (finishFlags['finishFlag'+activate_tab+activate_answer.toString()]==false){

            var ctx=canvas.getContext("2d");
            XY_names['xy'+activate_tab+activate_answer.toString()].push(XY_names['xy'+activate_tab+activate_answer.toString()][0]);
            ctx.strokeStyle = "#791E94";
            ctx.lineTo(XY_names['xy'+activate_tab+activate_answer.toString()][0].x,XY_names['xy'+activate_tab+activate_answer.toString()][0].y);
            ctx.closePath();
            ctx.stroke();
            finishFlags['finishFlag'+activate_tab+activate_answer.toString()]=true; //finished
            Group.reload(-1);
            Group.add(false,false);
            // console.log("add",Group.groups_dict);
            // console.log("XY:",JSON.stringify(XY_names['xy'+activate_tab+activate_answer.toString()]));
        // };

    }
}

//========================================================================================
// function xyToStoredxy(){ 
//     document.getElementById("xycoorcommonAnswer").innerHTML=JSON.stringify(XY_names['xy'+activate_tab+activate_answer.toString()]);  
// }


//wholleimageCheckBox
WholeImageCheckBox();
function WholeImageCheckBox(){
    let list = [{"x":1.5,"y":1.5},{"x":398.5,"y":1.5},{"x":398.5,"y":498.5},{"x":1.5,"y":498.5},{"x":1.5,"y":1.5}];
    // Drawdetectonchange('#WholeImage:checkbox',list);
    $('#WholeImage:checkbox').change(
        function clickreflesh(){
            if ($(this).is(':checked')) {
                XY_names['xy'+activate_tab+activate_answer.toString()]=list;
                finishFlags['finishFlag'+activate_tab+activate_answer.toString()]=true;           
                Group.reload(-1);
                Group.add(false,false);
                draw_canvas();        
                ControlAnswer();
                ControlNext();
                
            }
            else{
                DeleteAllThenInit(); 
                ControlAnswer();
                ControlNext();
            }
        }
        );
    
}

function clickreflesh2(xy_list){
        XY_names['xy'+activate_tab+activate_answer.toString()]=xy_list;
        finishFlags['finishFlag'+activate_tab+activate_answer.toString()]=true; 
        draw_canvas();
        ControlAnswer();       
        ControlNext();
}
