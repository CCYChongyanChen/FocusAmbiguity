// $ ("input[type='radio'][name='MULTI_QUESTION_DETECT']").click(function(){STEP1_answerdisplay();STEP2_answerdisplay();STEP3_answerdisplay();});
// $ ("input[type='radio'][name='INCORRECT_ANSWER']").click(function(){STEP2_answerdisplay();STEP3_answerdisplay();});
// $ ("input[type='radio'][name='MULTI_FOCUS_DETECT']").click(function(){STEP3_answerdisplay();});
var Incorrect_group = [[],[],[]];
var MultiSemantics_group = [[],[],[]];
var NoDraw_group = [[],[],[]];
var drawed_group = [];
var multisemanul = document.querySelector( '#multisemanul' );
var incorrectul = document.querySelector( '#incorrectul' );
var incorrectID = "incorrect"+activate_answer.toString();
var multisemanID = "multiseman"+activate_answer.toString();





class Boxes{
    constructor(id){
        this.id = id;
    }

}

class Groups{

    constructor(){
        
        this.groups_dict = {};
        this.group_num = 0;
        this.answer_id = 0;

    }
    reload(GroupNum){
        // groups_dict
        let tab_id = find_activate_tab_num();
        this.answer_id = activate_answer-1;
        switch(tab_id)
        {
            case 0: 
            this.groups_dict= group1;
            
            break;

            case 1: 
            this.groups_dict= group2;
            break;

            case 2: 
            this.groups_dict= group3;

            break;

            case 3: 
            this.groups_dict= group4;

            break;

        }
        
        if (GroupNum==-1){

            this.group_num = Object.keys(this.groups_dict).length+1;
        }
        else {
            if (GroupNum==-2){
                this.group_num = this.find_groupnum_from_answer_id();
            }
            else {
                this.group_num = GroupNum;
            }
        }

        
    }

    GetXYlist(){
        if (this.groups_dict.hasOwnProperty(this.group_num)){
            let value = parseInt(this.groups_dict[this.group_num][0])+1;
            // let key = Object.keys(this.groups_dict)[0]
            // let value = parseInt(this.groups_dict[key])+1 //answer_id
            return XY_names['xy'+activate_tab+value.toString()]
            
        }
        else{
            alert("cannot find this group number!",this.group_num)
        }
    }

    add(check=false,updateGroup=true,option_id=-1){
            var previous_dict_len=Object.keys(this.groups_dict).length.valueOf();
            var tmpoption_id = this.group_num;
            this.group_num = this.find_groupnum_from_answer_id();
            if (typeof this.group_num!== "undefined"){
                // this.find_groupnum_from_answer_id();
                // console.log("boxes-add-this.group_num1",this.group_num);
                this.delete();

            }
            if (previous_dict_len != Object.keys(this.groups_dict).length ){
                if (this.group_num<tmpoption_id){
                    this.group_num = tmpoption_id-1;
                    
                }
                else{
                this.group_num = tmpoption_id;
                }

            }
            else{
                this.group_num = tmpoption_id;

            }
            this.answer_id = activate_answer-1;
            
            if (this.groups_dict.hasOwnProperty(this.group_num)){
                if (this.groups_dict[this.group_num].includes(this.answer_id)){

                }
                else{
                    this.groups_dict[this.group_num].push(this.answer_id);

                }
            }
            else{
                this.groups_dict[this.group_num]=[this.answer_id];            
            }

            this.updateGroup();
            if (updateGroup==true){
                if (option_id==-1){
                    this.UpdateGroupHtml(check=true,option_id);  //select group needs this line to avoid double clicking;

                }
                else{
                      this.UpdateGroupHtml(check=true,this.group_num);  //select group needs this line to avoid double clicking;

                }
                ///option_id
            }
    }

