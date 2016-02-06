// JavaScript File

//if string is empty it will insert just the pick, else it will insert a comma before the pick
//only generates and returns the string with pick appended, doesn't alter string.
String.prototype.insertPick = function(pick) {
    if(this.length === 0){
        return this + pick.toString();
    }
    else{
        return this + "," + pick;
    }
};

//takes a list of newspaperNumbers and returns an array of the solutions in
//number -> valid lotto number format
function filterLottoNumbers(newspaperNumbers) {
    var result = [];
    for (var number in newspaperNumbers) {
        console.log("Number gathered from Newspaper: " + newspaperNumbers[number]);
        var lottoCSV = generateValidLottoCSV(newspaperNumbers[number]);
        if(lottoCSV) {
            console.log("Success! " + lottoCSV + " is a valid Lotto Number for " + newspaperNumbers[number]);
            var successResult = newspaperNumbers[number] + " -> " + replaceAll(lottoCSV.toString(),","," ");
            result.push(successResult);
        }
        else {
            console.log("Failure! " + newspaperNumbers[number] + " does not have a valid Lotto Number!");
        }
    }
    return result;
}

//initialization for recursive function
//checks for valid length then calls recursion on 1 and 2 length lotto picks
function generateValidLottoCSV(newspaperNumber) {
    if(!isValidLength(newspaperNumber)){
        console.log("Failure! " + newspaperNumber + " has an invalid length");
        return null;
    }
    //these will either return null or a valid CSV string of picks
    return lottoNumberRecursion(newspaperNumber,"",0,1)
        || lottoNumberRecursion(newspaperNumber,"",0,2);
}

//checks for valid length, impossible to be valid if smaller than 7 or bigger than 14
function isValidLength(number) {
    return number.toString().length >= 7 && number.toString().length <= 14;
}

//Basecase 1: our currentIndex is too far for the newspaperNumber -> return null
//Basecase 2: our currentPicks are already >= 7 -> return null
//Basecase 3: the next pick given the current index and nextPickLength is invalid -> return null
//Gets next pick, adds it to the currentPicks, increments currentIndex
//checks if success -> returns the currentPicks CSV
//calls the recursion with nextPickLength 1 and 2
function lottoNumberRecursion(newspaperNumber, currentPicks, currentIndex, nextPickLength){
    if(currentIndex >= newspaperNumber.length){
        console.log(newspaperNumber + " has to backtrack because currentIndex === " + currentIndex);
        return null;
    }
    if(currentPicks.split(",").length >= 7){
        console.log(newspaperNumber + " has to backtrack because the current picks are already too long")
        return null;
    }
    var nextPick = getNextPick(newspaperNumber, currentIndex, nextPickLength);
    console.log("Next pick is " + nextPick);
    if(!isPickValid(nextPick, currentPicks)){
        console.log("pick " + nextPick + " is out of range or already used");
        return null;
    }
    currentPicks = currentPicks.insertPick(nextPick);
    currentIndex += nextPickLength;
    if(isValidLottoNumber(newspaperNumber, currentPicks, currentIndex)){
        return currentPicks;
    }
    return lottoNumberRecursion(newspaperNumber, currentPicks, currentIndex, 1)
        || lottoNumberRecursion(newspaperNumber, currentPicks, currentIndex, 2);
}

//gets a string the size of nextPickLength out of newspaperNumber by the currentIndex
//returns null if we go outside the bounds of newspaperNumber
function getNextPick(newspaperNumber, currentIndex, nextPickLength) {
    var result = "";
    if(newspaperNumber.length <= currentIndex + nextPickLength - 1){
        return null;
    }
    for(var i = 0; i < nextPickLength; i++){
        result += newspaperNumber.toString()[currentIndex+i];
    }
    return result;
}

//A valid pick is between 1-59 inclusive and is unique
function isPickValid(nextPick, currentPicks) {
    if(nextPick <= 59 && nextPick >= 1 && isPickUnique(nextPick, currentPicks)) {
        return true;
    }
    else{
        return false;
    }
}

//Checks for currentPicks length to be 7 and for it to be equivalent to the newspaperNumber
//we already know that only unique values 1-59 have been added so this means success
function isValidLottoNumber(newspaperNumber, currentPicks, currentIndex) {
    console.log("Is Valid lotto Number called for newspaperNumber: "+ newspaperNumber);
    console.log("With current picks: " + currentPicks);
    var picksNoCommas = replaceAll(currentPicks.toString(),",","")
    if(currentPicks.split(',').length === 7 && newspaperNumber === picksNoCommas) {
        return true;
    }
    else {
        return false;
    }
}

//checks that nextPick is not already in the currentPicks CSV
function isPickUnique(nextPick, currentPicks) {
    var array = currentPicks.split(',');
    if($.inArray(nextPick.toString(), array) === -1) {
        return true;
    }
    else {
        return false;
    }
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}


var newspaperNumbers = [ "1", "42",  "100848", "4938532894754", "1234567", "472844278465445", "11121314151617", "99999999", "-1203040294","7777777"];


function generateHTMLListFromArray(newspaperNumbers) {
    var result = "";
    for (var number in newspaperNumbers){
        result += "<li>" + newspaperNumbers[number]+ "</li>";
    }
    return result;
}

function appendTestCase(newNumber, newspaperNumbers) {
    if(Number(newNumber)){
        newspaperNumbers.push(newNumber.toString());
    }
}

function addTestCaseButtonClick() {
    var testCaseInput = document.getElementById("testCaseInput");
    var newInput = testCaseInput.value;
    testCaseInput.value = "";
    appendTestCase(newInput, newspaperNumbers);
    document.getElementById("testCases").innerHTML = generateHTMLListFromArray(newspaperNumbers);
}

function runTestCasesButtonClick() {
    var lottoNumbers = filterLottoNumbers(newspaperNumbers);
    var printString = "<br><h3>Results</h3> <br><ul>";
    printString += generateHTMLListFromArray(lottoNumbers);
    printString += "</ul>";
    document.getElementById("results").innerHTML = printString;
}


document.getElementById("testCases").innerHTML = generateHTMLListFromArray(newspaperNumbers);
document.getElementById("addTestCase").addEventListener("click", addTestCaseButtonClick);
document.getElementById("runTestCases").addEventListener("click", runTestCasesButtonClick);
   