
var performers = {}
var cell9;
var pArray = [];
var k;
var tex="";
const design_key=0;
var pulllistrows = [];
var pullListRowCount;
var c;
var globalKey;

$(document).ready(function(){

   pageLoad();
       
})

function pageLoad(){
    var firebaseRef = firebase.database().ref();
    firebaseRefEvents = firebase.database().ref("ShopPullList/");
    firebaseRefEvents.on('value', function(snapshot){
         var obj = snapshot.val();
         var shoplist;
      if(snapshot.val()== null){
        console.log("obj is null")
        shoplist = [];
      }
      else{
        shoplist = snapshot.val();
      }
         pulllistrows = shoplist;
     })   

     firebaseRefListCount =  firebase.database().ref("pullListCount/");
     firebaseRefListCount.on('value', function(snapshot){
        pullListRowCount = snapshot.val();
     })
}


function getPerfomers(ind){
    console.log(performers)
    
    key = document.getElementById("mySelect").value;
    var firebaseRef = firebase.database().ref().child("Events/"+key);
    firebaseRef.on('value', function(snapshot){
    
        var obj = snapshot.val();

        var EventPerformers = []
        var EventPerformersNames = []

        for (i = 0; i < obj.Performers.length; i++) { 
            console.log(obj.Performers[i])
            j = obj.Performers[i][1]
            pArray.push(j);
            EventPerformers.push(performers[j])
            EventPerformersNames.push(performers[j].general.Name.First_Name)
        }
        //  console.log(EventPerformers)
        // console.log(EventPerformersNames) 
        console.log(pArray)
        var modelList = document.getElementById("perfoName");
        while (modelList.options.length - 1) {
             modelList.remove(1);
        }
        if (EventPerformersNames) {
            var i;
            for (i = 0; i < EventPerformersNames.length; i++) {
                var perf = new Option(EventPerformersNames[i], i);
                modelList.options.add(perf);
        }
    }
       
    })
    
    
    getTitle()
}

function getName()
{
    var s = document.getElementsByName("names")[0];
    var text = s.options[s.selectedIndex].text;
    console.log(s.selectedIndex)
    k=s.selectedIndex - 1;
    console.log(k)
    document.getElementById("showName").innerHTML = text;
    document.getElementById("perfoName").selectedIndex = "0";
}



function getColor()
{
    var s = document.getElementsByName("colors")[0];
    var text = s.options[s.selectedIndex].text;
    document.getElementById("showcolor").innerHTML = text;
    document.getElementById("showcolor").selectedIndex = "0";
}

function addrow()
{
    var title=document.getElementById("showTitle").innerHTML;
    var show=document.getElementById("showName").innerHTML;
    var color=document.getElementById("showcolor").innerHTML;
    var clothing=document.getElementById("showclothing").innerHTML;
    var charname=document.getElementById("character").innerHTML;
    // var charname=$('#my-contenteditable-div').html();;
    var size=document.getElementById("size").innerHTML;
    var notes=document.getElementById("notes").innerHTML;
    
    //  c=$('#dplist1 tr').length;
    // var table=document.getElementsByName("addHere")[0];
    // var newrow = table.insertRow(c);
    // var cell1=newrow.insertCell(0);
    // var cell2=newrow.insertCell(1);
    // var cell3=newrow.insertCell(2);
    // var cell4=newrow.insertCell(3);
    // var cell5=newrow.insertCell(4);
    // var cell6=newrow.insertCell(5);
    // var cell7=newrow.insertCell(6);
    // var cell8=newrow.insertCell(7);
    // cell9=newrow.insertCell(8);


    if(title==""||show==""||clothing==""||charname==""||size==""||notes=="")
    {
        // alert("Please fill all the fields");
        swal("Fill all the fields", "Make sure the title, cloth, clothing, character name ,size fields and notes are filled");
    }

    else{
        c=$('#dplist1 tr').length;
        var table=document.getElementsByName("addHere")[0];
        var newrow = table.insertRow(c);
        var cell1=newrow.insertCell(0);
        var cell2=newrow.insertCell(1);
        var cell3=newrow.insertCell(2);
        var cell4=newrow.insertCell(3);
        var cell5=newrow.insertCell(4);
        var cell6=newrow.insertCell(5);
        var cell7=newrow.insertCell(6);
        var cell8=newrow.insertCell(7);
        cell9=newrow.insertCell(8);

        cell1.innerHTML=" ";
        cell2.innerHTML=title;
        cell3.innerHTML=show;
        cell4.innerHTML=charname;
        cell5.innerHTML=clothing;
        cell6.innerHTML=color;
        cell7.innerHTML=size;
        cell8.innerHTML=notes;
        //cell9.setAttribute('onclick', 'remove(' + myvalue + ');');
        submit_to_firebase(title,show,color,clothing,charname,size,notes);
                
    }
}


