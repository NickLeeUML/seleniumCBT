const webdriver = require("selenium-webdriver");
const SeleniumServer = require("selenium-webdriver/remote").SeleniumServer;
const request = require("request");

const cbtHub = "http://hub.crossbrowsertesting.com:80/wd/hub";
const username = "";
const authkey = "";


async function cbtAPI(){
  
    const caps = {
        name : 'June 24 k',   // Name for Crossbrowser test
        build :  '1.0',
        version : '12', 
        platform : 'Mac OSX 10.14', 
        screen_resolution : '1440x1050',
        record_video : 'true',
        record_network : 'false',
        browserName : 'Safari',
        username : username,
        password : authkey
    };

    // Crossbrowser connection information 
        const driver = new webdriver.Builder()
        .usingServer(cbtHub)
        .withCapabilities(caps)
        .build()

        driver.manage().window().setRect({width: 1200, height: 600})

    
        await driver.getSession().then(function(session){
            sessionId = session.id_; //need for API calls
            console.log('Session ID: ', sessionId); 
            console.log('See your test run at: https://app.crossbrowsertesting.com/selenium/' + sessionId)
        });
        
        try {
            await driver.get("https://www.uml.edu/Student-Life/")
            await driver.getTitle().then(function(title){
                console.log('And the title is: ', title);
            })
            await driver.takeSnapshot()
            driver.takeScreenshot().then(
                function(image, err) {
                    if(err) console.log(err)
                    require('fs').writeFile('studentlife-XLarge.png', image, 'base64', function(err) {
                        if(err) console.log("write file error: ", err);
                    });
                }
            );

        } catch(error){
            console.error('Error: ', error)
        } finally {
            //await driver.showSnapshots()
            driver.quit()
        }
}
cbtAPI()



webdriver.WebDriver.prototype.takeSnapshot = function() {

    return new Promise((resolve, fulfill)=> { 
        var result = { error: false, message: null }
        
        if (sessionId){
            request.post(
                'https://crossbrowsertesting.com/api/v3/selenium/' + sessionId + '/snapshots', 
                function(error, response, body) {
                    if (error) {
                        result.error = true;
                        result.message = error;
                    }
                    else if (response.statusCode !== 200){
                        result.error = true;
                        result.message = body;
                    }
                    else{
                        result.error = false;
                        result.message = 'success';
                    }
                }
            )
            .auth(username,authkey);   
        }
        else{
            result.error = true;
            result.message = 'Session Id was not defined';
        }
        result.error ? fulfill('Fail') : resolve('Pass'); //never call reject as we don't need this to actually stop the test
    });
}

webdriver.WebDriver.prototype.showSnapshots  = function(){
    return new Promise((resolve, fulfill) => {
        var result = { error: false, message: null }
        if(sessionId){
            request.get('https://crossbrowsertesting.com/api/v3/selenium/' + sessionId + '/snapshots',
            function(error,response,body){
                if (error) {
                    result.error = true;
                    result.message = error;
                }
                else if (response.statusCode !== 200){
                    result.error = true;
                    result.message = body;
                }
                else{
                    console.log('snapshots error: ', body)
                    result.error = false;
                    result.message = 'success';
                }
                result.error ? fulfill('Fail') : resolve('Pass'); //never call reject as we don't need this to actually stop the test

            }
        ).auth(username,authkey)
        }

    })
}


function getSnapShots(){
    request.get('https://crossbrowsertesting.com/api/v3/selenium/88725DF3-819A-41E7-A7B9-7A7DD4091362/snapshots', function(err,res,body){
        console.log(res)
    }).auth(username,authkey)
}

// getSnapShots()