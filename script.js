const SERVER="edgecraft.sparkedservers.us"
const API=`https://api.mcsrvstat.us/2/${SERVER}`

let playerHistory=[]
let labels=[]
let startTime=Date.now()

const ctx=document.getElementById("playerChart").getContext("2d")

const chart=new Chart(ctx,{
type:"line",
data:{
labels:labels,
datasets:[{
label:"Players",
data:playerHistory
}]
}
})

async function updateServer(){

try{

const res=await fetch(API)
const data=await res.json()

document.getElementById("status").innerHTML=
data.online ? "🟢 ONLINE":"🔴 OFFLINE"

if(data.players){
document.getElementById("players").innerHTML=
`${data.players.online} / ${data.players.max}`

playerHistory.push(data.players.online)
labels.push(new Date().toLocaleTimeString())

if(playerHistory.length>20){
playerHistory.shift()
labels.shift()
}

chart.update()
}

document.getElementById("version").innerHTML=
"Version: "+(data.version||"Unknown")

if(data.motd){
document.getElementById("motd").innerHTML=
data.motd.clean.join(" ")
}

if(data.players && data.players.list){

document.getElementById("playerlist").innerHTML=
data.players.list.map(p=>`<div class="player">${p}</div>`).join("")

}

let uptime=Math.floor((Date.now()-startTime)/1000)
document.getElementById("uptime").innerHTML=
"Monitoring uptime: "+uptime+"s"

document.getElementById("updated").innerHTML=
new Date().toLocaleTimeString()

}catch{

document.getElementById("status").innerHTML="API ERROR"

}

}

updateServer()
setInterval(updateServer,5000)
