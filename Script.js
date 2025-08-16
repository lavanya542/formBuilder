const formBuilder=document.getElementById("form-builder");
let submitButton=null;
const draggables=document.querySelectorAll('.draggable');
draggables.forEach(draggable=>{
    draggable.addEventListener('dragstart',dragStart);
})
formBuilder.addEventListener('dragover',dragOver);
formBuilder.addEventListener('drop',drop);
function dragStart(e){
    // in java script the drop element doesn't know what is coming so the draggable element itself get the data with it using data.transfer.setData method here we specify the type of content to drag and then its value in second parameter;
    e.dataTransfer.setData('type',e.target.getAttribute('data-type'));
}
function dragOver(e){
    e.preventDefault();//saying it to dont clear keep it as it is
}
function drop(e){
    console.log("yes");
    e.preventDefault();
    const type=e.dataTransfer.getData('type');
    let newElement;
    switch (type){
        case "big-heading":newElement=createText('bigHead');
        break;
        case "small-heading":newElement=createText('smallHead');
        break;
        case "para":newElement=createText('paragraph');
        break;
        case "text":newElement=createEditableText('text');
        
        break;
        case "textarea":newElement=createEditableText('textArea');
        break;
        case "select":newElement=createEditableMCQ("select");
        break;
        case "radio":newElement=createEditableMCQ("radio");
        break;
        case "checkbox":newElement=createEditableMCQ("checkbox");
        break;
        default:break;
    }
    if(newElement){
        formBuilder.appendChild(newElement);
        makeElementDraggable(newElement);
        toggleSubmitButton();
    }
    
}
function createEditableMCQ(type){
    let divName='selectDiv';
    if(type=='radio'){
        divName='radioDiv';
    }
    else if(type=='checkbox'){
        divName='checkboxDiv';
    }
    const div=document.createElement("div");
    div.setAttribute('draggable',true);
    div.classList.add(divName,'form-element');
    const labelInput=document.createElement('input');
    labelInput.type='text';
    labelInput.classList.add('label-edit');
    labelInput.value='edit this '+type+' label';
    div.appendChild(labelInput);
    const optionContainer=document.createElement("div");
    optionContainer.classList.add('options-container');
    const option1=createOption('option1');
    console.log(option1);
    const option2=createOption('option2');
    optionContainer.appendChild(option1);
    optionContainer.appendChild(option2);
    const addOptionButton=document.createElement("button");
    addOptionButton.textContent="Add Option";
    addOptionButton.type='button';
    addOptionButton.onclick=function(){
        const newOption=createOption(`option${optionContainer.children.length+1}`);
        optionContainer.appendChild(newOption);
    }
    
    div.appendChild(optionContainer);
    div.appendChild(addOptionButton);

    const deleteButton=createDeleteButton();
    div.appendChild(deleteButton);
    return div;
}
function createOption(defaultText) {
    const optionDiv = document.createElement('div');
    optionDiv.classList.add('option-edit');

    const optionInput = document.createElement('input');
    optionInput.type = 'text';
    optionInput.value = defaultText;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Remove';
    deleteButton.type = 'button';
    deleteButton.classList.add('delete-button');
    deleteButton.onclick = function () {
        optionDiv.remove();
    }

    optionDiv.appendChild(optionInput);
    optionDiv.appendChild(deleteButton);

    return optionDiv;
}
function createText(type) {

    const div = document.createElement('div');
    div.setAttribute('draggable', true);
    div.classList.add(`${type}Div`);


    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.classList.add(`${type}Input`);
    labelInput.value = '--Change this Big Heading-';
    if (type == 'smallHead') labelInput.value = '--Change this Small Heading-';
    if (type == 'paragraph') labelInput.value = '--Change this Paragraph-';


    div.appendChild(labelInput);

    const deleteButton = createDeleteButton();
    div.appendChild(deleteButton);

    return div;
}

