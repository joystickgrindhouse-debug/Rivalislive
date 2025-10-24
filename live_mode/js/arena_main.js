import { auth, rtdb, db } from './firebase.js';
import { startPoseCapture, stopPoseCapture } from './poseHandler.js';
import { initRealtime, publishPose, subscribePlayers, sendChatMessage } from './realtimeSync.js';
import { drawLoop } from './avatarRenderer.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onValue, ref } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const canvas = document.getElementById('stageCanvas');
const localVideo = document.getElementById('localVideo');
const chatFeed = document.getElementById('chatFeed');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const playersCount = document.getElementById('playersCount');
const readyBtn = document.getElementById('readyBtn');
const readyIndicator = document.getElementById('readyIndicator');
const leaveBtn = document.getElementById('leaveBtn');
const muteChatBtn = document.getElementById('muteChat');

let roomId = null;
let me = null;
let playersObj = {};
let avatarCache = {};

const modeRadios = document.querySelectorAll('input[name="mode"]');
let selectedMode = 'avatar';
modeRadios.forEach(r => r.addEventListener('change', ()=> selectedMode = document.querySelector('input[name="mode"]:checked').value));

function getQuery(name){
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

onAuthStateChanged(auth, async (user)=>{
  if(!user) return window.location.href = '/rivalis_login.html';
  me = user;
  init();
});

async function init(){
  roomId = getQuery('room');
  if(!roomId) return alert('No room specified');

  try {
    const udoc = await getDoc(doc(db, 'users', me.uid));
    const udata = udoc.exists() ? udoc.data() : {};
    avatarCache[me.uid] = udata.avatar || null;
  } catch(e){ console.error('avatar load error', e); }

  initRealtime(roomId, me.uid, me.displayName || me.email);
  subscribePlayers((obj) => {
    playersObj = obj || {};
    playersCount.textContent = 'Players: ' + Object.keys(playersObj).length;
  });

  await startLocalCapture();

  setupChat();

  drawLoop(canvas, playersObj, me.uid, (uid) => {
    return avatarCache[uid] || null;
  });
}

async function startLocalCapture(){
  startPoseCapture(localVideo, (results) => {
    if(results.poseLandmarks){
      const simplified = {
        t: Date.now(),
        p: results.poseLandmarks.map((l,i)=> ({
          x: l.x,
          y: l.y,
          z: l.z,
          name: landmarkNames[i] || `l${i}`
        }))
      };
      publishPose(simplified);
    }
  });
}

function setupChat(){
  const chatRefLocal = ref(rtdb, `liveSessions/${roomId}/chat`);
  onValue(chatRefLocal, (snap)=>{
    const msgs = snap.val() || {};
    chatFeed.innerHTML = '';
    Object.keys(msgs).forEach(k => {
      const m = msgs[k];
      const div = document.createElement('div');
      div.className = 'chat-message';
      div.innerHTML = `<div class="meta">${m.name}</div><div>${m.text}</div>`;
      chatFeed.appendChild(div);
    });
    chatFeed.scrollTop = chatFeed.scrollHeight;
  });

  chatSend.addEventListener('click', ()=> {
    const txt = chatInput.value.trim();
    if(!txt) return;
    sendChatMessage(txt, me.uid, me.displayName || me.email);
    chatInput.value = '';
  });

  chatInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') chatSend.click();
  });
}

leaveBtn.addEventListener('click', ()=> window.location.href = '/live_mode/index.html');

const landmarkNames = [
  'nose','left_eye_inner','left_eye','left_eye_outer','right_eye_inner','right_eye','right_eye_outer',
  'left_ear','right_ear','mouth_left','mouth_right','left_shoulder','right_shoulder','left_elbow',
  'right_elbow','left_wrist','right_wrist','left_pinky','right_pinky','left_index','right_index',
  'left_thumb','right_thumb','left_hip','right_hip','left_knee','right_knee','left_ankle','right_ankle',
  'left_heel','right_heel','left_foot_index','right_foot_index'
];
