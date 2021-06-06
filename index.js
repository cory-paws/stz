
const load = async (name) => {
    try {
        const response = await fetch(name);
        return response.text();
    } catch (err){  
        console.error(err);
    }
    return null;
}

const removeChilds = (parent) => {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};

const remove = id => {
    const el = document.getElementById(id);
    el.parentNode.removeChild(el);
}

const oldway = () =>{
    const prod = localStorage.getItem('cattlePod');
    if (prod){
        remove('prodDrop');
        remove('prod');
    } else {
        remove('back');
    }
    
}
const skip = option =>{
    if (!option.with && !option.without){
        return false;
    }
    const name = option.with == null ? option.without: option.with;
    const holding = localStorage.getItem(name);
    return (holding == null && option.with) || (holding != null && option.without);
}

const process = option  =>{
    console.log(option);
    if (skip(option)){
        return;
    }
    const li = document.createElement('li');
    li.innerHTML = option.desc;
    const json = option.link;
    const action = (event)=>{
        go(json);
        document.removeEventListener("click", li);
    }
    li.addEventListener("click", action);
    return li;
}

const build = (data) =>{
    const titleElement = document.getElementById('title');
    const descElement = document.getElementById('desc');
    removeChilds(descElement);
    titleElement.innerHTML = data.title;
    if (data.type == 'DEAD'){
        titleElement.classList.add('red');
    } else {
        titleElement.classList.remove('red');
    }
    if (data.type == 'PICKEDUP') {
        localStorage.setItem(data.objectName, data);
    }
    data.lines.forEach(line =>{
        const div = document.createElement('div');
        div.innerHTML=line;
        descElement.appendChild(div);
    });
    const optionsElement = document.getElementById("options");
    removeChilds(optionsElement);
    data.options.forEach(option => {
        const li = process(option);
        if (li){
            optionsElement.appendChild(li);
        }
    });
}

const go = async (place) => {
    if (place == null){
        place = localStorage.getItem("current");
    }
    const data = place == null? 'index.json': place;
    localStorage.setItem("current", data);
    console.log("We are now going load ",data);
    const dataString = await load(data);
    console.log(dataString);
    build(JSON.parse(dataString));
}

go();