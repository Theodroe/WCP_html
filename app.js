const data = [
  {
    id:"F-01",
    priority:"p0",
    name:"기능 1",
    tasks:[
      {id:"F01-T1", text:"WBGT 크롤링", type:"api"},
      {id:"F01-T2", text:"UI 구현", type:"ui"}
    ]
  },
  {
    id:"F-02",
    priority:"p1",
    name:"기능 2",
    tasks:[
      {id:"F02-T1", text:"로직 구현", type:"logic"}
    ]
  }
];

let state = JSON.parse(localStorage.getItem("tasks")||"{}");
let activePriority=null;
let activeType=null;

const app = document.getElementById("app");

function render(){
  app.innerHTML="";
  data.forEach(f=>{
    if(activePriority && f.priority!==activePriority) return;

    const div=document.createElement("div");
    div.className="feature";

    div.innerHTML = `<h3>${f.id} (${f.priority})</h3>`;

    f.tasks.forEach(t=>{
      if(activeType && t.type!==activeType) return;

      const row=document.createElement("div");

      const checked = state[t.id]?"checked":"";
      if(state[t.id]) row.classList.add("completed");

      row.innerHTML = `<input type="checkbox" ${checked}> ${t.text}`;

      row.querySelector("input").addEventListener("change",(e)=>{
        if(e.target.checked){
          state[t.id]=true;
          row.classList.add("completed");
        } else {
          delete state[t.id];
          row.classList.remove("completed");
        }
        localStorage.setItem("tasks",JSON.stringify(state));
        updateProgress();
      });

      div.appendChild(row);
    });

    app.appendChild(div);
  });

  updateProgress();
}

function updateProgress(){
  let total=0, done=0;
  data.forEach(f=>{
    f.tasks.forEach(t=>{
      total++;
      if(state[t.id]) done++;
    });
  });

  const percent = total?Math.round(done/total*100):0;

  document.getElementById("progressText").innerText = percent+"%";
  document.querySelector("#progressBar div").style.width = percent+"%";
}

document.querySelectorAll(".filter-btn").forEach(btn=>{
  btn.onclick=()=>{
    activePriority = activePriority===btn.dataset.priority?null:btn.dataset.priority;
    render();
  }
});

document.querySelectorAll(".type-btn").forEach(btn=>{
  btn.onclick=()=>{
    activeType = activeType===btn.dataset.type?null:btn.dataset.type;
    render();
  }
});

render();
