let equation = [];
let num_moves = 0; //moves counter

window.addEventListener("DOMContentLoaded", domLoaded);

//This unction is where everything is leading
function domLoaded() {
    const buttons = getButtons();
    const opButtons = getOperatorButtons();

    setNumbers();


    for (let button of buttons) 
    {
        button.addEventListener("click", function() { boardButtonClicked(button); });
    }

    for (let button of opButtons) //adds button stuff to operator buttons  as well
    {
        button.addEventListener("click", function() { boardButtonClicked(button); })
    }
  
    // Add event listener for the "New Game" button
    //addEventListener is mean for click of for any kind of event like hovering
    //"click" is the key word given by Javascript
    document.getElementById("newGame").addEventListener("click", resetGame);

}


function setNumbers() {
    let numbers = []; // holds the four numbers

    for (let i = 0; i < 4; i++) {
        let num = parseInt(Math.random() * 10);
        numbers.push(num);
        num = num.toString();
    }
    //this seems to do the same thing but without the error
    const buttons = getButtons();
    for (let i = 0; i < 4; i ++)
    {
        buttons[i].innerHTML = numbers[i];
    }
    
    let target_num = 0;
    let rand_op1 = Math.floor((Math.random() * 3) + 1); // 1 - 3
    //performs operation on first 2 numbers
    if (rand_op1 == 1) {
        target_num = parseInt(numbers[0]) + parseInt(numbers[1]);
    } else if (rand_op1 == 2) {
        target_num = parseInt(numbers[0]) - parseInt(numbers[1]);
    } else {
        target_num = parseInt(numbers[0]) * parseInt(numbers[1]);
    }
    for (let i = 2; i < 4; i++) { // determine final target number
        let rand_op2 = Math.floor((Math.random() * 3) + 1); // 1 - 3
        if (rand_op2 == 1) {
            target_num = parseInt(target_num) + parseInt(numbers[i]);
        } else if (rand_op2 == 2) {
            target_num = parseInt(target_num) - parseInt(numbers[i]);
        } else {
            target_num = parseInt(target_num) * parseInt(numbers[i]);
        }
    }
    document.getElementById("targetValue").innerHTML = target_num;
}

function getButtons() {
    return document.querySelectorAll("#gameBoard > button");
}

function getOperatorButtons() {
    return document.querySelectorAll("#operators > button");
}

function getWorkArea() {
    return document.getElementById("workArea");
}

function boardButtonClicked(button) {
    let number = button.textContent;
    if (equation.length == 0 && number != "+" && number != "-" && number != "*") { //first input must be a number
        equation.push(number);
        changeInstruction();
        button.disabled = true; //button cant be clicked again
    } else if (equation.length == 1 && (number == "+" || number == "-" || number == "*")) { //second input must be an operation
        equation.push(number);
        changeInstruction();
        button.disabled = true; //button cant be clicked again
    } else if (equation.length == 2 && number != "+" && number != "-" && number != "*") { //third input must be a number
        equation.push(number);
        changeInstruction();
        button.disabled = true; //button cant be clicked again
        calculate(button);
    }
    //calculate(button);
}

//changes the instruction of whether to select a number or operator
function changeInstruction()
{   
    const buttons = getButtons();
    const opButtons = getOperatorButtons();
    
    if(equation.length == 0 || equation.length == 2)
    {
        gameInfo.innerHTML = "Select a Number";
    }
    else if(equation.length == 1)
    {
        gameInfo.innerHTML = "Select an Operator";
    }
}


//Calculates the answer based on the buttons
//Passes in last button clicked
function calculate(button) {
    if (equation.length == 3) //checks if both numbers have been selected
    {
        //we are renabling the result button
        button.disabled = false
        //These bottom three lines should enable the operator buttons each turn meaning you can press it multiple times. 
        document.getElementById("add").disabled = false;
        document.getElementById("minus").disabled = false;
        document.getElementById("multiplication").disabled = false;
        let workArea = getWorkArea();
        console.log("hi");
        let answer = 0;
        if (equation[1] == "+") //checks what the operator is and finds answer based on it
        {
            answer = parseInt(equation[0]) + parseInt(equation[2]);
        }
        else if (equation[1] == "-") {
            answer = parseInt(equation[0]) - parseInt(equation[2]);
        }
        else if (equation[1] == "*") {
            answer = parseInt(equation[0]) * parseInt(equation[2]);
        }
         //adds equation to work area
        if (!isNaN(answer)) {
            workArea.innerHTML += equation[0] + " " + equation[1] + " " + equation[2] + 
                " = " + answer + "<br>";
            changeButtons(); //makes the first button selected blank
            button.innerHTML = answer; //sets the second button selected to the answer
            num_moves += 1; 
            equation = []; //resets equation
        }
        equation = []; //resets equation
        if (num_moves == 3) {
            win_or_loss();
        }
    }
}

//Changes the button of the first number selected to be blank
function changeButtons()
{
    const buttons = getButtons();
    for (let button of buttons) {
        if(button.disabled == true) //checks which buttons are disabled and makes them blank
        {
            button.innerHTML = " ";
        }
    }
}

//This function hendles reseting the game
function resetGame(){
    // Clear equation array
    equation = [];
    num_moves = 0; //reset moves counter
    gameInfo.innerHTML = "Select a Number";
    // Enable all buttons
    const allButtons = document.querySelectorAll("#gameBoard > button, #operators > button");
    allButtons.forEach(button => {
        button.disabled = false;
    });

    // Clear work area and set content equivalent to <h2>Work Area</h2>
    const workArea = document.getElementById("workArea");
    workArea.innerHTML = ""; // Clear existing content

    // Create an h2 element
    const h2Element = document.createElement("h2");
    h2Element.textContent = "Work Area";

    // Append the h2 element to the workArea
    workArea.appendChild(h2Element);

    // Generate new numbers and target value
    setNumbers();
}

//This fucntion handles the winning and losing
function win_or_loss(){
    const targetValue = parseInt(document.getElementById("targetValue").innerHTML);
    const answerButtons = getButtons();
    let currentAnswer = 0;

    // Calculate the current answer based on the displayed buttons
    for (let button of answerButtons) {
        if (!isNaN(parseInt(button.innerHTML))) {
            currentAnswer = parseInt(button.innerHTML);
            break;
        }
    }

    // Compare the current answer with the target value
    if (currentAnswer === targetValue) {
        // Player wins
        gameInfo.innerHTML = "You win!";
        let score = document.getElementById("wins").innerHTML;
        score = parseInt(score) + 1;
        document.getElementById("wins").innerHTML = score;
    } else {
        // Player loses
        gameInfo.innerHTML = "You lose!";
        let score = document.getElementById("losses").innerHTML;
        score = parseInt(score) + 1;
        document.getElementById("losses").innerHTML = score;
    }
}

