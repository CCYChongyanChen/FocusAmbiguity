var step4_notfirstanswer = document.getElementById("step4NotFirstAnswer")
var step4_firstanswer = document.getElementById("step4FirstAnswer")
var answerbottonleft = document.getElementById("answerbottonleft")
var answerbottonright = document.getElementById("answerbottonright")
var N_threshold  = 1;
function previous_answer() //called by onclick, called in .html
{   
    
    StorePreviousAnswers(); //Defined in Initialize.js
    activate_answer-=1;
    // hide_show_step4();
    ControlAnswerIndex();
    refreshAnswer(); //Defined in Initialize.js
}
function next_answer()
{   
    StorePreviousAnswers();
    activate_answer+=1;
    // hide_show_step4();
    ControlAnswerIndex();
    refreshAnswer();
}

function detectFinish(){
    if (QA_names['qa'+activate_tab]["Answer"]==undefined){
        return false
    }
    for (i=1;i<QA_names['qa'+activate_tab]["Answer"].length+1;i++){
        if (finishFlags['finishFlag'+activate_tab+i.toString()]==true){
            return true
        }
    }
    
    return false
}
function ControlAnswerIndex(){
    //function 1: replace answer in the question;
    //
    document.getElementById("answer").innerHTML="Unprocessed Answer(s): "+ UnprocessedAnswer();
    currentanswer = QA_names['qa'+activate_tab]["Answer"][activate_answer-1]
    document.getElementById("step2question").innerHTML=currentanswer;
    document.getElementById("step3question").innerHTML=currentanswer;
    document.getElementById("step4questionfirst").innerHTML=currentanswer;
    document.getElementById("step4questionnotfirst").innerHTML=currentanswer;
    document.getElementById("answerindex").innerHTML=activate_answer.toString()+"/"+QA_names['qa'+activate_tab]["Answer"].length.toString()+ " answer";
    
      

    if (detectFinish()==false){ // more than one 
        N_threshold = 1; 
        step4_notfirstanswer.style.display="none";
        step4_firstanswer.style.display="block";
    }
    else{ //display first 

        N_threshold = 2; 
        step4_notfirstanswer.style.display="block";
        step4_firstanswer.style.display="none";
    }


    if (activate_answer==1 )
    {   answerbottonleft.style.display="none";
        answerbottonright.style.display="inline";
    }
    else
    {
        if (activate_answer == QA_names['qa'+activate_tab]["Answer"].length){
            
        answerbottonright.style.display="none";
        }
        else{
        answerbottonright.style.display="inline";
        }
        answerbottonleft.style.display="inline";
        
    }

}
