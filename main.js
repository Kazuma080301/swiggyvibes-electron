
const { app, BrowserWindow, protocol,systemPreferences,shell,powerMonitor,taskbar,dialog,net} = require('electron')
const path = require('path')
const dns = require('dns')
const fs = require('fs');
const Store = require('electron-store');
const store = new Store();
const crypto = require('crypto');
const os = require('os');
const { exec } = require('shelljs');
const nodemailer = require('nodemailer');
const { scheduler } = require('timers/promises');
const schedule = require('node-schedule');
const domain_name = `https://swiggyvibes-testing.advantageclub.co/`

let popup_arrived
let frequency_popup
let isFirstTime
let windowheight = 504;
let windowwidth = 282
function encryptMessage(message, key, iv) {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}
const user_name = os.userInfo().username
console.log(`user_name --- ${user_name}`)
const encrypted_user_name = encryptMessage(user_name, 'dfe134b78372998df5c05fc4ac031091', '44608837c6f05e06')
console.log(`encrypted_user_name --- ${encrypted_user_name}`)
fetch(`${domain_name}/desktop_survey_frequency_checker?device_name=${encrypted_user_name}`, requestOptions)
.then(response => response.json())
  .then(result => {
    // console.log(result)
    frequency_popup = result["frequency"]
  })
// const isFirstTimeToday = () => {
//   try {
//     const lastOpenDateTimeString = store.get('lastOpenDateTime');
//     const currentDate = new Date();
//     const currentDateTimeString = currentDate.toDateString() + ' ' + currentDate.getHours() + ':' + currentDate.getMinutes();

//     if (!lastOpenDateTimeString) {
//       store.set('lastOpenDateTime', currentDateTimeString);
//       return true;
//     }

//     const lastOpenDateTime = new Date(lastOpenDateTimeString);
//     console.log(`lastOpenDateTime -- ${lastOpenDateTime}`)
//     const timeDifferenceInMilliseconds = currentDate - lastOpenDateTime;
//     console.log(`timeDifferenceInMilliseconds -- ${timeDifferenceInMilliseconds}`)
//     const timeDifferenceInMinutes = timeDifferenceInMilliseconds / (1000 * 60);
//     console.log(`timeDifferenceInMinutes -- ${timeDifferenceInMinutes}`)

//     time_diff = frequency_popup || 1440
//     console.log(`time_diff -- ${time_diff}`)
//     if (timeDifferenceInMinutes > time_diff) {
//       store.set('lastOpenDateTime', currentDateTimeString);
//       return true;
//     }

//     return false;
//   } catch (err) {
//     console.log(`Error occurred: ${err}`);
//     return false; // You might want to handle this case differently based on your requirements
//   }
// };
const isFirstTimeToday = () => {
  try {
  const lastOpenDate = store.get('lastOpenDate');
// console.log(lastOpenDate);
  const currentDate = new Date().toDateString();

  if (lastOpenDate !== currentDate) {
    store.set('lastOpenDate', currentDate);
    return true;
  }

  return false;
}
catch(err)
{
  console.log(`err1 -- ${err}`)
  return false
}
};
console.log(`${app.getPath('userData')}`)
let mainWindow
// var isSingleInstance = app.requestSingleInstanceLock()
//     if (!isSingleInstance) {
//       // If another instance is already running, quit the current one
//       console.log(`If another instance is already running, quit the current one`)
//       app.quit();
//     }

//     app.on('will-finish-launching', function () {
//       console.log(`will-finish-launching`)
//       app.on('open-url', handleOpenUrlForDarwin);

//       app.setAsDefaultProtocolClient('acapp', process.execPath)
//     });
//     function handleOpenUrlForDarwin (event, url) {
//       // https://electronjs.org/docs/api/app#event-open-url-macos
//       // PreventDefault is needed if we are handling the event.
//       event.preventDefault();
//       console.log(`ProtocolHandler~handleOpenUrlForDarwin - Opened with url: ${url}`);
//       // handleOpenUrl(url);
//     }
var myHeaders = new Headers();
myHeaders.append("token", "gYK9wnFYjkPu9xNnHZc5");

// if (process.defaultApp) {
//   if (process.argv.length >= 2) {
//     app.setAsDefaultProtocolClient('acapp', process.execPath, [path.resolve(process.argv[1])])
//   }
// } else {
//   app.setAsDefaultProtocolClient('acapp')
// }



