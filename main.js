// let wayOfDisplayTime;
let isDetailTime;
let taskNumber;
let taskInfoObjArray;
let doneTaskArray = [];
let appMsg;

// // toggle time display
// let displayTimeRadioArray = document.querySelectorAll('.display-time-radio input');
// displayTimeRadioArray.forEach(element=>element.addEventListener('click', handleTimeDisplay));
// function handleTimeDisplay(e){
//     let containerInsideArray = document.querySelectorAll('.grid-container-cal');
//     if(e.target.value === 'auto'){
//         wayOfDisplayTime = 'auto';
//         containerInsideArray.forEach(element => element.addEventListener('mouseover', displayTime));
//         containerInsideArray.forEach(element => element.addEventListener('mouseleave', hideTime));
//     }else if(e.target.value === 'show'){
//         wayOfDisplayTime = 'show';
//         containerInsideArray.forEach(element => element.removeEventListener('mouseover', displayTime));
//         containerInsideArray.forEach(element => element.removeEventListener('mouseleave', hideTime));
//         displayTime();
//     }else if(e.target.value === 'hide'){
//         wayOfDisplayTime = 'hide';
//         containerInsideArray.forEach(element => element.removeEventListener('mouseover', displayTime));
//         containerInsideArray.forEach(element => element.removeEventListener('mouseleave', hideTime));
//         hideTime();
//     }
// }
// function autoDisplayTime(){
//     let containerInsideArray = document.querySelectorAll('.grid-container-cal');          //
//     containerInsideArray.forEach(element => element.addEventListener('mouseover', displayTime));    //
//     containerInsideArray.forEach(element => element.addEventListener('mouseleave', hideTime));      // default as auto
// }
// function displayTime(){
//     let timeArray = document.querySelectorAll('.time');
//     timeArray.forEach(
//         function(element){
//             element.style.display = 'block';
//         }
//     );
// }
// function hideTime(){
//     let timeArray = document.querySelectorAll('.time');
//     timeArray.forEach(
//         function(element){
//             element.style.display = 'none';
//         }
//     );
// }
// function toggleToCurrentTimeDisplay(){
//     if(wayOfDisplayTime === 'auto'){
//         autoDisplayTime();
//     }else if(wayOfDisplayTime === 'show'){
//         displayTime();
//     }else if(wayOfDisplayTime === 'hide'){
//         hideTime();
//     }
// }

// toggle detail time
let detailTimeRadioArray = document.querySelectorAll('.detail-time-radio input');
detailTimeRadioArray.forEach(element=>element.addEventListener('click', toggleDetailTimeDisplay));
function toggleDetailTimeDisplay(e){
    if(e.target.value ===  'yes'){
        isDetailTime = true;
        removeCalendar();
        calendarGenerator();
        // toggleToCurrentTimeDisplay();
        addDropzoneListener();
        for(let i = 0; i < taskNumber; i++){
            let div = createTask(taskInfoObjArray[i], 'old', 'cal');
            appendTaskToCalendar(taskInfoObjArray[i], div);
            addDragListener(div);
        }
        addTaskClickDoneListener('old', 'cal');
        resequence();
        if(doneTaskArray.length > 0) revertTaskStatus();
    }else if(e.target.value === 'no'){
        isDetailTime = false;
        removeCalendar()
        calendarGenerator();
        // toggleToCurrentTimeDisplay();
        addDropzoneListener();
        for(let i = 0; i < taskNumber; i++){
            let div = createTask(taskInfoObjArray[i], 'old', 'cal');
            appendTaskToCalendar(taskInfoObjArray[i], div);
            addDragListener(div);
        }
        addTaskClickDoneListener('old', 'cal');
        resequence();
        if(doneTaskArray.length > 0) revertTaskStatus();
    }
}