function createDeleteButton(){
    const deleteBtn=document.createElement('button');
    deleteBtn.textContent='Delete';
    deleteBtn.type='button';
    deleteBtn.classList.add('delete-button');
    deleteBtn.onclick=function(){
        this.parentElement.remove();
        toggleSubmitButton();
    }
    return deleteBtn;


}
function createEditableText(type){
    let divName='textInputDiv';
    if(type=='textArea'){
        divName='textAreaDiv';
    }
    const div=document.createElement("div");
    div.setAttribute('draggable',true);
    div.classList.add(divName,'form-element');
    const labelInput=document.createElement('input');
    labelInput.type='text';
    labelInput.classList.add('label-edit');
    labelInput.classList.add('textInput');
    labelInput.value='edit '+divName+' label';
    div.appendChild(labelInput);
    // cosole.log(div);
    let div2=document.createElement('input');
    if(type=='textArea'){
        div2=document.createElement('textarea');
    }
    div2.type="text";
    div2.placeholder="Enter Here";
    div2.disabled=true;
    div.appendChild(div2);
    const deleteButton=createDeleteButton();
    div.appendChild(deleteButton);
    console.log(div);
    return div;

}
function makeElementDraggable(element){
    element.setAttribute('draggable',true);
    element.addEventListener('dragstart',function(e){
        e.target.classList.add('dragging');
    })
    element.addEventListener('dragend',function(e){
        e.target.classList.remove('dragging');
    })
   
}
formBuilder.addEventListener('dragover',function(e){
    e.preventDefault();
    const afterElement=getDragAfterElement(formBuilder,e.clientY);
    const draggable=document.querySelector('.dragging');
    if (!draggable) return;
    if(afterElement==null){
        formBuilder.appendChild(draggable);
        toggleSubmitButton()
    }
    else{
        formBuilder.insertBefore(draggable,afterElement);
        toggleSubmitButton()
    }
})
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.form-element:not(.dragging')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        }
        else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
function toggleSubmitButton(){
    if(formBuilder.children.length>0){
        if(!submitButton){
            submitButton=document.createElement('button');
            submitButton.textContent='Submit';
            submitButton.type='button';
            submitButton.classList.add('submit-button');
            submitButton.onclick = handleSubmit;
        }
        formBuilder.appendChild(submitButton);
    }
    else {
        submitButton.remove();
        submitButton = null
    }
}
function handleSubmit(){
    let formData=[];
    Array.from(formBuilder.children).forEach((child)=>{
        if((child.classList.contains('bigHeadDiv')&&child.querySelector('.bigHeadInput'))||(child.classList.contains('smallHeadDiv')&&child.querySelector('.smallHeadInput'))||(child.classList.contains('paragraphDiv')&&child.querySelector('.paragraphInput'))){
            let label='';
            let elementType='';
            if(child.querySelector('.bigHeadInput')){
                label=child.querySelector('.bigHeadInput').value;
                elementType='bigHead';
            }
            if(child.querySelector('.smallHeadInput')){
                label=child.querySelector('.smallHeadInput').value;
                elementType='smallHead';
            }
            if(child.querySelector('.paragraphInput')){
                label=child.querySelector('.paragraphInput').value;
                elementType='paragraph';
            }
            formData.push({
                value:label,
                type:elementType
            })

        }
        if((child.classList.contains('textInputDiv')||child.classList.contains('textAreaDiv'))){
            const label=child.querySelector('.label-edit').value;
            let type='';
            if(child.classList.contains('textInputDiv')){
                type='textInput'
            }
            else{
                type='textArea';
            }
            formData.push({
                value:label,
                type:type
            })
        }
        if((child.classList.contains('selectDiv'))||(child.classList.contains('radioDiv'))||(child.classList.contains('checkboxDiv'))){
            let label=child.querySelector('.label-edit').value;
            const optionValues=[];
            const AllOptionsList=child.querySelector('.options-container');
            const options=AllOptionsList.querySelectorAll('.option-edit');
            options.forEach((option)=>{
                console.log(option);
                const optionValue=option.querySelector('input').value;
               
                optionValues.push(optionValue);
            })
            let elementType='';
            if(child.classList.contains('selectDiv')){
                elementType='select';
            }
            if(child.classList.contains('radioDiv')){
                elementType='radio';
            }
            if(child.classList.contains('checkboxDiv')){
                elementType='checkbox';
            }
            formData.push({
                value:label,
                type:elementType,
                options:optionValues
            })
        }
    })
    localStorage.setItem('formData',JSON.stringify(formData));
    window.location.href='index1.html';
    console.log(formData);
}
