var activate_tab = "TAB1";
var activate_answer = 1; 
var currentanswer ="";
var startTime = new Date();
var endTime = "";
var useranswer_names = {};
var XY_names = {};
var QA_names={};
var ele = document.getElementsByTagName('input'); 
var ele = document.getElementsByTagName('input'); 
var Step3Flag=false;
var searchParams = new URLSearchParams(window.location.search);
var input = searchParams.get("groupindex");
var dataset=input.split("_")[0]
var group_id=input.split("_")[1]
var all_answer_conditions={};
var finishFlags={};
var finishStep12={};
var finishStep123={};
var qualifications={};
var URL_=document.location.toString()
var mode = document.location.toString().split("//")[1].split("/")[1].split("?")[0]//qualification/qualifiationGT/index

var step1_correct =document.getElementById('stepIncorrectAnswerinputY') ;
var step1_incorrect =document.getElementById('stepIncorrectAnswerinputN') ;

var step2_zero = document.getElementById('zero_polygon');
var step2_one = document.getElementById('one_polygon');
var step2_multi = document.getElementById('multi_polygon');

var step3_located = document.getElementById('LocatedSelectGroup');
var step3_notlocated = document.getElementById('NotLocatedYet');

$( document ).ready(function() {
    $('[data-toggle="popover"]').popover();   
    $(ControlStep2());
    $(ControlStep3());//initial: disable step3
    $(ControlStep4());
    // $(ControlBox());
    $(ControlAnswer());
    $(ControlNext());
    $(ControlCanvas());//delete?
    
    Group.reload(-1);
    Group.UpdateGroupHtml();


    
    if (qualification_mode==false)
    {
        //Difference between train mode and qualification mode: train mode has Control Next button. Qualification mode will alert users. 
        $ ('input[type=radio]').click(function(){ControlStep2();ControlStep3(); ControlStep4();ControlCanvas();ControlAnswer();ControlNext();});//2 'No' radios clicked or unclicked: enable step3
        $('.image_wrap').click(function(){ControlAnswer();ControlNext()});
        $('#NotLocatedYet').click(function(){ClickNotLocatedYet()});
        $('#LocatedSelectGroup').click(function(){ClickLocated()});
        // $('#zero_polygon').click(function(){ClickNoDraw();});    
    }
    else{
        $ ('input[type=radio]').click(function(){ControlStep2();ControlStep3(); ControlStep4();ControlCanvas();});//2 'No' radios clicked or unclicked: enable step3
        $('#zero_polygon').click(function(){ControlCanvas();});
        // CheckAnswer();

    }
  });


if (dataset=="val" || dataset=="train" ||dataset=="test"){  
    var tabnumber=3;       
    var qualification_mode=false;
}

else if (dataset=="qualification"){
    
    var tabnumber=3;
    var gt_useranswer_names={};
    var gt_XY_names={};

    if (mode == "qualification"){
    var qualification_mode=true;//set true when set to qualification_eva, set false when set to qualification_gt


    $.getJSON("/static/Results/quali_gt/"+dataset+"_gt_results.json", function(data){

        for (j=1; j<tabnumber+1;j++){
            gt_useranswer_names['useranswersTAB'+j]=data[input]['useranswersTAB'+j];
            gt_XY_names['xyTAB'+j]=data[input]['xyTAB'+j];

        }            
        }).fail(function(){
        console.log("Fail to load qualification Ground Truth.");
        });    

    }
    else if (mode == "qualificationGT"){
    
    var qualification_mode=false;
    }
}

for (var i =1; i < tabnumber+1; i++){
    
    useranswer_names['useranswersTAB'+i]={};
    QA_names['qaTAB'+i]={};
    for (var j =1; j < 6; j++){
        XY_names['xyTAB'+i+j]=[]; 

        all_answer_conditions['conditionTAB'+i+j]=false;
        finishFlags['finishFlagTAB'+i+j]=false;
        finishStep12['finishStep12TAB'+i+j]=false;
        finishStep123['finishStep123TAB'+i+j]=false;
    } 
  
    if (qualification_mode==true)
    {
        qualifications["qualiTAB"+i]=false;}
}


//PLEASE NOTICE THAT: tab is indexed from 1 while QA pais are indexed from 1


loadQApairs= $.getJSON("/static/QA_annotations/"+dataset+"_grouped.json", function(data){
            // if (dataset=="val" || dataset=="train" ||dataset=="test"){            
            for (j=1; j<tabnumber+1;j++){
            QA_names['qaTAB'+j]["Answer"]=data[group_id][j-1]["answers"];
            QA_names['qaTAB'+j]["Question"]=data[group_id][j-1]["question"];
                
            // if (dataset=="val" || dataset=="train" ||dataset=="test"){            
            QA_names['qaTAB'+j]["Imgsrc"]="https://vqa_mscoco_images.s3.amazonaws.com/train2014/"+ToCOCOimage(data[group_id][j-1]["image"]);
            // } 

            $(ControlAnswerIndex());

            }
}).fail(function(){
    console.log("An error has occurred.");
});



$.when(loadQApairs).done(function(){
    DisplayCurrentQApairs();
}

)

