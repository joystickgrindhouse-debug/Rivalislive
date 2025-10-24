export async function drawLoop(canvas, playersObj, myUid, getAvatarUrlForUid){
  const ctx = canvas.getContext('2d');
  function render(){
    const w = canvas.width = canvas.clientWidth;
    const h = canvas.height = canvas.clientHeight;
    ctx.clearRect(0,0,w,h);

    const uids = Object.keys(playersObj || {});
    uids.forEach(uid => {
      const p = playersObj[uid];
      if(!p) return;
      const pose = p.pose;
      if(!pose) {
        drawName(ctx, p.name || uid, w*0.5, h*0.2);
        return;
      }
      const landmarks = pose.p || pose.landmarks || [];
      const L = mapLandmarks(landmarks, w, h);
      const torso = computeTorso(L);
      const scale = computeScale(L);
      const rotation = computeRotation(L);
      const avatarUrl = getAvatarUrlForUid ? getAvatarUrlForUid(uid) : null;
      drawAvatarAt(ctx, avatarUrl, torso.x, torso.y, scale, rotation, p.name || uid, uid === myUid);
    });
    requestAnimationFrame(render);
  }
  render();
}

function mapLandmarks(landmarks, w, h){
  const m = {};
  landmarks.forEach(l => {
    if(l && l.name) m[l.name] = {x: l.x * w, y: l.y * h, z: l.z};
  });
  return m;
}

function computeTorso(L){
  const points = ['left_hip','right_hip','left_shoulder','right_shoulder'];
  let x=0,y=0,c=0;
  points.forEach(k => { if(L[k]){ x+=L[k].x; y+=L[k].y; c++; }});
  if(c===0) return {x: 200, y:200};
  return {x: x/c, y: y/c};
}

function computeScale(L){
  if(L.left_shoulder && L.right_shoulder){
    return Math.max(0.6, Math.min(2.8, Math.hypot(L.left_shoulder.x - L.right_shoulder.x)/120));
  }
  return 1.0;
}

function computeRotation(L){
  if(L.left_shoulder && L.right_shoulder){
    return Math.atan2(L.left_shoulder.y - L.right_shoulder.y, L.left_shoulder.x - L.right_shoulder.x);
  }
  return 0;
}

function drawAvatarAt(ctx, avatarUrl, x, y, scale, rotation, name, isMe){
  const size = 120 * scale;
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.fillStyle = isMe ? 'rgba(0,255,136,0.06)' : 'rgba(255,46,46,0.04)';
  ctx.arc(0,0, size*0.7, 0, Math.PI*2);
  ctx.fill();

  if(avatarUrl){
    const img = new Image();
    img.src = avatarUrl;
    ctx.drawImage(img, -size/2, -size/2, size, size);
  } else {
    ctx.fillStyle = isMe ? '#00ff88' : '#ff2e2e';
    roundRect(ctx, -size/2, -size/2, size, size, 16);
    ctx.fill();
  }

  ctx.rotate(-rotation);
  ctx.fillStyle = '#fff';
  ctx.font = '600 14px "Player 2", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(name, 0, size*0.86);
  ctx.restore();
}

function drawName(ctx, name, x, y){
  ctx.fillStyle = '#fff';
  ctx.font = '600 16px "Player 2", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(name, x, y);
}

function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}