    delete(){
        // console.log(this.groups_dict,this.group_num,this.answer_id);
        if (this.group_num===undefined){
        }
        else{
            if (this.groups_dict[this.group_num].length<2){
                delete this.groups_dict[this.group_num];
                for (let k=parseInt(this.group_num);k<5;k++){
                    if ((k+1).toString() in this.groups_dict){
                        this.groups_dict[k.toString()]=this.groups_dict[(k+1).toString()];
                    }
                    else{
                        delete this.groups_dict[k.toString()];
                        break
                    }
                }
            }
            else {
                let answer_index = this.groups_dict[this.group_num].indexOf(this.answer_id);
                if (answer_index > -1) {
                    this.groups_dict[this.group_num].splice(answer_index,1); //why "1":[0] is deleted?
                    // console.log(this.groups_dict);
    
                  }
                else{
                    console.log("answerindex not exist");
                }
    
            }
            this.updateGroup();
            this.UpdateGroupHtml();
        }

       
    }
    find_groupnum_from_answer_id(groups_dict=this.groups_dict,answer_id =this.answer_id  ){
        for(const key in groups_dict){
            if (groups_dict.hasOwnProperty(key)){
                for (const elem of groups_dict[key]){
                    if (elem == answer_id){
                        // console.log("groupnum is");
                        // console.log(key);
                        return key
                    }
                }
                }
            }
            
            

    }
    getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
      }
      
      
    updateGroup(){
        
        this.answer_id = find_activate_tab_num();

        switch(this.answer_id)
        
        {
            case 0: 
            group1= this.groups_dict;
            
            break;

            case 1: 
            group2 = this.groups_dict;
            break;

            case 2: 
            group3 =  this.groups_dict;

            break;

            case 3: 
            group4 =  this.groups_dict;
        }


    }

    UpdateGroupHtml(check=false,option_id){
        let res = Object.keys(this.groups_dict).sort();
        let html ="";
        for(let key in res){
            // console.log("boxes-UpdateGroupHtml-key",key);
            let answer_indexs = this.groups_dict[res[key]]; //e.g., dict = {"1":[0], "2": [1]};dict = {"1":[0,1], "2": []};
            // console.log("boxes-UpdateGroupHtml- answer_indexs", answer_indexs);
            let text_answers_list = [];
            for (const answer_index of answer_indexs){
                text_answers_list.push(QA_names['qa'+activate_tab]["Answer"][answer_index]);
            }
            let text_answers = text_answers_list.join(', ');
            let content =  ' Region'+res[key].toString()+': '+ text_answers+'<br>';
            if (check==true && option_id==res[key]){
            html+= '<div  id="div'+res[key].toString()+'" onmouseover="SelectGroupMouseOver(this.id)" onmouseout="SelectGroupMouseOff(this.id)" onclick = "SelectGroup(this.id)"><label><input class="Step4" id ="group'+res[key].toString()+'" type ="checkbox" name = "SELECT_GROUP_Checkbox"    checked>' +content+"</label></div>";
            }
            else{
                // console.log(option_id,res[key])
                html+= '<div  id="div'+res[key].toString()+'"  onmouseover="SelectGroupMouseOver(this.id)" onmouseout="SelectGroupMouseOff(this.id)" onclick = "SelectGroup(this.id)"><label><input class="Step4" id ="group'+res[key].toString()+'" type ="checkbox" name = "SELECT_GROUP_Checkbox"  >' +content+"</label></div>";
            }
    }
        document.querySelector('#Groupsul').innerHTML= html;
    }
}




function SelectGroupMouseOff(id){
    var newid = "#group"+id.slice(3);
    if (!$( newid).is(":disabled")){
        clearCanvas();
        drawnXY = XY_names['xy'+activate_tab+activate_answer.toString()];
        if (drawnXY.length>2){
            draw_canvas(style="#F0C132",drawnXY);

        }
    }
}

function SelectGroupMouseOver(id){
    var newid = "#group"+id.slice(3)
    clearCanvas();
    if (!$(newid).is(":disabled")){

            let option_id = GetOptionID(newid.slice(1));
            Group.reload(option_id);
            var xy_list = Group.GetXYlist();
            draw_canvas(style="#F0C132",xy_list)
    
        }
            
}
function SelectGroup(clicked_id){
     
    let box_id = '#group'+(clicked_id.slice(-1))+':checkbox'
    clicked_id2= 'group'+(clicked_id.slice(-1))
    if ($(box_id).is(':checked')) {
        
        let option_id = GetOptionID(clicked_id2);
        Group.reload(option_id);
        var xy_list = Group.GetXYlist();
        clickreflesh2(xy_list);
        // console.log("option_id",option_id);
        Group.add(check=true,updateGroup=true,option_id);

        //UNCHECK Cannot Draw; Uncheck Not located. 

        $('#nodraw2').prop("checked", false);
        $('#NotLocatedYet').prop("checked", false);
        $('#LocatedSelectGroup').prop("checked", true);
    }
    else{
        DeleteAllThenInit();
        ControlAnswer();
        ControlNext();
        
    }

}
//group dict: group_id starting from 1. answer_id starting from 0
// outside group dict, answer_id starting from 1
function GetOptionID(clicked_id){
    let option_id = (parseInt(clicked_id.slice(5,6)));
    return option_id    
}






