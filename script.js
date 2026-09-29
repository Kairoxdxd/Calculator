let state = {
    current: "0",
    previous: null,
    operator: null,
    waiting: false,
    error: false,
    history: [
        // {
        //     expression: "",
        //     result: "", 
        // }
    ],
    justCalculated: false,
}

const DEFAULT_STATE = {
    current: "0",
    previous: null,
    operator: null,
    waiting: false,
    error: false,
    history: [],
    justCalculated: false,
}

const KEY_MAP = {
    "Enter": "=",
    "Escape": "AC",
    'Backspace': "backspace",
    ",": ".",
}

function mapKey(key) {
    if (key in KEY_MAP) {
        return KEY_MAP[key]
    } else if (isDigit(key) || isOperator(key)) {
        return key
    } else {
        return null
    }
}

// настройка обработчика и 1 рендер
function init() {
    handleClick()
    handleKeyDown()
    render()
}

function handleClick() {
    const calc = document.getElementById('calc')

    calc.addEventListener('click', (event) => {
        const res = event.target.closest('button')
        if (!res) return;
         handleInput(res.dataset.value);
    })
}

function handleKeyDown() {
     document.addEventListener('keydown', (event) => {
        const result = mapKey(event.key)
        if (result === null) {
            return
        }
        event.preventDefault();       
        handleInput(result)
    })
}
// решает, что делать с нажатой кнопкой
function handleInput(value) {
    if (isDigit(value)) {
        inputDigit(value)
    } else if (value === "backspace") {
        backspace();
    } else if (value === "AC") {
        clearAll();
    } else if (value === "=") {
        calculate()
    } else if (value === ".") {
        inputDot()
    } else if (value === "%") {
        percent()
    } else if(isOperator(value)) {
        setOperator(value)
    }
}

function isOperator(v) {
   state.justCalculated = false;

   if (v === "+") {
    return true
   } else if (v === "-") {
    return true
   } else if (v === "*") {
    return true
   } else if (v === "/") {
    return true
   } else {
    return false
   }

}

function isDigit(v) {
    return v >= "0" && v <= "9"
}

function render() {
    const result = document.querySelector(".app__result");
    const expression = document.getElementById('expression');
    expression.textContent =  updateExpression()
    result.textContent = state.current
}

function inputDigit(digit) {
    state.justCalculated = false;

    if (state.waiting) {
        state.current = digit;
        state.waiting = false;
    } else if (state.current === "0") {
        state.current = digit
    } else {
       state.current = state.current + digit
    }
    
    render()
}

function backspace() {
    state.justCalculated = false;

    if (state.waiting === true) {
        state.operator = null
        state.previous = null;
        state.waiting = false
    } else if(state.current.length <= 1) {
        state.current = "0"
    } else {
        state.current = state.current.slice(0, -1)
    }
    render()
}

function clearAll() {
    state = {...DEFAULT_STATE}

    render()
}

function compute(a, op, b) {
  switch(op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": if (b === 0) return null;
    return a / b;    
  }
}

function setOperator(op) {
    state.previous = state.current;
    state.operator = op;
    state.waiting = true;
    render()
}


function calculate() {
    if (state.previous === null || state.operator === null) {
        return
    }
    if (state.waiting) return

    let a = Number(state.previous)
    let op = state.operator
    let b = Number(state.current)
    
    const computed = compute(a, op, b)

    if (computed === null) {
        return
    }

    state.history.unshift({
        expression: state.previous + " " + state.operator + " " + state.current,
        result: String(computed)
    })
    state.current = String(computed)
    state.previous = null;
    state.operator = null;
    state.waiting = true;
    state.justCalculated = true;
    render()
}

function updateExpression() {

    if (state.justCalculated === true) {
       return state.history[0].expression + " ="
    }

    if (state.previous !== null) {
        let exp = state.previous + " " + state.operator

        if(!state.waiting) {
            exp = exp + " " + state.current
        }
        return exp
    }

    return ""
}


function inputDot() {
    state.justCalculated = false

    if (state.waiting === true) {
        state.current = "0."
        state.waiting = false
    } else if (!state.current.includes(".")) {
        state.current = state.current + "."
    }
    render()
}

function percent() {
    state.justCalculated = false;

    if (state.waiting || state.error) {
        return
    }

    if (state.operator === "+" || state.operator === "-") {
        state.current = String(Number(state.previous) * Number(state.current) / 100)
    } else {
        state.current = String(Number(state.current) / 100)
    }

    render()
}

init()