//change the id of all tasks from calendar, list and done list
function resequence(){

    let elementTaskArray = document.querySelectorAll('div[id*="-dropzone-"] div[id*="task"]');
    let oldRef = new Array(elementTaskArray.length);
    let newRef = new Array(elementTaskArray.length);
    let matchedIndexArray = new Array(doneTaskArray.length);
    
    //get the sequence of adding -- task                                
    let elementTaskArrayInSequence = new Array(elementTaskArray.length);
    for(let j = 0; j < taskInfoObjArray.length - 1; j++){
        for(let i = 0; i < elementTaskArray.length; i++){
            if(taskInfoObjArray[j].taskId == parseInt(elementTaskArray[i].id.substring(4))){
                elementTaskArrayInSequence[j] = elementTaskArray[i];
                continue;
            }
        }
    }

    //get the match table for done task list
    if(doneTaskArray.length > 0){
        for(let i = 0; i < elementTaskArrayInSequence.length; i++){
            oldRef[i] = elementTaskArrayInSequence[i].id.substring(4);
        }
        for(let i = 0; i < doneTaskArray.length; i++){
            matchedIndexArray[i] = oldRef.indexOf(doneTaskArray[i]);
        }
    }

    //resequence task id of tasks on calendar
    for(let i = 0; i < elementTaskArrayInSequence.length; i++){
        elementTaskArrayInSequence[i].removeAttribute('id');
        let id = document.createAttribute('id');
        id.value = 'task' + i;
        elementTaskArrayInSequence[i].setAttributeNode(id);
    }

    
    let elementTaskListArray = document.querySelectorAll('div[id*="list-task"]');
    //get the sequence of adding -- task list                              
    let elementTaskListArrayInSequence = new Array(elementTaskArray.length);
    for(let j = 0; j < taskInfoObjArray.length - 1; j++){
        for(let i = 0; i < elementTaskListArray.length; i++){
            if(taskInfoObjArray[j].taskId == parseInt(elementTaskListArray[i].id.substring(9))){
                elementTaskListArrayInSequence[j] = elementTaskListArray[i];
                continue;
            }
        }
    }
    //resequence task id of tasks on list
    for(let i = 0; i < elementTaskListArrayInSequence.length; i++){
        elementTaskListArrayInSequence[i].removeAttribute('id');
        let id = document.createAttribute('id');
        id.value = 'list-task' + i;
        elementTaskListArrayInSequence[i].setAttributeNode(id);
    }
    
    if(doneTaskArray.length > 0){
        let elementDoneTaskArray = document.querySelectorAll('#done-list div[id*=done-task]');
        //get new sequence array for done task list
        for(let i = 0; i < elementTaskArrayInSequence.length; i++){
            newRef[i] = elementTaskArrayInSequence[i].id.substring(4);
        }
        //resequence done task list
        for(let i = 0; i < doneTaskArray.length; i++){
            elementDoneTaskArray[i].removeAttribute('id');
            let id = document.createAttribute('id');
            id.value = 'done-task' + newRef[matchedIndexArray[i]];
            elementDoneTaskArray[i].setAttributeNode(id);
        }
    }
    //global array resequence
    for(let i = 0; i < doneTaskArray.length; i++){
        doneTaskArray[i] = matchedIndexArray[i].toString();
    }
    for(let i = 0; i < taskInfoObjArray.length - 1; i++){
        taskInfoObjArray[i].taskId = i;
    }
    console.log('----------');
}


function revertTaskStatus(){
    for(let i = 0; i < doneTaskArray.length; i++){
        let selectedTask = document.querySelector('#task' + doneTaskArray[i]);
        selectedTask.style.backgroundColor = 'grey';
        selectedTask.style.color = 'white';
        selectedTask.style.textDecoration = 'line-through';
    }
}

function removeCalendar(){
    let dayArray = dayArrayGenerator('id');
    for(let i = 0; i < dayArray.length; i++){
        let cellArray = document.querySelectorAll('.grid-container-cal div[id*="-dropzone-"]');
        let timeCellArray = document.querySelectorAll('.grid-container-cal div[id*="am"]');
        timeCellArray.forEach(element=>element.remove());
        timeCellArray = document.querySelectorAll('.grid-container-cal div[id*="pm"]');
        timeCellArray.forEach(element=>element.remove());
        cellArray.forEach(element=>element.remove());
    }
}


