const webdriver = require("selenium-webdriver");
const SeleniumServer = require("selenium-webdriver/remote").SeleniumServer;
const request = require("request");

const cbtHub = "http://hub.crossbrowsertesting.com:80/wd/hub";
const username = "";
const authkey = "";

const caps = {
    name : 'c. Basic Test Example from nodejs ie',   // Name for Crossbrowser test
    build :  '1.0',
    version : '66', 
    platform : 'Windows 8.1', 
    screen_resolution : '1366x768',
    record_video : 'true',
    record_network : 'false',
    browserName : 'firefox',
    username : username,
    password : authkey
};

// Test clicks on myuml drop down while taking multiple screen shots at different spots

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
                        console.log('snapshot response: ', response)
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

async function CatalogSideBarSearch(){
    const driver = new webdriver.Builder()
        .usingServer(cbtHub)
        .withCapabilities(caps)
        .build()
    
        await driver.getSession().then(function(session){
            sessionId = session.id_;
            console.log('Session ID: ', sessionId); 
            console.log('See your test run at: https://app.crossbrowsertesting.com/selenium/' + sessionId)
        })

        try {
            await driver.get("https://www.uml.edu/catalog/")
            driver.sleep(3000);

            await driver.getTitle().then(function(title){
                console.log('Page title: ', title)
            })
            let input = webdriver.By.css('input[placeholder="Search Catalog..."]');
             input = await driver.findElement(input)

            //driver.wait(webdriver.until.elementLocated(input),10000)
            //let input = driver.findElement(temp);
            driver.wait(webdriver.until.elementIsVisible(input),10000)
            //const input = await driver.findElement(webdriver.By.css('input[placeholder="Search Catalog..."]'))
            //await driver.wait(webdriver.until.elementIsEnabled(input),2000)

            await input.click();
            await input.sendKeys("art");
            // await input.sendKeys(webdriver.Key.RETURN);
            // await driver.wait(webdriver.until.titleIs("Advanced Course Search | Catalog | UMass Lowell"),2000)
            // await driver.getTitle().then(function(title){
            //     console.log('Page title: ', title)
            // })
            // const script = "document.getElementsByClassName('back-to-top-button')[0].style = 'display:hidden';"
            // driver.executeScript(script)
            await driver.takeSnapshot();
        } catch(err) {
            console.error('error: ', err)
        } finally {
            driver.quit()
        }
    }

async function cbtAPI(){
    const caps = {
        name : 'April 16',   // Name for Crossbrowser test
        build :  '1.0',
        version : '66', 
        platform : 'Windows 8.1', 
        screen_resolution : '1366x768',
        record_video : 'true',
        record_network : 'false',
        browserName : 'firefox',
        username : username,
        password : authkey
    };

    // Crossbrowser connection information 
    const cbtHub = "http://hub.crossbrowsertesting.com:80/wd/hub";
    const username = "";
    const authkey = "";
    
    try {
        const driver = new webdriver.Builder()
        .usingServer(cbtHub)
        .withCapabilities(caps)
        .build()
    } catch(err){
        console.error(err)
    }

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
        } catch(error){
            console.error('Error: ', error)
        } finally {
            driver.quit()
        }
}
cbtAPI()