var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

function retry_for_no_popup() {
  const schedulejob = setInterval(() => {
    console.log('retry_api_hit_start');
    fetch(`${domain_name}/desktop_survey_frequency_checker?device_name=${encrypted_user_name}`, requestOptions)
  .then(response => response.json())
    .then(result => {
      console.log(result)
    try{
      if (result["status"] == true)
    {
      isFirstTime = isFirstTimeToday();
      console.log(result)
      popup_arrived = true
      frequency_popup = result["frequency"]
      console.log(`frequency_popup -- ${frequency_popup}`)
      var isSingleInstance = app.requestSingleInstanceLock();
console.log(`isSingleInstance ----- ${isSingleInstance}`)
if (!isSingleInstance) {
  // If another instance is already running, quit the current one
  app.exit();
} else {
  // Create the main window
  // let mainWindow = null;
  // isFirstTime = isFirstTimeToday();
  if (mainWindow)
    {
      console.log(`retry_for_no_popup --- main_window_present`)
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.show();
      mainWindow.focus();
      if (isFirstTime || issleepfirst) {
        mainWindow.setBounds({ x: width - windowwidth, y: height - windowheight , width: windowwidth, height: windowheight })
        // mainWindow.setSize(800, 620); // Set size for condition 1
      }
        else
        {
      mainWindow.maximize();
      mainWindow.center();
        }
        if (isFirstTime || issleepfirst) {
          loadURLWithRetry(`${domain_name}/in/login_usingdevicename?device_name=${encrypted_user_name}&first_time=1`,3000)
        }
        else
        {
       
          loadURLWithRetry(`${domain_name}/in/login_usingdevicename?device_name=${encrypted_user_name}`,3000);

        }
        
    }
    else
    {
      console.log(`retry_for_no_popup --- app_main_window_open`)
      createWindow();
    }
}
      
    
      console.log(`result ----- ${result}`)
      clearInterval(schedulejob)
      console.log(`job cancelled`)
      setTimeout(() => retry_for_no_popup(),frequency_popup*60*1000);
      
    }
  }
  catch (err)
  {
    console.log(`err_cron -- ${err}`)
    if (err == 'TypeError: Object has been destroyed')
    {
      console.log(`retry_for_no_popup --- app_main_window_open after error`)
    createWindow();
    clearInterval(schedulejob)
      console.log(`job cancelled`)
      setTimeout(() => retry_for_no_popup(),frequency_popup*60*1000);
  }
  }
    })
    .catch(error => console.log('error', error));
  },45*60*1000);
}

retry_for_no_popup();



// console.log(app.getAppPath('exe'))
// console.log(app.getPath('exe'))



// const isFirstTimeToday = () => {
//     try{
//   const lastOpenDate = store.get('lastOpenDate');
// // console.log(lastOpenDate);
//   const currentDate = new Date().toDateString();

//   if (lastOpenDate !== currentDate) {
//     store.set('lastOpenDate', currentDate);
//     return true;
//   }

//   return false;
// }
// catch(err)
// {
//     console.log(`err3 -- ${err}`)
// }
// };


isFirstTime = isFirstTimeToday();

const apppath = process.argv.join(',').toLowerCase()
function showConfirmationDialog() {
    const options = {
      type: 'question',
      buttons: ['OK'],
      // title: 'Confirmation',
      message: 'Please select another snoozing period as this one goes beyond midnight.',
    };
  
    dialog.showMessageBox(mainWindow, options, (response) => {
      if (response === 0) {
        // User clicked "Yes"
        console.log('User confirmed the action.');
       } 
    });
  }
  function loadURLWithLimitedNet(retryInterval) {
    try{
    if (page_status !== "loaded" )
      {console.log('loadURLWithLimitedNet')
      // mainWindow.loadFile('offline copy.html')
        mainWindow.loadFile('no_internet_page.html')
        if (isFirstTime || issleepfirst) {
             loadURLWithRetry(`${domain_name}/in/login_usingdevicename?device_name=${encrypted_user_name}&first_time=1`,3000)
           }
           else
           {
          
             loadURLWithRetry(`${domain_name}/in/login_usingdevicename?device_name=${encrypted_user_name}`,3000);

           }
        timeoutID = setTimeout(() => loadURLWithLimitedNet(retryInterval),retryInterval);
    }
  }
  catch(err)
  {
    console.log(`err11 -- ${err}`)
  }
    
  }