// generate the calendar
function calLayoutGenerator(){
    let timeArrayId = timeArrayGenerator('id');
    let timeArrayWord = timeArrayGenerator('word');
    let dayArrayId = dayArrayGenerator('id');
    let dayArrayWord = dayArrayGenerator('word');
    
    let step;
    let stepIndex = 0;
    let rowTacker = 0;
    if(isDetailTime){
        step = 1;
        //not detail
        for(let i = 0; i < 8*24; i+=1){
            let gridContainer = document.querySelector('.grid-container-cal');
            if(i % 8 == 0){
                let div = document.createElement('div');
                let divClass = document.createAttribute('class');
                let divId = document.createAttribute('id');
                divClass.value = 'grid-item-cal time-header';
                divId.value = timeArrayId[stepIndex];
                div.setAttributeNode(divClass);
                div.setAttributeNode(divId);
                div.innerHTML = timeArrayWord[stepIndex];
                stepIndex += step;
                gridContainer.appendChild(div);
                rowTacker++;
            }else {
                let div = document.createElement('div');
                let divId = document.createAttribute('id');
                let divClass = document.createAttribute('class');
                divClass.value = 'grid-item-cal';
                divId.value = dayArrayId[(i-rowTacker) % 7] + '-dropzone-' + timeArrayId[rowTacker-1];
                div.setAttributeNode(divClass);
                div.setAttributeNode(divId);
                gridContainer.appendChild(div);
            }
        }
    }else{
        step = 12;
        //not detail
        for(let i = 0; i < 16; i+=1){
            let gridContainer = document.querySelector('.grid-container-cal');
            if(i % 8 == 0){
                let div = document.createElement('div');
                let divClass = document.createAttribute('class');
                let divId = document.createAttribute('id');
                divClass.value = 'grid-item-cal time-header';
                divId.value = timeArrayId[stepIndex];
                div.setAttributeNode(divClass);
                div.setAttributeNode(divId);
                div.innerHTML = timeArrayWord[stepIndex];
                stepIndex += step;
                gridContainer.appendChild(div);
                rowTacker++;
            }else {
                let div = document.createElement('div');
                let divId = document.createAttribute('id');
                let divClass = document.createAttribute('class');
                divClass.value = 'grid-item-cal';
                let timeValue = document.querySelectorAll('.time-header')[rowTacker-1].id;
                timeValue = timeValue.substring(0, timeValue.length - 2);
                divId.value = dayArrayId[(i-rowTacker) % 7] + '-dropzone-' + timeArrayId[timeValue];
                div.setAttributeNode(divClass);
                div.setAttributeNode(divId);
                gridContainer.appendChild(div);
            }
        }
    }

    for(let i = 0; i < dayArrayWord.length; i++){
        let weekdayHeaderArray = document.querySelectorAll('.weekday-header');
        weekdayHeaderArray[i].innerText = dayArrayWord[i];
    }

}
function timeArrayGenerator(option){
    let timeArray = new Array(24);
    if(option === 'id'){
        for(let i = 0; i < 12; i++){
            timeArray[i] = i + 'am';
        }
        timeArray[12] = '12pm';
        for(let i = 13; i < 24; i++){
            timeArray[i] = (i-12) + 'pm';
        }
    }else if(option === 'word'){
        for(let i = 0; i < 12; i++){
            timeArray[i] = i + ' am';
        }
        timeArray[12] = '12 pm';
        for(let i = 13; i < 24; i++){
            timeArray[i] = (i-12) + ' pm';
        }
    }
    return timeArray;
}
function dayArrayGenerator(option){
    let dayArray = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    if(option === 'id'){
        return dayArray;
    }else if(option === 'word'){
        for(let i = 0; i < dayArray.length; i++){
            dayArray[i] = dayArray[i].charAt(0).toUpperCase() + dayArray[i].substring(1);
        }
        return dayArray;
    }
}
function calendarGenerator(){
    let dayArray = dayArrayGenerator('id');
    let dayWordArray = dayArrayGenerator('word');
    for(let i = 0; i < dayArray.length; i++){
        let div = document.createElement('div');
        let divAtr = document.createAttribute('class');
        divAtr.value = 'grid-item-cal';
        div.setAttributeNode(divAtr);
        div.innerText = dayWordArray[i];
        document.querySelector('#' + dayArray[i]).appendChild(div);
    }
    calLayoutGenerator();
}


// register drop event listener for all dropzones within calendar
function addDropzoneListener(){
    let dayArray = dayArrayGenerator('id');
    let timeArray = timeArrayGenerator('id');
    let step;
    if(isDetailTime){
        step = 1;
    }else{
        step = 12;
    }
    for(let j = 0; j < dayArray.length; j++){
        for(let i = 0; i < timeArray.length; i += step){
            let id = document.querySelector('#' + dayArray[j]  + '-dropzone-' +  timeArray[i]);
            id.addEventListener('dragover', dragOver);
            id.addEventListener('drop', drop);
            id.addEventListener('dragleave', dragLeave);
        }
    }
    function dragLeave(e){
        e.stopPropagation();
        revertDropzoneStyleByElement(e.target);
    }
    function dragOver(e){
        e.preventDefault();
        e.stopPropagation();
        e.target.style.backgroundColor = 'purple';
        console.log(e.target.id + ' dragOver');
    }
    function drop(e){
        e.preventDefault();
        e.stopPropagation();
        let data = e.dataTransfer.getData("text");
        console.log(data + ' drops');
        console.log(e.target.id + ' get dropped');
        let childElement = document.getElementById(data);
        childElement.style.backgroundColor = '';
        childElement.style.color = '';

        let newDate = e.target.id.split("-")[0];
        let newTimeWithNoon = e.target.id.split("-")[2];
        let newTime = newTimeWithNoon.substring(0, newTimeWithNoon.length - 2);
        let newAmOrPm = newTimeWithNoon.slice(-2);
        for(let i = 0; i < taskInfoObjArray.length - 1; i++){
            if(data.substring(4) == taskInfoObjArray[i].taskId.toString()){
                taskInfoObjArray[i].date = newDate;
                taskInfoObjArray[i].time = newTime;
                taskInfoObjArray[i].amOrPm = newAmOrPm;
                break;
            }
        }

        e.target.appendChild(childElement);
        revertTaskStatus();
        ensureOriginalDropzoneStyleErasure(originalDropzone);
        revertDropzoneStyleByElement(e.target);
    }
}

