/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */

/*
Dowager Prototype 01 Code
24 Cue Programmable Firework Launcher based on Edison platform

MRAA - Low Level Skeleton Library for Communication on GNU/Linux platforms
Library in C/C++ to interface with Galileo & other Intel platforms, in a structured and sane API with port nanmes/numbering that match boards & with bindings to javascript & python.

Steps for installing MRAA & UPM Library on Intel IoT Platform with IoTDevKit Linux* image
Using a ssh client: 
1. echo "src maa-upm http://iotdk.intel.com/repos/1.1/intelgalactic" > /etc/opkg/intel-iotdk.conf
2. opkg update
3. opkg upgrade

Article: https://software.intel.com/en-us/html5/articles/intel-xdk-iot-edition-nodejs-templates
*/

var mraa = require('mraa'); //require mraa
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the Intel XDK console

//initialize show running LED - indicates show program is active
var ShowLED = new mraa.Gpio(41);
ShowLED.dir(mraa.DIR_OUT);

//initialize ready led - indicates board is running and ready to recieve show start signal
var ReadyLED = new mraa.Gpio(40);
ReadyLED.dir(mraa.DIR_OUT);


//initialize program trigger interrupt
var ProgramTrigger = new mraa.Gpio(31);
ProgramTrigger.dir(mraa.DIR_IN);
ProgramTrigger.isr(mraa.EDGE_FALLING,runProgram);

//Initialize cue channel array
/*var ledArray = [];
var CUEtimeoutArray = [];
for (var i = 11; i < 14; i++) 
{
    ledArray[i] = new mraa.Gpio(i);
    ledArray[i].dir(mraa.DIR_OUT);
}
console.log(ledArray);*/

//Initialize Timer Value Array
var timerArray = [];
timerArray[11] = 10000;
timerArray[12] = 10000;
timerArray[13] = 10000;
console.log(timerArray);

//Time to burn 
burnTime = 500;

mainLoop(); //call the main function

//funtion triggers LEDs on
function TriggerLED(LEDindex)
{
    //ledArray[LEDindex].write(1);
    console.log("LED ON!", LEDindex);
    setTimeout(LEDoff,burnTime,LEDindex);

}
        
//funtion triggers LEDs off
function LEDoff(LEDindex)
{
    //ledArray[LEDindex].write(0);
    console.log("LED OFF!", LEDindex);
    // Call reset function at the end of the show..
    if(LEDindex == 13)
    {
        reset();
    }
        
    
    
}

//function sets timers for leds based on ms values in timer array
function setLEDtimer()
{
    for (var i = 11; i < 14; i++) {
        
        CUEtimeoutArray[i] = setTimeout(TriggerLED,timerArray[i],i);
        
    }
    console.log("Timers Set"); 
}

//function runs timed triggers when unit is switched into play mode
function runProgram()
{
        //Trigger program LED
        ShowLED.write(1);
        console.log("Program Started");
        
        //Trigger LEDs timing
        setLEDtimer();
}

//Cancel remaining timers and reset all
function reset()
{
    
    // Clear outstanding timers if show still in progress 
    for (var i = 0; i < CUEtimeoutArray.length; i++) {
        clearTimeout(CUEtimeoutArray[i]);
    }

}

//Function periodically prints updates to the log for the main loop
function periodicTrigger()
{
    //print trigger pin status
    var GoButton =  ProgramTrigger.read();
    console.log("Trigger Status " + GoButton);
    setTimeout(periodicTrigger, 2000);
}

//Main function loop
function mainLoop()
{
    console.log("Program Ready");
    ReadyLED.write(1);
    setTimeout(periodicTrigger, 2000);
        
    
}