function  submit_to_firebase(title,show,color,clothing,charname,size,notes){
    
    
        pullListRowCount=parseInt(pullListRowCount)+1;
        pulllistrows.push({
    
                row_id:"dp"+pullListRowCount,
                Play_title : title,
                Performer_Name : show,
                Character_Name : charname,
                clothing_Item : clothing,
                color_selected : color,
                Size:size,
                Add_Notes:notes
                
          })
         
          firebase.database().ref().child("ShopPullList/").set(pulllistrows).then(function(){ 
              firebase.database().ref().child("pullListCount/").set(pullListRowCount).then(function(){
                console.log("Added to database");
                location.reload();
              });
           
        });
        }
    
    


function getTitle()
{   
    document.getElementById("showName").innerHTML = "";
    var s = document.getElementsByName('titles')[0];
    var text = s.options[s.selectedIndex].text;
    document.getElementById("showTitle").innerHTML = text;
    document.getElementById("mySelect").selectedIndex = "0";
    return text;
}



function remove(rowkey)
{
    globalKey=parseInt(rowkey);
    console.log(rowkey);
    
var index, table = document.getElementById('dplist1');
for(var i = 1; i < table.rows.length; i++)
{
    table.rows[i].cells[8].onclick = function()
    {
       
        // alert(rowkey);
        // swal("Hello world!");
        // var c = confirm("Are you sure, you want to delete this row from the shop pull list?");
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this row!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })

          .then((willDelete) => {
            if (willDelete) {
                    index = this.parentElement.rowIndex;
                    table.deleteRow(index);
                    console.log("key is " +globalKey);
                    for (j = globalKey; j < pulllistrows.length - 1; j++) {
                        pulllistrows[j] = pulllistrows[j + 1];
                    }
                    pulllistrows.pop();

                    firebase.database().ref().child("ShopPullList/").set(pulllistrows).then(function () {
                        location.reload();
                    });
              swal("The row has been deleted!", {
                timer: 5000,
                icon: "success",
              });
            } 
          });

        // if(c === true)
        // {
        //     index = this.parentElement.rowIndex;
        //     table.deleteRow(index);
        //     console.log("key is " +globalKey);
        //     for (j = globalKey; j < pulllistrows.length - 1; j++) {
        //         pulllistrows[j] = pulllistrows[j + 1];
        //     }
        //     pulllistrows.pop();

        //     firebase.database().ref().child("ShopPullList/").set(pulllistrows).then(function () {
        //         location.reload();
        //     });
        // }   
    };  
}
    return "";
}


var cnt=0;

function removeVisiblity()
{
    cnt=parseInt(cnt)+parseInt(1);
    var count = $('#dplist1 tr').length;
    if(cnt % 2 == 0)
    {
            for(var i=1;i<count;i++){
                document.getElementById("dplist1").rows[i].cells[8].style.visibility="hidden";
            }
    }
    else{
        for(var i=1;i<count;i++){
            document.getElementById("dplist1").rows[i].cells[8].style.visibility="visible";
        }
    }

    if(cnt == 3 ||  cnt == 4)
    {
        cnt=1;
    }
}