function stopChildDragDropPropogate(div){
        div.addEventListener('dragover', (e)=>{e.stopPropagation();});
        div.addEventListener('drop', (e)=>{e.stopPropagation();});
        div.addEventListener('dragleave', (e)=>{e.stopPropagation();});
}


// register drag event listener for dragged items
let originalDropzone;
function addDragListener(div){
    div.addEventListener('dragstart', dragStart);
    function dragStart(e){
        e.stopPropagation();
        e.target.style.backgroundColor = 'purple';
        e.target.style.color = 'white';
        e.dataTransfer.setData("text", e.target.id);
        originalDropzone = e.target.parentElement;
        console.log(e.target.id + ' dragged');
    }
}

function ensureOriginalDropzoneStyleErasure(originalDropzone){
    revertDropzoneStyleByElement(originalDropzone);
}
function revertDropzoneStyleByElement(element){
    element.style.backgroundColor = '';
}


// getting data from form. create and append the task to the datetime
function getFormData(e){
    e.preventDefault();
    let task = document.querySelector('#task-input').value;
    let time = document.querySelector('#task-time').value;
    taskInfoObjArray[taskNumber]['taskId'] = taskNumber;
    taskInfoObjArray[taskNumber]['task'] = task;
    taskInfoObjArray[taskNumber]['date'] = selectedDay;
    taskInfoObjArray[taskNumber]['time'] = time;
    taskInfoObjArray[taskNumber]['amOrPm'] = amOrPm;
    taskInfoObjArray[taskNumber]['done'] = false;
    return taskInfoObjArray[taskNumber];
}

function verifyForm(){

    let isVerifiedSucceeded = true;
    let taskName = document.querySelector('#task-submit #task-input');
    let taskTime = document.querySelector('#task-submit #task-time');

    if(taskName.value == ''){
        appMsg = appMsg.concat('- Task item name cannot be empty!</br>');
        isVerifiedSucceeded = false;
    }

    // regular expression for matchin single digit
    if(taskTime.value == ''){
        appMsg = appMsg.concat('- Please specify the task time!</br>');
        isVerifiedSucceeded = false;
    }
    if(taskTime.value != ''){
        if(!/^[0-9]{1}$/.test(taskTime.value) && !/^[0-9]{2}$/.test(taskTime.value)){
            appMsg = appMsg.concat('- Please enter a number (digit(s) only) to specify the time!</br>');
            isVerifiedSucceeded = false;
        }
        if(parseInt(taskTime.value) < 0 || parseInt(taskTime.value) > 12 ){
            appMsg = appMsg.concat('- Please keep the time in range 0 - 12!</br>');
            isVerifiedSucceeded = false;
        }
    }


    if(selectedDay == 'day'){
        appMsg = appMsg.concat('- Please specify the date!</br>')
        isVerifiedSucceeded = false;
    }

    if(isVerifiedSucceeded == false){
        document.querySelector('#appMsg').innerHTML = appMsg;
        appMsg = '';
    }

    return isVerifiedSucceeded;

}

function formSubmit(e){     // event listener
    if(verifyForm()){
        document.querySelector('#appMsg').innerHTML = '';
        let div = createTask(getFormData(e), 'new', 'cal');
        appendTaskToCalendar(taskInfoObjArray[taskNumber-1], div);
        addDragListener(div);
        // The following line is somehow error.
        // appendTaskToCalendar(taskInfoObjArray[taskNumber-1], createTask(getFormData(e)));
        let divList = createTask(taskInfoObjArray[taskNumber-1], 'old', 'list');
        appendTaskToTaskList(divList);
        addTaskAndTaskListListener(divList.parentElement);
        let deleteButton = divList.nextElementSibling;
        deleteButton.addEventListener('click', deleteButtonHandler);
        deleteButton.addEventListener('mouseover', deleteButtonHoverHandler);
        deleteButton.addEventListener('mouseleave', deleteButtonMouseLeaveHandler);
        addTaskClickDoneListener('new', 'cal');
        addTaskClickDoneListener('new', 'list');
    }
}

