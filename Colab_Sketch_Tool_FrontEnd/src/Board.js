import React, { useRef, useEffect } from 'react';
import {io} from 'socket.io-client';
import './styles/styles.css';


import { createClient } from '@supabase/supabase-js';
import { decode } from 'base64-arraybuffer';

const supabaseDetails = {
  "URL": "https://vciziedlvnxwqewyvruc.supabase.co",
  "anon": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjaXppZWRsdm54d3Fld3l2cnVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjUyNDMzOTEsImV4cCI6MTk4MDgxOTM5MX0.uUyOj9SYd5AjdlxJtNdE9K2ADnhDlf_IZvpn_k2fhJk",
  "serviceRole": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjaXppZWRsdm54d3Fld3l2cnVjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2NTI0MzM5MSwiZXhwIjoxOTgwODE5MzkxfQ.4WGrOujLfjyt0wXxi6a6mVUYO7X4Q9_yRaTOxS4WTKk",
};

const supabaseUrl = supabaseDetails.URL;
const supabaseKey = supabaseDetails.anon;
const supabase = createClient(supabaseUrl, supabaseKey);



const Board = ({userEmailAddress}) => {
  const canvasRef = useRef(null);
  const colorsRef = useRef(null);
  const socketRef = useRef();

  useEffect(() => {

    // --------------- getContext() method returns a drawing context on the canvas-----

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const socket = io('https://collabrativewhiteboarding.onrender.com', { transports : ['websocket']});

    socket.on("connect", () => {
        console.log(socket.id); // x8WIv7-mJelg7on_ALbx
      });
      
      socket.on("disconnect", () => {
        console.log(socket.id); // undefined
      });

    // ----------------------- Colors --------------------------------------------------

    const colors = document.getElementsByClassName('color');
    // set the current color
    const current = {
      color: 'black',
    };

    // helper that will update the current color
    const onColorUpdate = (e) => {
      current.color = e.target.className.split(' ')[1];
    };

    // loop through the color elements and add the click event listeners
    for (let i = 0; i < colors.length; i++) {
      colors[i].addEventListener('click', onColorUpdate, false);
    }
    let drawing = false;

    const onDrawingEvent = (data) => {
        const w = canvas.width;
        const h = canvas.height;
        drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
      }

    socket.on('drawing', onDrawingEvent);

    // ------------------------------- create the drawing ----------------------------

    const drawLine = (x0, y0, x1, y1, color, emit) => {
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      context.lineWidth = 3;
      context.stroke();
      context.closePath();

      if (!emit) { return; }
      const w = canvas.width;
      const h = canvas.height;

      socket.emit('drawing', {
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        color: color
      });
    };

    

    // ---------------- mouse movement --------------------------------------

    const onMouseDown = (e) => {
      drawing = true;
      current.x = e.clientX || e.touches[0].clientX;
      current.y = e.clientY || e.touches[0].clientY;
    };

    const onMouseMove = (e) => {
      if (!drawing) { return; }
      drawLine(current.x, current.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, current.color, true);
      current.x = e.clientX || e.touches[0].clientX;
      current.y = e.clientY || e.touches[0].clientY;
    };

    const onMouseUp = (e) => {
      if (!drawing) { return; }
      drawing = false;
      drawLine(current.x, current.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, current.color, true);
    };

    // ----------- limit the number of events per second -----------------------

    const throttle = (callback, delay) => {
      let previousCall = new Date().getTime();
      return function() {
        const time = new Date().getTime();

        if ((time - previousCall) >= delay) {
          previousCall = time;
          callback.apply(null, arguments);
        }
      };
    };

    // -----------------add event listeners to our canvas ----------------------

    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);
    canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

    // Touch support for mobile devices
    canvas.addEventListener('touchstart', onMouseDown, false);
    canvas.addEventListener('touchend', onMouseUp, false);
    canvas.addEventListener('touchcancel', onMouseUp, false);
    canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);

    // -------------- make the canvas fill its parent component -----------------

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', onResize, false);
    onResize();

    
  }, []);


  async function saveToDB(event){
    event.preventDefault(); 
    const canvas = canvasRef.current;
    let saveCan = canvas.toDataURL(); saveCan = saveCan+" ";
    console.log(saveCan);

    let canvasBlob = dataURLtoBlob(saveCan);

    let res = await supabase
  .storage
  .createBucket(userEmailAddress);

    const { data, error } = await supabase
  .storage
  .from(userEmailAddress)
  .upload(`${generateRandomString(12)}.png`, canvasBlob, {
    cacheControl: '3600',
    upsert: false
  })

  }


  // TODO: retreive saveCan from DB, and add to Canvas
  async function restorefromDB(event) {
    event.preventDefault();
    let pastData;
    
    let res = await supabase
  .storage
  .from(userEmailAddress)
  .list();

  let latest_file = res.data[0].name;

  const { data, error } = await supabase
  .storage
  .from(userEmailAddress)
  .download(latest_file);

  blobToDataURL(data, function(dataURL){
    let imageObj = new Image();
    let canvas = canvasRef.current;
    let ctx = canvas.getContext('2d');

    imageObj.onload = function() {
    ctx.drawImage(this, 0, 0);
    };
    imageObj.src = dataURL;
  });
  }

  function clearPersonalCanvas (event){
    event.preventDefault();
    let canvas = canvasRef.current;
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

function blobToDataURL(blob, callback) {
  var a = new FileReader();
  a.onload = function(e) {callback(e.target.result);}
  a.readAsDataURL(blob);
}

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateRandomString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}



  // ------------- The Canvas and color elements --------------------------

  return (
    <React.Fragment>
    <div>

    </div>

  <div className="row">
    <div className="column left">
      <h3>Sketch Something Below 👩🏻‍🎨</h3>
      <p></p>
      <canvas ref={canvasRef} className="whiteboard" />
      <br/><br/>
      <button onClick={saveToDB}>Save Data</button>
      <button onClick={restorefromDB}>Restore Data</button>
      <button onClick={clearPersonalCanvas}>Clear Personal Canvas</button>
    </div>

    <div className="column right">
      <h3>Choose the Colors 🎨</h3>
      <p><b>User: </b>{userEmailAddress}</p>
        
      <div ref={colorsRef} className="colors">
      <table style={{width: '20%'}}>
    <tr>
        <td className="block"><div className="color black" /></td>
        <td className="block">Charcoal Black</td>
    </tr>
    <tr>
        <td className="block"><div className="color red" /></td>
        <td className="block">Vermilion Red </td>
    </tr>
    <tr>
        <td className="block"><div className="color green" /></td>
        <td className="block">Fern Green</td>
    </tr>
    <tr>
        <td className="block"><div className="color blue" /></td>
        <td className="block">Azure Blue</td>
    </tr>
    <tr>
        <td className="block"><div className="color yellow" /></td>
        <td className="block">Munsell Yellow</td>
    </tr>
</table>
</div>



    </div>

  </div>


            
              
            
    
    </React.Fragment>
  );
};

export default Board;