function getClothingitem()
    {
        var s = document.getElementsByName("clothing")[0];
        var text = s.options[s.selectedIndex].text;
        tex=getSizes(text);
        document.getElementById("showclothing").innerHTML = text;
        document.getElementById("size").innerHTML = tex;
    }
function getSizes(text)
{
    var res="";
    // if(text=="Dress shirt: Male fit")
    // {
    //     res="Neck: "+performers[k].measurements.neck+"\n"+"CB to wrist: "+performers[k].measurements.centerBackWrist;
    // }

    switch(text)
    {
        //Top measurements
        case "Dress shirt: Male fit":
                    res="Neck: "+performers[k].measurements.neck+"\n"+"CB to wrist: "
                                        +performers[k].measurements.centerBackWrist;
                    break;
        case "Blouse: Female fit":
                    res="Chest: "+performers[k].measurements.chest+"\n"+"CB to wrist: "
                                        +performers[k].measurements.centerBackWrist;
                    break;
        case "Blazer: men's fit":
                    res="Chest: "+performers[k].measurements.chest+"\n"+"CB to wrist: "
                                        +performers[k].measurements.centerBackWrist;
                    break;
        case "Blazer: women's fit":
                    res="Chest: "+performers[k].measurements.chest+"\n"+"CB to wrist: "
                                        +performers[k].measurements.centerBackWrist+"\n"+"Waist: "
                                            +performers[k].measurements.waist;
                    break;
        case "Winter Coat":
                    res="Chest: "+performers[k].measurements.chest;
                    break; 
        case "Trench coat":
                    res="Chest: "+performers[k].measurements.chest;
                    break; 
        case "Tunic":
                    res="Chest: "+performers[k].measurements.chest;
                    break; 
        case "Vest: men's fit":
                    res="Chest: "+performers[k].measurements.chest;
                    break; 
        case "Vest: women's fit":
                    res="Chest: "+performers[k].measurements.chest+"\n"+"Waist: "
                                        +performers[k].measurements.waist;
                    break; 
        case "Sweater: crew neck":
                    res="Chest: "+performers[k].measurements.chest+"\n"+"Actual shirt size: "
                                        +performers[k].general.shirtSize;
                    break;
        case "Sweater: v-neck":
                    res="Chest: "+performers[k].measurements.chest+"\n"+"Actual shirt size: "
                                        +performers[k].general.shirtSize;
                    break;
        case "Sweater: cardigan":
                    res="Chest: "+performers[k].measurements.chest+"\n"+"Actual shirt size: "
                                        +performers[k].general.shirtSize;
                    break;
        case "Tshirt: Plain":
                    res="Actual shirt size: "+performers[k].general.shirtSize;
                    break;
        case "Tshirt: screen print":
                    res="Actual shirt size: "+performers[k].general.shirtSize;
                    break;
        case "Knit top: short sleeve":
                    res="Actual shirt size: "+performers[k].general.shirtSize;
                    break;
        case "Tank top":
                    res="Actual shirt size: "+performers[k].general.shirtSize;
                    break;
        case "Knit top: long sleeve":
                    res="Actual shirt size: "+performers[k].general.shirtSize;
                    break;
        case "Knit top: casual":
                    res="Actual shirt size: "+performers[k].general.shirtSize;
                    break;
        case "Knit top: dressy":
                    res="Actual shirt size: "+performers[k].general.shirtSize;
                    break;
        case "Thermal shirt":
                    res="Actual shirt size: "+performers[k].general.shirtSize;
                    break;
        case "Western shirt":
                    res="Neck: "+performers[k].measurements.neck+"\n"+"CB to wrist: "
                                        +performers[k].measurements.centerBackWrist;
                    break;
        case "Flannel shirt":
                    res="Neck: "+performers[k].measurements.neck+"\n"+"CB to wrist: "
                                        +performers[k].measurements.centerBackWrist;
                    break;
        case "Smoking jacket":
                    res="Chest: "+performers[k].measurements.chest+"\n"+"Waist: "
                                        +performers[k].measurements.centerBackWrist;
                    break;  
                    
        //Botttom measurements

        case "Jeans: Female fit":
                    res="Waist: "+performers[k].measurements.waist+"\n"+"Hip: "
                                        +performers[k].measurements.hip+"\n"+"Inseam: "
                                        +performers[k].measurements.inseam;
                    break;
        case "Jeans: Male fit":
                    res="Waist: "+performers[k].measurements.waist+"\n"+"Inseam: "
                                        +performers[k].measurements.inseam;
                    break;
        case "Khakis: Female fit":
                    res="Waist: "+performers[k].measurements.waist+"\n"+"Hip: "
                                        +performers[k].measurements.hip+"\n"+"Inseam: "
                                        +performers[k].measurements.inseam;
                    break;
        case "Khakis: Male fit":
                    res="Waist: "+performers[k].measurements.waist+"\n"+"Inseam: "
                                        +performers[k].measurements.inseam;
                    break;
        case "Dress Slacks: Female fit":
                    res="Waist: "+performers[k].measurements.waist+"\n"+"Hip: "
                                        +performers[k].measurements.hip+"\n"+"Inseam: "
                                        +performers[k].measurements.inseam;
                    break;
        case "Dress Slacks: Male fit":
                    res="Waist: "+performers[k].measurements.waist+"\n"+"Inseam: "
                                        +performers[k].measurements.inseam;
                    break;
        case "Pants: Other style":
                    res="Waist: "+performers[k].measurements.waist+"\n"+"Inseam: "
                                        +performers[k].measurements.inseam;
                    break;
        case "Skirt: short":
                    res="Waist: "+performers[k].measurements.waist;
                    break;
        case "Skirt: knee-length":
                    res="Waist: "+performers[k].measurements.waist;
                    break;
        case "Skirt: long":
                    res="Waist: "+performers[k].measurements.waist;
                    break;
        case "Skirt":
                    res="Waist: "+performers[k].measurements.waist;
                    break;
        case "Shorts: men's fit":
                    res="Waist: "+performers[k].measurements.waist;
                    break;
        case "Shorts: women's fit":
                    res="Waist: "+performers[k].measurements.waist;
                    break;
        case "Leggings":
                    res="Waist: "+performers[k].measurements.waist;
                    break;
        case "Track Pants":
                    res="Waist: "+performers[k].measurements.waist;
                    break;
        case "Stretch Pants":
                    res="Waist: "+performers[k].measurements.waist;
                    break;

        // Set measurements

        case "Tuxedo jacket":
                    res="Chest: "+performers[k].measurements.chest+"\n"+"CB to wrist: "
                                        +performers[k].measurements.centerBackWrist;
                    break;
        case "Tuxedo shirt":
                    res="Waist: "+performers[k].measurements.waist+
                            "Chest: "+performers[k].measurements.chest+"\n"+"CB to wrist: "
                                        +performers[k].measurements.centerBackWrist;
                    break;
        case "Tuxedo pants":
                    res="Waist: "+performers[k].measurements.waist+"\n"+"Inseam: "
                                        +performers[k].measurements.inseam;
                    break;
        case "Dress: long":
                    res="Chest: "+performers[k].measurements.chest+"\n"+"Waist: "
                                        +performers[k].measurements.centerBackWrist+"\n"+"Hip: "
                                        +performers[k].measurements.hip;
                    break;
        case "Dress: mid-length":
                    res="Chest: "+performers[k].measurements.chest+"\n"+"Waist: "
                                        +performers[k].measurements.centerBackWrist+"\n"+"Hip: "
                                        +performers[k].measurements.hip;
                    break;
        case "Dress: short":
                    res="Chest: "+performers[k].measurements.chest+"\n"+"Waist: "
                                        +performers[k].measurements.centerBackWrist+"\n"+"Hip: "
                                        +performers[k].measurements.hip;
                    break;
        case "Nightgown":
                    res="Chest: "+performers[k].measurements.chest+"\n";
                    break;
        case "Suit: 2 piece":
                    res="Chest: "+performers[k].measurements.chest+"\n"+"Waist: "
                                        +performers[k].measurements.centerBackWrist+"\n"+"Inseam: "
                                        +performers[k].measurements.inseam;
                    break;
        case "Suit: 3 piece":
                    res="Chest: "+performers[k].measurements.chest+"\n"+"Waist: "
                                        +performers[k].measurements.centerBackWrist+"\n"+"Inseam: "
                                        +performers[k].measurements.inseam;
                    break;
        case "Suit: skirt suit":
                    res="Chest: "+performers[k].measurements.chest+"\n"+"Waist: "
                                        +performers[k].measurements.centerBackWrist+"\n";
                    break;

        // Under measurements
        case "Undershirt: Vneck Tshirt":
                    res="Actual shirt size: "+performers[k].general.shirtSize;
                    break; 
        case "Undershirt: Tank top":
                    res="Actual shirt size: "+performers[k].general.shirtSize;
                    break;
        case "Tights":
                    res="Waist: "+performers[k].measurements.waist+
                            "Full girth: "+performers[k].measurements.fullGirth+"\n"+"Height: "
                                        +performers[k].measurements.height+"\n"+"Weight: "
                                        +performers[k].measurements.weight;
                    break;
        case "Pantyhouse":
                    res="Waist: "+performers[k].measurements.waist+
                            "Full girth: "+performers[k].measurements.fullGirth+"\n"+"Height: "
                                        +performers[k].measurements.height+"\n"+"Weight: "
                                        +performers[k].measurements.weight;
                    break;
        case "Leotard":
                    res="Waist: "+performers[k].measurements.waist+
                            "Full girth: "+performers[k].measurements.fullGirth+"\n"+"Height: "
                                        +performers[k].measurements.height+"\n"+"Weight: "
                                        +performers[k].measurements.weight;
                    break; 
        case "Unitard":
                    res="Waist: "+performers[k].measurements.waist+
                            "Full girth: "+performers[k].measurements.fullGirth+"\n"+"Height: "
                                        +performers[k].measurements.height+"\n"+"Weight: "
                                        +performers[k].measurements.weight;
                    break;
        case "Undergarment: Full slip":
                    res="Chest: "+performers[k].measurements.chest+"\n"+"Waist: "
                                        +performers[k].measurements.waist;
                    break;
        case "Undergarment: Half slip":
                    res="Chest: "+performers[k].measurements.chest+"\n"+"Waist: "
                                        +performers[k].measurements.waist;
                    break;
        
        //Shoe sizes
        case "Shoes: dress shoes men's fit":
        case "Shoes: dress shoes women's fit":
        case "Shoes: athletic shoes men's fit":
        case "Shoes: athletic shoes women's fit":
        case "Shoes: flats":
        case "Shoes: heels":
        case "Shoes: dress boots":
        case "Shoes: western boots":
        case "Shoes: work boots":
        case "Shoes: casual men's fit":
        case "Shoes: casual women's fit":
        case "Slippers: men's fit":
        case "Slippers: women's fit":
        case "Dance shoes: character shoes women's fit":
        case "Dance shoes: character shoes men's fit":
        case "Dance shoes: jazz slippers":
        case "Dance shoes: ballet slippers":
        case "Dance shoes: tap shoes men's fit":
        case "Dance shoes: tap shoes women's fit":
        case "Dance shoes: dance sandals":
        case "Shoes: china flats":
        case "Shoes: sandals":
                    res="Actor shoe size: "+performers[k].measurements.shoeSize+"\n";
                    break;

        //Hat measurments

        case "Hat: winter":
        case "Hat: dress":
        case "Hat: baseball cap":
        case "Hat: newsboy":
        case "Hat: other":
                    res="Head Circumference: "+performers[k].measurements.headCircumference+"\n";                           +performers[k].measurements.waist;
                    break;

    }


    return res;
}
