let state = {
    current: "0",
    previous: null,
    operator: null,
    waiting: false,
    error: false,
}

const DEFAULT_STATE = {
    current: "0",
    previous: null,
    operator: null,
    waiting: false,
    error: false,
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
    } else if(isOperator(value)) {
        setOperator(value)
    }
}

function isOperator(v) {
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
    const result = document.querySelector(".app__result")

    result.textContent = state.current
    console.log(result.textContent)
}

function inputDigit(digit) {
    // если пользователь нажал на оператор
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
    
    const result = compute(a, op, b)

    state.current = String(result)
    state.previous = null;
    state.operator = null;
    state.waiting = true

    render()
}

init()