// function InitialBoxes(){
//     incorrectul.innerHTML = '';
//     multisemanul.innerHTML ='';
// }



function find_activate_tab_num(){
    return parseInt(activate_tab.slice(3,5))-1;
}




// function DisplayBoxes(){
//     let activate_tab_num = find_activate_tab_num();
//     for (let i=1;i<QA_names['qa'+activate_tab]["Answer"].length+1;i++ ){
//         if(Incorrect_group[activate_tab_num].indexOf(i)>-1){
//             display_answer=QA_names['qa'+activate_tab]["Answer"][i-1];
//             incorrectul.innerHTML += '<li id = "incorrect'+i.toString()+'">' + display_answer + ' </li>';
//         }
    
//         if(MultiSemantics_group[activate_tab_num].indexOf(i)>-1){
//             display_answer=QA_names['qa'+activate_tab]["Answer"][i-1];
//             multisemanul.innerHTML += '<li id = "multiseman'+i.toString()+'">' + display_answer + ' </li>';

//         }
//     }

           
// }



function removeElement(id) {
    var elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
}


function is_elem_in_box_group(Box_group, activate_tab_num, ele){
    return Box_group[activate_tab_num].indexOf(ele)>-1
}

function answerdisplay_template(id,step,disabledvalue,group,html_id)
{   
    let activate_tab_num = find_activate_tab_num();
    if (step ==false|| disabledvalue==true)
    {  if( document.getElementById(id)){   
            removeElement(id);
            var index =group[activate_tab_num].indexOf(activate_answer);
            if (index > -1) {

                group[activate_tab_num].splice(index, 1);
                }
        }
        else{
        }
        }
    else if (step==true){
        if(is_elem_in_box_group(group,activate_tab_num,activate_answer)){
        }
        else{
            
            changehtml=document.querySelector('#'+html_id+'ul');
            // htmlcontent='<li id = "'+html_id+activate_answer.toString()+'">' + currentanswer + ' <div class="deleteMe">X</div></li>';
            htmlcontent='<li id = "'+html_id+activate_answer.toString()+'">' + currentanswer + '</li>';
            changehtml.innerHTML+= htmlcontent;
            // Delete_Box_Element(group,activate_tab_num,activate_answer)
            
            group[activate_tab_num].push(activate_answer);
    
    
        }

    }

}



function STEP1_answerdisplay()
{   incorrectID = "incorrect"+activate_answer.toString();
    var disabledvalue =$("input[type='radio'][name='INCORRECT_ANSWER']").is(":disabled");
    html_id = "incorrect"
    answerdisplay_template(incorrectID,step1_incorrect.checked,disabledvalue,Incorrect_group,html_id );
    
}

function STEP2_answerdisplay()

{   multisemanID = "multiseman"+activate_answer.toString();
    var disabledvalue =$("input[type='radio'][name='MULTI_FOCUS_DETECT']").is(":disabled");
    html_id='multiseman';
    answerdisplay_template(multisemanID,step2_multi.checked,disabledvalue,MultiSemantics_group,html_id );

}



function STEP2_nodraw_answerdisplay()

{   nodrawID = "cannotdraw"+activate_answer.toString();
    // var disabledvalue =$("#zero_polygon").is(":disabled");
    var disabledvalue =$("input[type='radio'][name='MULTI_FOCUS_DETECT']").is(":disabled");
    html_id='cannotdraw';
    answerdisplay_template(nodrawID,step2_zero.checked,disabledvalue,NoDraw_group,html_id );
    // console.log("1multiseman_group-boxes.js-disabledvalue:",disabledvalue);

}



var Group = new Groups();
var group1 = {}
var group2 = {}
var group3 = {}
var group4 = {}