function initialize(){
    wayOfDisplayTime = 'auto';
    isDetailTime = false;
    appMsg = '';
    
    calendarGenerator();
    addDropzoneListener();
    // toggleToCurrentTimeDisplay();
    let form = document.querySelector('#submit-task');
    form.addEventListener('click', formSubmit);

    //check whether there is any data within localStorage, if so use it
    if(localStorage.getItem('taskNumber') != null && localStorage.getItem('taskInfoObjArray') != null){
        taskNumber = JSON.parse(localStorage.getItem('taskNumber'));
        taskInfoObjArray = JSON.parse(localStorage.getItem('taskInfoObjArray'));

        //repopulate calendar
        for(let i = 0; i < taskNumber; i++){
            let div = createTask(taskInfoObjArray[i], 'old', 'cal');
            appendTaskToCalendar(taskInfoObjArray[i], div);
            addDragListener(div);
        }
        addTaskClickDoneListener('old', 'cal');

        //repopulate task list
        for(let i = 0; i < taskNumber; i++){
            let divList = createTask(taskInfoObjArray[i], 'old', 'list');
            appendTaskToTaskList(divList);

            addTaskAndTaskListListener(divList.parentElement);
            let deleteButton = divList.nextElementSibling;
            deleteButton.addEventListener('click', deleteButtonHandler);
            deleteButton.addEventListener('mouseover', deleteButtonHoverHandler);
            deleteButton.addEventListener('mouseleave', deleteButtonMouseLeaveHandler);
        }
        addTaskClickDoneListener('old', 'list');
        revertTaskListClickedDoneStatus();


        //repopulate done task list
        for(let i = 0; i < taskNumber; i++){
            if(taskInfoObjArray[i].done == true){
                taskInfoObjArrayWithTaskNumber = taskInfoObjArray[i];
                let div = createTask(taskInfoObjArrayWithTaskNumber, 'old', 'done');
                appendTaskToDoneList(div);
            }
        }
        doneTaskArray  = JSON.parse(localStorage.getItem('doneTaskArray'));
        if(doneTaskArray != null && doneTaskArray.length > 0) revertTaskStatus();

    }else {
        taskNumber = 0;
        taskInfoObjArray = [{}];
        doneTaskArray = [];
    }
    
    window.onbeforeunload = e => {
        localStorage.setItem('taskNumber', JSON.stringify(taskNumber));
        localStorage.setItem('taskInfoObjArray', JSON.stringify(taskInfoObjArray));
        localStorage.setItem('doneTaskArray', JSON.stringify(doneTaskArray));
    };
    
}

function revertTaskListClickedDoneStatus(){
    for(let i = 0; i < taskNumber; i++){
        if(taskInfoObjArray[i].done == true){
            let listTask = document.querySelector('#list-task' + i);
            listTask.style.backgroundColor = 'grey';
            listTask.style.color = 'white';
            listTask.style.textAlign = 'center';
            listTask.style.textDecoration = 'line-through';
        }
    }
}

// create task
function createTask(taskInfoObjArrayWithTaskNumber, newOrOld, type){
    let div = document.createElement('div');
    let divId = document.createAttribute('id');
    let draggable = document.createAttribute('draggable');
    draggable.value = true;
    div.setAttributeNode(divId);
    div.setAttributeNode(draggable);
    div.innerText = taskInfoObjArrayWithTaskNumber.task;
    if(type === 'cal'){
        if(newOrOld === 'new'){
            divId.value = 'task' + taskNumber;
            taskInfoObjArray.push({});
            taskNumber++;
        }else if(newOrOld === 'old'){
            divId.value = 'task' + taskInfoObjArrayWithTaskNumber.taskId;
        }
    }else if(type === 'list'){
        if(newOrOld === 'new'){
            divId.value = 'list-task' + taskNumber;
        }else if(newOrOld === 'old'){
            let listTaskClass = document.createAttribute('class');
            listTaskClass.value = 'list-task-item-content';
            div.setAttributeNode(listTaskClass);
            div.draggable = false;
            divId.value = 'list-task' + taskInfoObjArrayWithTaskNumber.taskId;
        }
    }else if(type === 'done'){
        div.removeAttributeNode(draggable);
        divId.value = 'done-task' + taskInfoObjArrayWithTaskNumber.taskId;
    }
    stopChildDragDropPropogate(div);
    return div;
}
// append task to calenedar
function appendTaskToCalendar(taskInfoObjArrayWithTaskNumber, div){
    if(isDetailTime){
        let targetDropzone = document.querySelector('#' + taskInfoObjArrayWithTaskNumber.date + '-dropzone-' + taskInfoObjArrayWithTaskNumber.time + taskInfoObjArrayWithTaskNumber.amOrPm);
        targetDropzone.appendChild(div);
    }else if(!isDetailTime){
        let targetTime;
        if(taskInfoObjArrayWithTaskNumber.amOrPm === 'am'){
            targetTime = 0;
        }else if(taskInfoObjArrayWithTaskNumber.amOrPm === 'pm'){
            targetTime = 12;
        }
        let targetDropzone = document.querySelector('#' + taskInfoObjArrayWithTaskNumber.date + '-dropzone-' + targetTime + taskInfoObjArrayWithTaskNumber.amOrPm);
        targetDropzone.appendChild(div);
    }
}

