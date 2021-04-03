
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

const build = (data) =>{
    const titleElement = document.getElementById('title');
    const descElement = document.getElementById('desc');
    removeChilds(descElement);
    titleElement.innerHTML = data.title;
    data.lines.forEach(line =>{
        const div = document.createElement('div');
        div.innerHTML=line;
        descElement.appendChild(div);
    });
    const optionsElement = document.getElementById("options");
    removeChilds(optionsElement);
    data.options.forEach(option =>{
        console.log(option);
        const li = document.createElement('li');
        li.innerHTML = option.desc;
        const json = option.link;
        document.addEventListener("click", ()=>{
            go(json);
        });
        optionsElement.appendChild(li);
    });
}

const go = async (data = 'index.json') => {
    console.log("We are now going load ",data);
    const dataString = await load(data);
    console.log(dataString);
    build(JSON.parse(dataString));
}

go();