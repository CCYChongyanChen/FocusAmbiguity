
function CanvasThreshold(){
    var num =0;
    if (step1_correct.checked==true){num+=1}  
    if (step2_one.checked==true){num+=1}  
    if (step3_notlocated.checked==true){num+=1}  
    return num
}
function NoDraw(){
    return(step2_zero.checked );

}

//============================================CheckAnswer=====================================
function FinishStatus(){
    
    var CheckStep1Step2 =step1_incorrect.checked||step2_zero.checked||step2_multi.checked
    var LocatedSelect= true;
    if ($('#LocatedSelectGroup:checked').length>0 && $( "input[id^='group']:checked" ).length==0 ){
            var LocatedSelect = false
        }
    var Drawfinished = finishFlags['finishFlag'+activate_tab+activate_answer.toString()]==true
    var condition=(CheckStep1Step2 || Drawfinished)&&LocatedSelect;
    return condition
}

function NextGroupFinishStatus(){
    var answers= QA_names['qa'+activate_tab]["Answer"];
    if (typeof answers == "undefined"){
        return false
    }
    else{
        length=(answers.length+1);
        for (let i=1;i<QA_names['qa'+activate_tab]["Answer"].length+1;i++){
            if (all_answer_conditions['condition'+activate_tab+i.toString()]==false){
                return false
            }
        }
        
        return true
    } 
}


function AlertFinish(){
    var condition = FinishStatus();
    if (!condition){
        //$('#nodraw:checked').length>0
        if (NoDraw()){
            alert("Please input your reason for not drawing the polygon. For example: 'Answer is not displayed in the image.'");
        }
        else{alert("You are not finished!")
        }
    }

    return condition
}

//=============================================STEP3 ===========================================
function checkStep2(){
    return true;
}
function checkStep3(){
    return step1_correct.checked;
}

function checkStep4(){
    if ($('#NotLocatedYet:checked').length>0){
        return (CanvasThreshold()>2); 
    }
    else{
        return (CanvasThreshold()>1); 
    }
}


function ControlStep2() {
    if (checkStep2()==true) {
        $("input.Step2").removeAttr("disabled");
        $("div.step2").removeClass("noHover");
    } else {
        // incorrectul.innerHTML=""
        $("input.Step2").attr("disabled", true);
        $("div.step2").addClass("noHover");
    }
    // STEP2_answerdisplay();

    }
function ControlStep3() {
if (checkStep3()==true) {
    $("input.Step3").removeAttr("disabled");
    $("div.step3").removeClass("noHover");
} else {
    // multisemanul.innerHTML=""
    $("input.Step3").attr("disabled", true);
    $("div.step3").addClass("noHover");
}

    // STEP3_answerdisplay();
}
function ControlStep4() {
    if (checkStep4()==true) {        
        $("input.Step4").removeAttr("disabled");
        $("div.step4").removeClass("noHover");
    
    } else {
        $("input.Step4").attr("disabled", true);
        $("div.step4").addClass("noHover");
    }
    }


//ControlCanvas is controlled by "NoDraw"
function ControlCanvas(){
// $('#nodraw:checked').length==0
     
    if (CanvasThreshold()>N_threshold ){
        draw_canvas();        
        enableBtn('#WholeImage');
    }
    else{
        disableBtn('#WholeImage');
        document.getElementById('WholeImage').disabled = true;
        // no hover
        if (!($("input[id^='group']:checked").length>0)){
            clearCanvas();
            }
        
    }
    
}

function LoadingControlCanvas(){
    // $('#nodraw:checked').length==0
        if (CanvasThreshold()>N_threshold-1  && !NoDraw()){
            draw_canvas();        
            enableBtn('#WholeImage');
            // console.log(document.getElementById('WholeImage').disabled);
        }
        else{
            disableBtn('#WholeImage');
            document.getElementById('WholeImage').disabled = true;
            clearCanvas();
            // no hover
            
        }
        
    }
//=========================================CHECK STATUS======================================

//=========================================CLICK BUTTON======================================


function ClickNotLocatedYet(){
    if ($('#NotLocatedYet:checked').length>0){
        $( "input[id^='group']" ).prop("checked", false);
        DeleteAllThenInit();
        ControlAnswer();
        ControlNext();
    }
}

function ClickLocated(){
    if ($("input[id^='group']:checked").length>0){

    }
    else{
        DeleteAllThenInit();
        ControlAnswer();
        ControlNext();
    }
}

function ClickNoDraw(){
    ControlAnswer();
    ControlCanvas();
    DeleteAllThenInit();
    ControlNext();
}
//===========================================CONTROL NEXT BUTTON================================


function ControlNext(){
    var activate_btnid=activate_tab.toLowerCase();
    var currenttabID=(parseInt(activate_tab.slice(3)));
    var next_group_condition = NextGroupFinishStatus();
    if (qualification_mode==false){
        if (next_group_condition==true){
            EnableNext(activate_btnid,currenttabID);}
        else{
            DisableNext(activate_btnid,currenttabID);
        }
    }

}

function ControlBox(){
    // STEP1_answerdisplay();
    // STEP2_answerdisplay();
    // STEP2_nodraw_answerdisplay();
}
function ControlAnswer(){
    var condition = FinishStatus();
    // alert(activate_answer);
    all_answer_conditions['condition'+activate_tab+activate_answer.toString()]=condition;
    if (qualification_mode==false){
        if (condition==true){
            EnableNextAnswer();}
        else{
            DisableNextAnswer();
        }
    }
}




function EnableNextAnswer(activate_btnid){
    enableBtn('#answerbottonright');
    finishStep123["finishStep123"+activate_tab]=true;
}
function DisableNextAnswer(activate_btnid){
    disableBtn('#answerbottonright');
    $('#answerbottonright').prop('disabled', true);
    finishStep123["finishStep123"+activate_tab]=false;
}


function EnableNext(activate_btnid,currenttabID){
    
    enableBtn('#'+activate_btnid+' > .btnNext');
    finishStep123["finishStep123"+activate_tab]=true;
    var j =currenttabID;
    while(finishStep123["finishStep123TAB"+j]==true){
        $('#TAB'+j).parent().removeClass("disabled");
        j++;
    }
    
    enableBtn('#'+activate_btnid+' > .btnsubmit');
}
function DisableNext(activate_btnid,currenttabID){
    disableBtn('#'+activate_btnid+' >.btnNext');

    for (i = currenttabID; i < tabnumber+1; i++) {
        $('#TAB'+i).parent().addClass("disabled");
        
    }

    finishStep123["finishStep123"+activate_tab]=false;
    disableBtn('#'+activate_btnid+' > .btnsubmit');
}

function disableBtn(button) {
    $(button).attr("disabled", true);
    $(button).addClass("noHover");
}

function enableBtn(button) {
    $(button).removeAttr("disabled");
    $(button).removeClass("noHover");
}