function appendTaskToTaskList(divList){

    //create task list item div
    let divItem = document.createElement('div');
    let id = document.createAttribute('id');
    let taskListClass = document.createAttribute('class');
    id.value = 'li-' + (taskNumber - 1);
    taskListClass.value = 'container-list-task';
    divItem.setAttributeNode(id);
    divItem.setAttributeNode(taskListClass);

    //create delete button div
    let divDelete = document.createElement('div');
    let deleteClassAtr = document.createAttribute('class');
    deleteClassAtr.value = 'deleteButton list-task-item';
    divDelete.setAttributeNode(deleteClassAtr);
    divDelete.innerText = 'X';

    //create drag img
    let imgDrag = document.createElement('img');
    let src = document.createAttribute('src');
    let imgWidthAtr = document.createAttribute('width');
    let imgHeightAtr = document.createAttribute('height');
    let dragClassAtr = document.createAttribute('class');
    src.value = 'move-button.svg';
    imgWidthAtr.value = '24';
    imgHeightAtr.value = '17';
    dragClassAtr.value = 'dragButton list-task-item';
    imgDrag.setAttributeNode(src);
    imgDrag.setAttributeNode(imgWidthAtr);
    imgDrag.setAttributeNode(imgHeightAtr);
    imgDrag.setAttributeNode(dragClassAtr);
    imgDrag.addEventListener('mouseover', moveButtonHoverHandler);
    imgDrag.addEventListener('mouseleave', moveButtonMouseLeaveHandler);


    divItem.appendChild(imgDrag);
    divItem.appendChild(divList);
    divItem.appendChild(divDelete);
    imgDrag.draggable = true;
    document.querySelector('#task-list').appendChild(divItem);
}

function appendTaskToDoneList(divList){
    let li = document.createElement('li');
    let id = document.createAttribute('id');
    doneTaskArray.push(divList.id.substring(9));
    li.setAttributeNode(id);

    //create drag img
    let imgDone = document.createElement('img');
    let src = document.createAttribute('src');
    let imgWidthAtr = document.createAttribute('width');
    let imgHeightAtr = document.createAttribute('height');
    let dragClassAtr = document.createAttribute('class');
    src.value = 'done-marker.svg';
    imgWidthAtr.value = '24';
    imgHeightAtr.value = '19';
    dragClassAtr.value = 'done-marker';
    imgDone.setAttributeNode(src);
    imgDone.setAttributeNode(imgWidthAtr);
    imgDone.setAttributeNode(imgHeightAtr);
    imgDone.setAttributeNode(dragClassAtr);

    li.appendChild(imgDone);
    li.appendChild(divList);

    // //create delete button
    // let divDelete = document.createElement('div');
    // let classAtr = document.createAttribute('class');
    // classAtr.value = 'deleteButton';
    // divDelete.setAttributeNode(classAtr);
    // divDelete.innerText = 'X';

    // divList.appendChild(divDelete);
    document.querySelector('#done-list').appendChild(li);
}

function moveButtonHoverHandler(e){
    e.target.style.cursor = 'grab';
    e.target.style.borderRadius = '10px'
    e.target.style.backgroundColor = '#80a8c5'
    e.target.style.boxShadow = '2px 2px 2px grey';
}
function moveButtonMouseLeaveHandler(e){
    e.target.style.cursor = '';
    e.target.style.borderRadius = '0px'
    e.target.style.backgroundColor = ''
    e.target.style.boxShadow = '';
}
function deleteButtonHoverHandler(e){
    e.stopPropagation();
    e.target.style.backgroundColor = '#B50717';
    e.target.style.color = 'white';
    e.target.style.cursor = 'pointer';
    // e.target.style.borderRadius = '50px';
    e.target.style.boxShadow = '2px 2px 2px grey';
}
function deleteButtonMouseLeaveHandler(e){
    e.stopPropagation();
    e.target.style.backgroundColor = '';
    e.target.style.color = 'black';
    e.target.style.cursor = '';
    e.target.style.boxShadow = '';
}
function deleteButtonHandler(e){
        e.stopPropagation();
        // js sound effect ------------
        const audioElement = document.querySelector('audio[id="audio-trash"]');
        audioElement.play();
        // ----------------------------
        e.target.parentElement.remove();  //remove task list item
        let removedIdStr = e.target.parentElement.firstElementChild.nextElementSibling.id.substring(9);
        for(let i = 0; i < doneTaskArray.length; i++){
            if(removedIdStr == doneTaskArray[i]){
                document.querySelector('#done-task' + removedIdStr).parentElement.remove();    //remove done list item
                doneTaskArray.splice(doneTaskArray.indexOf(removedIdStr) ,1)  //remove done task array item
            }
        }

        document.querySelector('#task' + removedIdStr).remove();  //remove task calendar item

        let searchedIndexForRemoving;                   //remove task array item
        for(let i = 0; i < taskNumber; i++){
            if(parseInt(removedIdStr) == taskInfoObjArray[i].taskId){
                searchedIndexForRemoving = i;
                break;
            }
        }
        taskInfoObjArray.splice( searchedIndexForRemoving, 1);
        taskNumber--;
        if(taskNumber > 0){
            resequence();
        }
        
    }

