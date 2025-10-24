import { rtdb, auth, db } from './firebase.js';
import { ref, set, onValue, remove, update, push } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let roomRef = null;
let playersRef = null;
let chatRef = null;
let myPlayerRef = null;
let roomIdGlobal = null;
let uidGlobal = null;

export function initRealtime(roomId, uid, displayName){
  roomIdGlobal = roomId;
  uidGlobal = uid;
  roomRef = ref(rtdb, `liveSessions/${roomId}`);
  playersRef = ref(rtdb, `liveSessions/${roomId}/players`);
  chatRef = ref(rtdb, `liveSessions/${roomId}/chat`);
  myPlayerRef = ref(rtdb, `liveSessions/${roomId}/players/${uid}`);
  set(myPlayerRef, {
    uid,
    name: displayName || uid.slice(0,6),
    mode: 'avatar',
    lastSeen: Date.now()
  });
  return { roomRef, playersRef, chatRef };
}

export function publishPose(poseSimplified){
  if (!myPlayerRef) return;
  const payload = {
    pose: poseSimplified,
    lastSeen: Date.now()
  };
  update(myPlayerRef, payload).catch(e=>console.error(e));
}

export function subscribePlayers(onPlayers){
  if (!playersRef) return;
  onValue(playersRef, (snap)=>{
    const obj = snap.val() || {};
    onPlayers && onPlayers(obj);
  });
}

export async function sendChatMessage(text, uid, displayName){
  if(!chatRef) return;
  const msgRef = push(chatRef);
  const payload = {
    uid,
    name: displayName || uid.slice(0,6),
    text,
    ts: Date.now()
  };
  set(msgRef, payload);
}
