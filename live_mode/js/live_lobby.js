import { auth, rtdb, db } from './firebase.js';
import { onValue, ref, push, set, onChildAdded, child, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const roomsContainer = document.getElementById('roomsContainer');
const roomTpl = document.getElementById('roomItemTpl');
const createRoomBtn = document.getElementById('createRoom');
const roomNameInput = document.getElementById('roomName');
const joinCodeInput = document.getElementById('roomCode');
const joinCodeBtn = document.getElementById('joinCodeBtn');
const userTag = document.getElementById('userTag');
const signOutBtn = document.getElementById('signOut');

let me = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) return window.location.href = '/rivalis_login.html';
  me = user;
  userTag.textContent = user.displayName || user.email || user.uid.slice(0,6);
  loadRooms();
});

async function loadRooms(){
  const roomsRef = ref(rtdb, 'liveSessions');
  onValue(roomsRef, (snap) => {
    roomsContainer.innerHTML = '';
    const data = snap.val() || {};
    Object.keys(data).forEach(key => {
      const room = data[key];
      const tpl = roomTpl.content.cloneNode(true);
      tpl.querySelector('.room-name').textContent = room.name || key;
      tpl.querySelector('.room-host').textContent = 'Host: ' + (room.hostName || '—');
      const btn = tpl.querySelector('.join-btn');
      btn.addEventListener('click', ()=> joinRoom(key));
      roomsContainer.appendChild(tpl);
    });
  });
}

createRoomBtn.addEventListener('click', async ()=>{
  const name = roomNameInput.value.trim() || 'Rival Room';
  const roomsRef = ref(rtdb, 'liveSessions');
  const newRoomRef = push(roomsRef);
  const roomId = newRoomRef.key;
  const hostName = me.displayName || me.email || me.uid.slice(0,6);
  await set(ref(rtdb, `liveSessions/${roomId}`), {
    name,
    hostUid: me.uid,
    hostName,
    createdAt: Date.now()
  });
  window.location.href = `/live_mode/arena.html?room=${roomId}`;
});

async function joinRoom(roomId){
  window.location.href = `/live_mode/arena.html?room=${roomId}`;
}

joinCodeBtn.addEventListener('click', ()=>{
  const code = joinCodeInput.value.trim();
  if(!code) return alert('Enter a room code');
  joinRoom(code);
});

signOutBtn.addEventListener('click', async ()=>{
  await auth.signOut();
  window.location.href = '/rivalis_login.html';
});