// add the sorting ability to done task list
function addTaskAndTaskListListener(taskListElementParent){

        //add drag, dragover and drop listenr to drag button div
        taskListElementParent.firstElementChild.addEventListener('dragstart', dragStart);
        taskListElementParent.firstElementChild.addEventListener('dragover', dragOver);
        taskListElementParent.firstElementChild.addEventListener('drop', contentDivDrop);
        function dragStart(e){
            e.stopPropagation();
            e.dataTransfer.setData("text", e.target.nextElementSibling.id);

            // let img = document.createElement("img");
            // let width = document.createAttribute('width');
            // let height = document.createAttribute('height');
            // width.value = '15';
            // height.value = '15';
            // img.setAttributeNode(width);
            // img.setAttributeNode(height);
            // img.src = 'dragged-image.png';
            // e.dataTransfer.setDragImage(img, 3, 3);
        }

        // add dragover and drop listner to content div
        taskListElementParent.firstElementChild.nextElementSibling.addEventListener('dragover', dragOver);
        taskListElementParent.firstElementChild.nextElementSibling.addEventListener('drop', contentDivDrop);

        function dragOver(e){
            e.preventDefault();
            e.stopPropagation();
        }
        // let badChildrenArray = document.querySelectorAll('div[id*="list-task"], .deleteButton');
        // badChildrenArray.forEach(element=>stopChildDragDropPropogate(element));
        // badChildrenArray.forEach(element=>element.addEventListener('dragstart', (e)=>{e.stopPropagation()}));

        // sort within drop listener
        function contentDivDrop(e){
            e.preventDefault();
            e.stopPropagation();
            let data = e.dataTransfer.getData("text");
            let contentDivElement = document.getElementById(data);
            let draggedPosition = 0;
            let droppedPostion = 0;
            // create another list for holding node list. node list is read-only
            let taskListArray = [];
            document.querySelectorAll('#task-list div[id*="list-task"]').forEach(element => taskListArray.push(element));
            for(let i = 0; i < taskListArray.length; i++){
                if(contentDivElement === taskListArray[i]){
                    draggedPosition = i;
                }
                if(e.target.parentElement.firstElementChild.nextElementSibling === taskListArray[i]){
                    droppedPostion = i;
                }
            }
            if(draggedPosition > droppedPostion){
                let exchangeTimes = draggedPosition - droppedPostion;
                for(let i = 1; i <= exchangeTimes; i++){
                    let buffer = taskListArray[draggedPosition];
                    taskListArray[draggedPosition] = taskListArray[draggedPosition - 1];
                    taskListArray[draggedPosition - 1] = buffer;

                    let xElement = taskListArray[draggedPosition - 1].parentElement;
                    let yElement = taskListArray[draggedPosition].parentElement;
                    xElement.insertBefore(taskListArray[draggedPosition], xElement.firstElementChild.nextElementSibling);
                    yElement.insertBefore(taskListArray[draggedPosition-1], yElement.firstElementChild.nextElementSibling);
                    draggedPosition--;
                }

            }else {
                let exchangeTimes = droppedPostion - draggedPosition;
                for(let i = 1; i <= exchangeTimes; i++){
                    let buffer = taskListArray[draggedPosition];
                    taskListArray[draggedPosition] = taskListArray[draggedPosition + 1];
                    taskListArray[draggedPosition + 1] = buffer;

                    let xElement = taskListArray[draggedPosition + 1].parentElement;
                    let yElement = taskListArray[draggedPosition].parentElement;
                    xElement.insertBefore(taskListArray[draggedPosition], xElement.firstElementChild.nextElementSibling);
                    yElement.insertBefore(taskListArray[draggedPosition + 1], yElement.firstElementChild.nextElementSibling);

                    draggedPosition++;
                }
            }
           
        }
    }