function ToCOCOimage(imageid){
        
    var imageid_str = imageid.toString(); 
    var num_zero = 12-imageid_str.length;
    var zero_strings="";
    for (i=0; i<num_zero;i++){
        zero_strings+="0"
    }
    console.log("COCO_train2014_"+zero_strings+imageid_str+".jpg")
    return "COCO_train2014_"+zero_strings+imageid_str+".jpg"
}

// Switch Tabs

function find_activated_tab(clicked_id)
{   
    StorePreviousAnswers();
    activate_tab=clicked_id;
    refreshPage();
}

function refreshPage()
{
    ClearAll();
    // InitialBoxes();
    // DisplayBoxes();
    DisplayCurrentQApairs();

    ControlAnswerIndex();
    //Enable Disable buttons/steps
    DisplayCurrentGroups();
    DisplayCurrentAnswers(); // Display current answer (options)

    ControlStep2(); //defined in EnableDisables.js // 
    ControlStep3();
    ControlStep4();
    // ControlBox();
    LoadingControlCanvas();
    ControlAnswer()
    
    ControlNext();
}


function refreshAnswer()
{
    ClearAll();
    // InitialBoxes();
    // DisplayBoxes();
    DisplayCurrentQApairs();
    // DisplayBoxes();
    ControlAnswerIndex();
    //Enable Disable buttons/steps
    DisplayCurrentGroups();
    DisplayCurrentAnswers(); // Display current answer (options)

    ControlStep2(); //defined in EnableDisables.js // 
    ControlStep3();
    ControlStep4();
    // ControlBox();
    LoadingControlCanvas();
    ControlAnswer();
    ControlNext();
}

function UnprocessedAnswer(){
    var unprocessed_answer_list = []

    for (let i=1;i<QA_names['qa'+activate_tab]["Answer"].length+1;i++){
        // console.log(i);
        // console.log(all_answer_conditions['condition'+activate_tab+i.toString()]);
        if (all_answer_conditions['condition'+activate_tab+i.toString()]==false){
            unprocessed_answer_list.push(QA_names['qa'+activate_tab]["Answer"][i-1]);

        }
    }
    var unprocessed_answer = unprocessed_answer_list.join(', ')
    return unprocessed_answer
    
}
function DisplayCurrentQApairs(){
    document.getElementById("answer").innerHTML="Unprocessed Answer(s): "+ UnprocessedAnswer();
    document.getElementById("question").innerHTML="Question: "+QA_names['qa'+activate_tab]["Question"];
    document.getElementById("image").src=QA_names['qa'+activate_tab]["Imgsrc"];
    
}
function DisplayCurrentGroups(){
    
    Group.reload(-1);
    Group.UpdateGroupHtml(); 
    tmpvalue= Group.find_groupnum_from_answer_id();  
    // tmpvalue=useranswer_names['useranswers'+activate_tab][activate_answer.toString()+'SELECT_GROUP_Checkbox'];
    if (typeof tmpvalue !== "undefined"){
        // console.log("initialize-displaycurrentgroups:tmpvalue",tmpvalue);
        groupid = "group"+tmpvalue.toString();
        $("#" + groupid).prop('checked', true);
        $("#LocatedSelectGroup").prop('checked', true);
    }
}

function StorePreviousAnswers() { 
    if (step1_incorrect.checked||step2_zero.checked||step2_multi.checked)
    {
        ClickNoDraw();
    }
    var step1 = $("input[type='radio'][name='INCORRECT_ANSWER']:checked").val();
    var step2 = $("input[type='radio'][name='MULTI_FOCUS_DETECT']:checked").val();
    var step4_wholeimage = $("input[type='checkbox'][name='WholeImage']:checked").val();
    useranswer_names['useranswers'+activate_tab][activate_answer.toString()+'INCORRECT_ANSWER']=step1;
    useranswer_names['useranswers'+activate_tab][activate_answer.toString()+'MULTI_FOCUS_DETECT']=step2;
    useranswer_names['useranswers'+activate_tab][activate_answer.toString()+'WholeImage']=step4_wholeimage;
    Group.reload();
    useranswer_names['useranswers'+activate_tab][activate_answer.toString()+'SELECT_GROUP_Checkbox']=Group.find_groupnum_from_answer_id();
}

function ClearAll() { 
    for(i = 0; i < ele.length; i++) { 
          
        if(ele[i].type=="radio" || ele[i].type=="checkbox") { 
            ele[i].checked=false;
        }

    } 
    
    $('#step1inputN').prop('checked', true);
    clearCanvas();
}

function DisplayCurrentAnswers(){
    for(i = 0; i < ele.length; i++) { 
        {
            tmpvalue=useranswer_names['useranswers'+activate_tab][activate_answer.toString()+ele[i].name];
            if(ele[i].type=="radio") 
            { 
                if(tmpvalue=="Y" && ele[i].value=="Y"){
                    ele[i].checked=true;
                }
                
                else if(tmpvalue=="N" && ele[i].value=="N"){
                    ele[i].checked=true;
                }
                                
                else if(tmpvalue=="CANNOT_DRAW" && ele[i].value=="CANNOT_DRAW"){
                    ele[i].checked=true;
                }
            }
            else if (ele[i].type=="checkbox"){
                    if (tmpvalue== "WholeImage"){
                        ele[i].checked=true;
                    }

               
            }

        }
    }

}


  
  



