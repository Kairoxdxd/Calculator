let state = {
    current: "0",
    previous: null,
    operator: null,
    waiting: false,
    error: false,
}


function init() {
    const calc = document.getElementById('calc')

    calc.addEventListener('click', (event) => {
        const res = event.target.closest('button')
        if (!res) return;
         handleInput(res.dataset.value);
    })

    render()
}

function handleInput(value) {
    if (isDigit(value)) {
        inputDigit(value)
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

init()
render()