function addTaskClickDoneListener(newOrOld, type){
    if(type === 'cal'){
        if(newOrOld === 'new'){
            let task = document.querySelector('#task' + (taskNumber-1));
            task.addEventListener('click', hintFinished);
        }else if(newOrOld === 'old'){
            for(let i = 0; i < taskNumber; i++){
                let task = document.querySelector('#task' + i);
                task.addEventListener('click', hintFinished);
            }
        }
        function hintFinished(e){
            let doneOrNot = taskInfoObjArray[e.target.id.substring(4)].done;
            if(doneOrNot === false){
        // js sound effect ------------
        const audioElement = document.querySelector('audio[id="audio-done"]');
        audioElement.play();
        // ----------------------------
                //cal task style
                e.target.style.backgroundColor = 'grey';
                e.target.style.color = 'white';
                e.target.style.textDecoration = 'line-through';

                //list task style
                let listElement = document.querySelector('#list-task' + e.target.id.substring(4));
                listElement.style.backgroundColor = 'grey';
                listElement.style.color = 'white';
                listElement.style.textDecoration = 'line-through';

                //create and append done list task  
                taskInfoObjArrayWithTaskNumber = taskInfoObjArray[parseInt(e.target.id.substring(4))];
                let div = createTask(taskInfoObjArrayWithTaskNumber, 'old', 'done');
                appendTaskToDoneList(div);

                taskInfoObjArray[e.target.id.substring(4)].done = true;
            }else if(doneOrNot === true){
                //remove cal task style
                e.target.style.backgroundColor = '';
                e.target.style.color = '';
                e.target.style.textDecoration = '';

                //remove list task style
                let listElement = document.querySelector('#list-task' + e.target.id.substring(4));
                listElement.style.backgroundColor = '';
                listElement.style.color = '';
                listElement.style.textDecoration = '';

                //remove done list task element
                document.querySelector('#done-task' + e.target.id.substring(4)).parentElement.remove();
                doneTaskArray.splice(doneTaskArray.indexOf(e.target.id.substring(4)) ,1)  //remove done task array item
                
                taskInfoObjArray[e.target.id.substring(4)].done = false;
            }   

        }
    }else if(type === 'list'){

        if(newOrOld === 'new'){
            let task = document.querySelector('#list-task' + (taskNumber-1));
            task.addEventListener('click', hintFinished);
        }else if(newOrOld === 'old'){
            for(let i = 0; i < taskNumber; i++){
                let task = document.querySelector('#list-task' + i);
                task.addEventListener('click', hintFinished);
            }
        }

        function hintFinished(e){
            let doneOrNot = taskInfoObjArray[e.target.id.substring(9)].done;
            if(doneOrNot === false){
        // js sound effect ------------
        const audioElement = document.querySelector('audio[id="audio-done"]');
        audioElement.play();
        // ----------------------------
                //list task style
                e.target.style.backgroundColor = 'grey';
                e.target.style.color = 'white';
                e.target.style.textAlign = 'center';
                e.target.style.textDecoration = 'line-through';

                //cal task style
                let taskElement = document.querySelector('#task' + e.target.id.substring(9));
                taskElement.style.backgroundColor = 'grey';
                taskElement.style.color = 'white';
                taskElement.style.textDecoration = 'line-through';
    
                //create and append done list task 
                taskInfoObjArrayWithTaskNumber = taskInfoObjArray[parseInt(e.target.id.substring(9))];
                let div = createTask(taskInfoObjArrayWithTaskNumber, 'old', 'done');
                appendTaskToDoneList(div);

                taskInfoObjArray[e.target.id.substring(9)].done = true;
            }else if(doneOrNot === true){
                //remove list task style
                e.target.style.backgroundColor = '';
                e.target.style.color = '';
                e.target.style.textDecoration = '';

                //remove cal task style
                let calElement = document.querySelector('#task' + e.target.id.substring(9));
                calElement.style.backgroundColor = '';
                calElement.style.color = '';
                e.target.style.textAlign = '';
                calElement.style.textDecoration = '';
                
                //remove done list task element
                document.querySelector('#done-task' + e.target.id.substring(9)).parentElement.remove();
                doneTaskArray.splice(doneTaskArray.indexOf(e.target.id.substring(9)) ,1)  //remove done task array item

                taskInfoObjArray[e.target.id.substring(9)].done = false;
            }

        }
    }
}



// js bootstrap styling ---------

// Day dropdown menu
let selectedDay = 'day';
let daySelectionArray = document.querySelectorAll('#task-date a');
daySelectionArray.forEach(element=>element.addEventListener('click', changeToSelectedDay));
function changeToSelectedDay(e){
    let btn = document.getElementById('dropdownMenuButton-day');
    btn.innerText = e.target.innerText;
    selectedDay = e.target.id;
}

// Am or pm dropdown menu
let amOrPm = 'am';
document.querySelector('#am-or-pm button').innerText = document.querySelector('#am-or-pm a').innerText;  //initialize to the first one
let amOrPmSelectionArray = document.querySelectorAll('#am-or-pm a');
amOrPmSelectionArray.forEach(element=>element.addEventListener('click', changeToSelectedAmOrPm));
function changeToSelectedAmOrPm(e){
    document.querySelector('#am-or-pm button').innerText = e.target.innerText;
    amOrPm = e.target.innerText;
}


// js sound effect ------------

// const audioContext = new AudioContext();
// const audioElement = document.querySelector('audio');
// audioElement.play();
// const track = audioContext.createMediaElementSource(audioElement);
// track.connect(audioContext.destination);
initialize();