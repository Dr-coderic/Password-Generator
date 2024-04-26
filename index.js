//this is how we use custome selectors
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator  = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
// selecting all the checkboxes via input tag
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '`~!@#$%^&*()_+=-[]{};:"|,./<>?';

//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

// set strength circle to grey
setIndicator("#ccc");
 

// set passwordLength via slider
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText= passwordLength;
    //DO WE NEED TO DO SOMETHING MORE -- H.W.
    // To color-seperate from the position of thumb on slider, violet to left and blackish on right 
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"; //width(Formula) + height(100%)

}

function setIndicator(color){
    //two functions of this Fnc, 1. set color of indicator, 2. set shadow of indicator
    indicator.style.backgroundColor = color;
    //H.W. -- set shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;

}

function getRndInteger(min, max){
    return Math.floor(Math.random() * (max - min) ) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase(){
    // this is how we are going to convert a ASCII number into lower case alphabet
        return String.fromCharCode(getRndInteger(97,123)) ; //123 is exclusive
}

function generateUpperCase(){
    // this is how we are going to convert a ASCII number into lower case alphabet
        return String.fromCharCode(getRndInteger(65,91)) ; //91 is exclusive
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) 
        hasUpper = true;
    if(lowercaseCheck.checked) 
        hasLower = true;
    if(numbersCheck.checked) 
        hasNum = true;
    if(symbolsCheck.checked) 
        hasSym = true;

    if(hasLower && hasUpper && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator('#0f0');
    } else if (
        (hasLower || hasUpper) &&
        (hasSym || hasNum)&&
        passwordLength >=6
    ){
        setIndicator('#ff0');
    }else{
        setIndicator('#f00');
    }
}

//copied - span ko set karr re hai yaha
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    } catch (e) {
        copyMsg.innerText = "failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");
    
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

// //ALTERNATE COPY FUNCTION
// async function copyContent() {
//     try {
//         // Create a DataTransfer object
//         const dataTransfer = new DataTransfer();
//         // Set the data to be copied
//         dataTransfer.setData('text/plain', passwordDisplay.value);

//         // Write the data to the clipboard
//         await navigator.clipboard.write(dataTransfer);

//         // If successful, update the message
//         copyMsg.innerText = "copied";
//     } catch (e) {
//         // If unsuccessful, update the message
//         copyMsg.innerText = "failed";
//     }

//     // Remove the "active" class after 2 seconds
//     setTimeout(() => {
//         copyMsg.classList.remove("active");
//     }, 2000);
// }




function shufflePassword(array){
    //Fisher Yates Method
    for(let i =array.length-1; i>0; i--){
        //finding out random j, using random()
        const j = Math.floor(Math.random() * (i + 1));
        //swaping  elements at i and j indexes 
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}
function handleCheckBoxChange(){
    checkCount =0;
    allCheckBox.forEach((checkbox) =>{
        if(checkbox.checked)
            checkCount++;
    });

    //SPECIAL CORNER CASE
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

inputSlider.addEventListener('input', (eve) => {
    passwordLength = eve.target.value;
    handleSlider();
});

copyBtn.addEventListener( 'click' , ()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})


generateBtn.addEventListener('click', () => {
    //none of the checkbox is checked
    if(checkCount <=0)
        return;
    if(passwordLength < checkCount){
        passwordLength  = checkCount;
        handleSlider();
    }

    // Now algorithm to find the new  password
    // // now to find new password, remove the old password
    password = "";
    console.log(" Starting the new pass journey");
    
    // //let's put the stuff mentioned by the checkboxes
    // if(uppercaseCheck.checked){
        //     password += generateUpperCase();
        // }
        // if(lowercaseCheck.checked){
        //     password += generateLowerCase();
        // }
        // if(numbersCheck.checked){
        //     password += generateRandomNumber();
        // }
        // if(symbolsCheck.checked){
        //     password += generateSymbol();
        // }
                    
                    
        //now to pick randomly all checked variable,  we need to push them into an array and then itrate through it to 
        //get the randomly  generated number and append it to the password till its length becomes equal to that of password length
        let funcArr = [];
        if(uppercaseCheck.checked)
            funcArr.push(generateUpperCase);
        if(lowercaseCheck.checked)
            funcArr.push(generateLowerCase);
        if(numbersCheck.checked)
            funcArr.push(generateRandomNumber);
        if(symbolsCheck.checked)
            funcArr.push(generateSymbol);
    
    //compulsory addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i](); //WHY DO WE DO FUNCTION CALL HERE
        
    }
    console.log("compulsory addition done");
    //filling up remaining spaces
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        console.log("RandIndex " + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("remaining addition done ");
    
    // now also still password will come in siquence in which functions are checked, so we are going to shuffel the password
    //SHUFFLE THE PASSWORD
    password = shufflePassword(Array.from(password));
    console.log("Shfulling done ");
    
    //show password in UI
    passwordDisplay.value = password;
    console.log("UI Addition done ");
    
    //calculate strength
    calcStrength();
    
});