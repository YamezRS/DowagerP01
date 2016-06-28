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
var ShowLED = new mraa.Gpio(41);//correct address, temporarily disabled
//var ShowLED = new mraa.Gpio(13);
ShowLED.dir(mraa.DIR_OUT);

//initialize ready led - indicates board is running and ready to recieve show start signal
var ReadyLED = new mraa.Gpio(40); 
ReadyLED.dir(mraa.DIR_OUT);

//initialize program trigger interrupt
var ProgramTrigger = new mraa.Gpio(31);
ProgramTrigger.dir(mraa.DIR_IN);
ProgramTrigger.isr(mraa.EDGE_FALLING,runProgram);

//Initialize cue channel array
// Define pin addresses for Edison breakout board
var cuePinAddress = [ 13, 11, 10, 9, 8, 7, 6, 2, 0, 19, 15, 14, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55 ]; //CUE #8 disabled because of UART, maybe, who knows?
var cueArray = [];
for (var i = 1; i < 25; i++) 
{
    console.log(i,cuePinAddress[i]);
    //cueArray[i] = new mraa.Gpio(cuePinAddress[i]);
    //cueArray[i].dir(mraa.DIR_OUT);
}
//console.log(cueArray); 

//Define which channels are enabled
//timer array index 1     2      3      4      5      6      7      8      9     10      11    12      13     14     15     16     17     18     19     20    21      22     23    24   
var cueEnabled = [TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE]

//Initialize Timer Value Array
var boardNumber = 1;
var CUEtimeoutArray = [];
var timerArray = [];

//intialize timerarray for 
//timer array index 1    2    3    4    5     6    7     8     9    10  11    12   13   14    15    16    17   18  19    20   21   22   23    24   

var timerArray = [[200, 400, 600, 800, 1000, 1200, 200, 400, 600, 800, 1000, 1200, 200, 400, 600, 800, 1000, 1200, 200, 400, 600, 800, 1000, 1200],
                  [200, 400, 600, 800, 1000, 1200, 200, 400, 600, 800, 1000, 1200, 200, 400, 600, 800, 1000, 1200, 200, 400, 600, 800, 1000, 1200],
                  [200, 400, 600, 800, 1000, 1200, 200, 400, 600, 800, 1000, 1200, 200, 400, 600, 800, 1000, 1200, 200, 400, 600, 800, 1000, 1200],
                  [200, 400, 600, 800, 1000, 1200, 200, 400, 600, 800, 1000, 1200, 200, 400, 600, 800, 1000, 1200, 200, 400, 600, 800, 1000, 1200],];

//timerArray[11] = 10000;
//timerArray[12] = 10000;
//timerArray[13] = 10000;
console.log(timerArray);

//Time to burn 
burnTime = 500;

mainLoop(); //call the main function

//funtion triggers CUEs on
function TriggerCUE(CUEindex)
{
    //ledArray[CUEindex].write(1);
    console.log("CUE ON!", CUEindex);
    setTimeout(CUEoff,burnTime,CUEindex);

}
        
//funtion triggers CUEs off
function CUEoff(CUEindex)
{
    //cueArray[CUEindex].write(0);
    console.log("CUE OFF!", CUEindex);
    // Call reset function at the end of the show..
    if(CUEindex == 13)
    {
        reset();
        ShowLED.write(0);
        console.log("Show LED OFF");
    }
        
}

//function sets timers for leds based on ms values in timer array
function setCUEtimer()
{
    for (var i = 11; i < 14; i++) {
        if (cueEnabled[i] = true){

            CUEtimeoutArray[i] = setTimeout(TriggerCUE,cueArray[i],i);

        }
        
    }
    console.log("Timers Set"); 
}

//function runs timed triggers when unit is switched into play mode
function runProgram()
{
        //Trigger program LED
        ShowLED.write(1);
        console.log("Show LED ON");
        console.log("Program Started");
        
        //Trigger LEDs timing
        setCUEtimer();
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
    console.log("Ready LED ON");
    setTimeout(periodicTrigger, 2000);
        
    
}