function protocol1 () {
    try{
    const { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize;
    protocol.registerHttpProtocol('acapp', (request) => {
      // Extract the requested URL
      const url = request.url;
      console.log(`inside acapp protocol ---- ${url}`)
      // Check if the URL triggers application exit
      // if (url.includes('acapp://browserredirectclose')){
      //   console.log('inside browserredirectclose')
      //   redirection_url = url.replace('acapp://browserredirectclose/','')
      //   console.log(`redirection_url ---- ${redirection_url}`)
      //   shell.openExternal(redirection_url)
      //   mainWindow.hide();
      // }
     if (url === 'acapp://exit'){
      clearTimeout(timeoutID);
        console.log('Application quit.');
        loadingWindow.destroy();
        mainWindow.hide();      
        // app.hide();
      }
      else if (url.includes('acapp://snooze')) {
        console.log('Application snooze.');
        const b = url.replace('acapp://snooze/','')
        var today = new Date();
        var tomorrow = new Date (today.getTime () + (b * 60 * 60 * 1000))
        if (tomorrow.toDateString() !== today.toDateString())
        {
          showConfirmationDialog();
        }
        else{
          mainWindow.hide();
        setTimeout(() => {
          mainWindow.setBounds({ x: width - windowwidth, y: height - windowheight , width: windowwidth, height: windowheight })
          mainWindow.loadURL(`${domain_name}/in/login_usingdevicename?device_name=${encrypted_user_name}&first_time=1&snooze=true`)
              mainWindow.show();
              mainWindow.reload();
            console.log('snooze_repeat')
            }, b * 60 * 60 * 1000); // 5 minutes delay
        }
    
      }
      else if (url.includes('acapp://browserredirectclose')){
        console.log('inside browserredirectclose')
        redirection_url = url.replace('acapp://browserredirectclose/','')
        console.log(`redirection_url ---- ${redirection_url}`)
        shell.openExternal(redirection_url)
        mainWindow.hide();
      }
      else if (url.includes('acapp://browserredirectwithoutclose')){
        redirection_url = url.replace('acapp://browserredirectwithoutclose/','')
        shell.openExternal(redirection_url)
      }
      else if (url === 'acapp://surveyend') {
        console.log('Application survey end');
        mainWindow.hide();
        mainWindow.setSize(width, height); // Set size for condition 2
        // mainWindow.center();
      }
    });
  }
  catch(err)
  {
    console.log(`err10 --- ${err}`)
  }
  }
var issleepfirst = false

let loadingWindow
let page_status
function createWindow () {
  // isFirstTime = isFirstTimeToday();
  try {
  const { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize;
  console.log(width);
  console.log(height);

 loadingWindow = new BrowserWindow({
    width: null,
    height: null,
    frame: true, // Remove window frame if desired
    webPreferences: {
      nodeIntegration: true,
    },
  });
  if (isFirstTime || issleepfirst) {
    loadingWindow.setBounds({ x: width - windowwidth, y: height - windowheight , width: windowwidth, height: windowheight })
  }
  else{
    loadingWindow.setSize(windowwidth,windowheight);
    loadingWindow.center();
  }
  // else{
  //   loadingWindow.setSize(width, height);    
  // }

//   // Load the loading page
  loadingWindow.loadFile('no_internet_page.html');
  // Create the browser window.
  mainWindow = new BrowserWindow({

    x: null,
    y: null,
    autoHideMenuBar: true,
    frame:true,
    // title:'Menuboard',
    icon: path.join(__dirname, 'a4km8-o0yny.icns'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.once('ready-to-show', () => {
    loadingWindow.destroy(); // Close the loading window
    mainWindow.show();
  });
  mainWindow.hide()
  // mainWindow.loadFile('no_internet_page.html')
// mainWindow.webContents.openDevTools()
  //  mainWindow.center();
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (
      (process.platform === 'darwin' && input.meta && input.shift && input.key === 'I') ||
      (process.platform !== 'darwin' && input.control && input.shift && input.key === 'I') ||
      (process.platform === 'darwin' && input.meta && input.key === 'Q') || 
      (process.platform === 'darwin' && input.meta && input.alt && input.key === 'I') ||
      (process.platform === 'darwin' && input.meta && input.alt && input.key === 'Q')
    ) {
      event.preventDefault();
    }
 });
//  mainWindow.loadFile('no_internet_page.html')
//  mainWindow.webContents.on('did-start-loading', () => {
//   // Show loading page when the main page starts loading
//   mainWindow.loadFile('no_internet_page.html');
// });

 mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.log(`Page failed to load: ${validatedURL}`)
    console.log(`Error code: ${errorCode}`)
    console.log(`Error description: ${errorDescription}`)
    if(errorDescription)
    {
      try{
      mainWindow.loadFile('no_internet_page.html')
          console.log('offline file')
            if (isFirstTime || issleepfirst) {
             loadURLWithRetry(`${domain_name}/in/login_usingdevicename?device_name=${encrypted_user_name}&first_time=1`,3000)
            
           }
           else
           {
             loadURLWithRetry(`${domain_name}/in/login_usingdevicename?device_name=${encrypted_user_name}`,3000);
            
           }
          //  ,1000);
          //  }
          }
          catch(err)
          {
            console.log(`err2 -- ${err}`)
          }
    }
    
    // You can add your custom error handling logic here
  })
  mainWindow.webContents.on('did-finish-load', () => {
    clearTimeout(timeoutID);
    // loadingWindow.destroy(); // Close the loading window
    // mainWindow.show();
    page_status = "loaded"
    console.log('Page has finished loading.')
  // At this point, the web page has fully loaded.
  // You can perform any actions you need to do after the page has loaded.
});
mainWindow.loadFile('no_internet_page.html')
loadURLWithLimitedNet(3000)


  if (isFirstTime || issleepfirst) {
    mainWindow.setBounds({ x: width - windowwidth, y: height - windowheight , width: windowwidth, height: windowheight })
    // mainWindow.setSize(800, 620); // Set size for condition 1
try{ 
mainWindow.loadURL(`${domain_name}/in/login_usingdevicename?device_name=${encrypted_user_name}&first_time=1`)

}
catch(error)
{
  console.error(`Load attempt failed: ${error.message}`);
}
protocol1()
  } else {
    // mainWindow.setSize(800, 620);
    mainWindow.setSize(width, height); // Set size for condition 2
    // mainWindow.maximize();
    mainWindow.center();
    mainWindow.loadURL(`${domain_name}/in/login_usingdevicename?device_name=${encrypted_user_name}`);
    protocol1()
    // store.clear();
  }

}
catch(err)
{
    console.log(`err4 -- ${err}`)
}
}



function loadURLWithRetry(url, retryInterval) {
    dns.lookup('google.com', (error) => {
      if (error) {
        try{
        mainWindow.loadFile('no_internet_page.html')
        // mainWindow.center();
        }
        catch(err)
        {
          console.log(`err10 -- ${err}`)
          clearTimeout(loadURLWithRetrytimeoutID);
        }
        console.log(`${error} --- error`)
        loadURLWithRetrytimeoutID =  setTimeout(() => loadURLWithRetry(url, retryInterval), retryInterval);
      }
      else{
        try{
          console.log('loadurlwithretry')
          mainWindow.loadFile('no_internet_page.html')
        mainWindow.loadURL(url)
        }
        catch(err)
        {
          console.log(`err8 -- ${err}`)
        }
      }
    })
  }

  powerMonitor.on('resume', () => {
    isFirstTime = isFirstTimeToday();
        console.log('The system has resumed from sleep190-09');
        console.log(`isFirstTime --- ${isFirstTime}`)
  
        ff = new Date();
        store.set(ff.toString() + '-' + isFirstTime.toString(), 'true')
      //  if(!isFirstTime && !mainWindow?.isDestroyed())
      //  {
      //   console.log(`hide-----hide`)
      //   mainWindow.hide();
      //   mainWindow.setSkipTaskbar(true);
      //  }
        if (isFirstTime) {
      // createWindow();
    
      var isSingleInstance = app.requestSingleInstanceLock();
  console.log(`isSingleInstance ----- ${isSingleInstance}`)
  if (!isSingleInstance) {
    // If another instance is already running, quit the current one
    app.exit();
// try{
//     if (mainWindow !== null) {
//       mainWindow.close();
//       createWindow();
//     }
//   }
//   catch(err)
//   {
//     createWindow();
//   }
  } else {
    try {
      // isFirstTime = isFirstTimeToday();
      // createWindow();
      if (mainWindow) {
        console.log('main window available')
            if (mainWindow.isMinimized()) {
              mainWindow.restore();
            }
            if (isFirstTime || issleepfirst) {
              let { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize;
              mainWindow.setBounds({ x: width - windowwidth, y: height - windowheight , width: windowwidth, height: windowheight })
              // mainWindow.setSize(800, 620); // Set size for condition 1
            }
              else
              {
            mainWindow.maximize();
            mainWindow.center();
              }
            mainWindow.show();
            mainWindow.focus();
            if (isFirstTime || issleepfirst) {
              //  loadURLWithRetry(`https://www.advantageclub.co/in/login_usingdevicename?device_name=${encrypted_user_name}&first_time=1`,1000)
              loadURLWithRetry(`${domain_name}/login_usingdevicename?device_name=${encrypted_user_name}&first_time=1`,1000)
             }
             else
             {
              //  loadURLWithRetry(`https://www.advantageclub.co/in/login_usingdevicename?device_name=${encrypted_user_name}`,1000);
              loadURLWithRetry(`${domain_name}/login_usingdevicename?device_name=${encrypted_user_name}`,1000);
             }
            //  mainWindow.center();
        // mainWindow.maximize();
        // mainWindow.setSize(width, height); // Set size for condition 2
        
      }
      else
      {
        console.log('main window not available')
        createWindow();
      }
  }
    catch(err)
    {
      // isFirstTime = isFirstTimeToday();
      createWindow();
    }
  }
        //isFirstTime = !isFirstTime
        console.log('The application was launched by Windows startup.');
        // application_already_opened = true
    // sendEmail(`launched by Windows startup  user_name -- ${user_name}  isFirstTime -- ${isFirstTime}  isstartup -- ${isstartup}  appPath -- ${apppath} }`);  
    // mainWindow.show();
    // mainWindow.reload();
    // createWindow();
      }
      })

      app.on('second-instance', () => {
        // Someone tried to run a second instance, handle it as needed
        // For example, you might want to bring the main window to the front
        console.log("second_instance---opening-power-window")
        try {
          // isFirstTime = isFirstTimeToday();
          // createWindow();
          if (mainWindow) {
            console.log('main window available')
                if (mainWindow.isMinimized()) {
                  mainWindow.restore();
                }
                mainWindow.show();
                mainWindow.focus();
                if (isFirstTime || issleepfirst) {
                  mainWindow.setBounds({ x: width - windowwidth, y: height - windowheight , width: windowwidth, height: windowheight })
                  // mainWindow.setSize(800, 620); // Set size for condition 1
                }
                  else
                  {
                mainWindow.maximize();
                mainWindow.center();
                  }
            if (isFirstTime || issleepfirst) {
              //  loadURLWithRetry(`https://www.advantageclub.co/in/login_usingdevicename?device_name=${encrypted_user_name}&first_time=1`,1000)
              loadURLWithRetry(`${domain_name}/login_usingdevicename?device_name=${encrypted_user_name}&first_time=1`,1000)
             }
             else
             {
              //  loadURLWithRetry(`https://www.advantageclub.co/in/login_usingdevicename?device_name=${encrypted_user_name}`,1000);
              loadURLWithRetry(`${domain_name}/login_usingdevicename?device_name=${encrypted_user_name}`,1000);
             }
            // mainWindow.maximize();
            // mainWindow.setSize(width, height); // Set size for condition 2
            
          }
          else
          {
            console.log('main window not available')
            createWindow();
          }
      }
        catch(err)
        {
          // isFirstTime = isFirstTimeToday();
          createWindow();
        }
      });
  // app.on('second-instance', () => {
  //   // Someone tried to run a second instance, handle it as needed
  //   // For example, you might want to bring the main window to the front
  //   console.log("second_instance---opening-power-window")
  //   try {
  //     isFirstTime = isFirstTimeToday();
  //     // createWindow();
  //     if (mainWindow) {
  //       console.log('main window available')
  //           // if (mainWindow.isMinimized()) {
  //           //   mainWindow.restore();
  //           // }
  //           // mainWindow.show();
  //           // mainWindow.focus();
  //           // loadingWindow = new BrowserWindow({
  //           //   width: null,
  //           //   height: null,
  //           //   frame: false, // Remove window frame if desired
  //           //   webPreferences: {
  //           //     nodeIntegration: true,
  //           //   },
  //           // });
  //           // loadingWindow.loadFile('no_internet_page.html');
  //           mainWindow.once('ready-to-show', () => {
  //             // loadingWindow.destroy(); // Close the loading window
  //             mainWindow.show();
  //           });
  //           mainWindow.hide();
  //       if (isFirstTime || issleepfirst) {
  //         //  loadURLWithRetry(`https://www.advantageclub.co/in/login_usingdevicename?device_name=${encrypted_user_name}&first_time=1`,1000)
  //         loadURLWithRetry(`${domain_name}/in/login_usingdevicename?device_name=${encrypted_user_name}&first_time=1`,3000)
  //        }
  //        else
  //        {
  //         //  loadURLWithRetry(`https://www.advantageclub.co/in/login_usingdevicename?device_name=${encrypted_user_name}`,1000);
  //         loadURLWithRetry(`${domain_name}/in/login_usingdevicename?device_name=${encrypted_user_name}`,3000);
  //        }
  //       //  mainWindow.show();
  //           mainWindow.focus();
  //       // mainWindow.maximize();
  //       mainWindow.setSize(width, height); // Set size for condition 2
  //       mainWindow.center();
  //     }
  //     else
  //     {
  //       console.log('main window not available')
  //       createWindow();
  //     }
  // }
  //   catch(err)
  //   {
  //     isFirstTime = isFirstTimeToday();
  //     createWindow();
  //   }
  // });
  // app.on('open-url', (event, url) => {
  //   dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)
  // })


//   app.on('open-file', (event, filePath) => {
//     console.log('inside open file')
//     // macOS only: Handle additional instances via open-file event
//     // You can handle the filePath here if needed
//     // For simplicity, we'll just open a new window
//     createWindow();
// });
app.on('activate', () => {
  isFirstTime = isFirstTimeToday();
  try{
  if (mainWindow === null && loadingWindow == null) {
      createWindow();
  }
  else
  {
  //   loadingWindow = new BrowserWindow({
  //     width: null,
  //     height: null,
  //     frame: false, // Remove window frame if desired
  //     webPreferences: {
  //       nodeIntegration: true,
  //     },
  //   });
  // //   // Load the loading page
  //   loadingWindow.loadFile('no_internet_page.html');
    mainWindow.once('ready-to-show', () => {
      // loadingWindow.destroy(); // Close the loading window
      mainWindow.show();
      mainWindow.focus();
      
      // mainWindow.maximize();
    });
    // mainWindow.hide();
if (isFirstTime || issleepfirst) {
  //  loadURLWithRetry(`https://www.advantageclub.co/in/login_usingdevicename?device_name=${encrypted_user_name}&first_time=1`,1000)
  loadURLWithRetry(`${domain_name}/in/login_usingdevicename?device_name=${encrypted_user_name}&first_time=1`,3000)
 }
 else
 {
  //  loadURLWithRetry(`https://www.advantageclub.co/in/login_usingdevicename?device_name=${encrypted_user_name}`,1000);
  loadURLWithRetry(`${domain_name}/in/login_usingdevicename?device_name=${encrypted_user_name}`,3000);
  mainWindow.center();
 }
//  app.show()
//  app.focus()
    // mainWindow.reload();
    setTimeout(() => {
      mainWindow.show();
      // mainWindow.reload();
      mainWindow.focus();
      if (isFirstTime || issleepfirst) {
        let { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize;
        mainWindow.setBounds({ x: width - windowwidth, y: height - windowheight , width: windowwidth, height: windowheight })
        // mainWindow.setSize(800, 620); // Set size for condition 1
      }
        else
        {
      mainWindow.maximize();
      mainWindow.center();
        }
        
    }, 1000);
  
// mainWindow.maximize();
// mainWindow.setSize(width, height); // Set size for condition 2
// mainWindow.center();
  }
}
catch(err)
{
  createWindow();
}
});
  app.whenReady().then(() => {
    app.setLoginItemSettings({ openAtLogin: true });
    isstartup = app.getLoginItemSettings().wasOpenedAtLogin
    var isSingleInstance = app.requestSingleInstanceLock()
    if (!isSingleInstance) {
    // //   // If another instance is already running, quit the current one
      console.log(`If another instance is already running, quit the current one`)
      app.quit();
      // try{
      //   if (mainWindow === null && loadingWindow == null) {
      //       createWindow();
      //   }
      //   else
      //   {
      //     mainWindow.once('ready-to-show', () => {
      //       // loadingWindow.destroy(); // Close the loading window
      //       mainWindow.show();
      //       mainWindow.maximize();
      //     });
      //     mainWindow.hide();
      // if (isFirstTime || issleepfirst) {
      //   //  loadURLWithRetry(`https://www.advantageclub.co/in/login_usingdevicename?device_name=${encrypted_user_name}&first_time=1`,1000)
      //   loadURLWithRetry(`${domain_name}/in/login_usingdevicename?device_name=${encrypted_user_name}&first_time=1`,3000)
      //  }
      //  else
      //  {
      //   //  loadURLWithRetry(`https://www.advantageclub.co/in/login_usingdevicename?device_name=${encrypted_user_name}`,1000);
      //   loadURLWithRetry(`${domain_name}/in/login_usingdevicename?device_name=${encrypted_user_name}`,3000);
      //  }
      // //  mainWindow.show();
      //     mainWindow.focus();
      // // mainWindow.maximize();
      // // mainWindow.setSize(width, height); // Set size for condition 2
      // mainWindow.center();
      //   }
      // }
      // catch(err)
      // {
      //   console.log(`error while activation -- ${err}`)
      //   createWindow();
      // }
  //     try{
  //     if (mainWindow === null) {
  //       console.log(`another instance main window present?`)
  //       createWindow();
  //   }
  //   else
  //   {
  //     console.log(`another instance main window not present?`)
  //     // loadingWindow = new BrowserWindow({
  //     //   width: null,
  //     //   height: null,
  //     //   frame: false, // Remove window frame if desired
  //     //   webPreferences: {
  //     //     nodeIntegration: true,
  //     //   },
  //     // });
  //     // loadingWindow.loadFile('no_internet_page.html');
  //     if (mainWindow.isMinimized()) {
  //       mainWindow.restore();
  //     }
  //     mainWindow.show();
  //     mainWindow.focus();
  //     // mainWindow.hide();
  //     if (isFirstTime || issleepfirst) {
  //       loadURLWithRetry(`${domain_name}/in/login_usingdevicename?device_name=${encrypted_user_name}&first_time=1`,1000)
  //     }
  //     else
  //     {
     
  //       loadURLWithRetry(`${domain_name}/in/login_usingdevicename?device_name=${encrypted_user_name}`,1000);
  
  //     }
  //     mainWindow.maximize();
  //   //       // mainWindow.setSize(width, height); // Set size for condition 2
  //     mainWindow.center();
  //   }
  // }
  // catch(err)
  // {
  //   createWindow();
  // }
    //   // BrowserWindow.getAllWindows().forEach(window => {
    //   //   window.close();
    //   // });
    //   // try{
    //   //   if (mainWindow === null) {
    //   //       createWindow();
    //   //   }
    //   //   else
    //   //   {
    //   //     if (mainWindow.isMinimized()) {
    //   //       mainWindow.restore();
    //   //     }
    //   //     mainWindow.show();
    //   //     mainWindow.focus();
    //   //     loadURLWithLimitedNet(3000)
    //   //   }
    //   // }
    //   // catch(err)
    //   // {
    //   //   createWindow();
    //   // }
    }
  
    // addToStartupWithArgs(['--startup'])
    else
    {
      if (isstartup)
{
if (isFirstTime) {
    console.log('The application was launched by Windows startup.'); 
// sendEmail(`launched by Apple startup   user_name -- ${user_name} isFirstTime -- ${isFirstTime}  isstartup -- ${isstartup}  appPath -- ${apppath} }`);  
       createWindow();
       // checkInternetAndRetry()
      }
}
     else {
//  sendEmail(`launched by user manually Apple  user_name -- ${user_name} isFirstTime -- false  isstartup -- ${isstartup}  appPath -- ${apppath}`);  
      console.log('The application was launched manually.');
createWindow();
 //checkInternetAndRetry();
    }
    }


});



app.on('window-all-closed', (event) => {
  console.log('closing app window')
    // retry_for_no_popup()
    app.dock.hide()
    

})