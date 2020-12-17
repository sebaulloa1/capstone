document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#change-goal-form').onsubmit = function() {
        changeGoal();
        return false
    };
    document.querySelector('#change-pass-form').onsubmit = function () {
        changePass();
        return false
    };
});

function changeGoal() {
    let goals = {}
    let calories = document.querySelector('#calories').value;
    let protein = document.querySelector('#protein').value;
    let fat = document.querySelector('#fat').value;
    let carbs = document.querySelector('#carbs').value;
    goals = {'calories': calories, 'protein': protein, 'fat': fat, 'carbs': carbs};
    console.log(document.querySelector('#protein'))
    for (macro in goals) {
        console.log(macro)
        if (!goals[macro]) {
            alert('Invalid input')
            return
        }
    }
    fetch('/account', {
        method: 'POST',
        body: JSON.stringify({
            goals: goals})
    })
    .then(response => response.json())
    .then(result => {
        console.log(result)
        document.querySelector('.goal-calories').innerHTML = result['goals']['calories'];
        document.querySelector('.goal-protein').innerHTML = result['goals']['protein'];
        document.querySelector('.goal-fat').innerHTML = result['goals']['fat'];
        document.querySelector('.goal-carbs').innerHTML = result['goals']['carbs'];
        alert('Goals changed succesfully')
    })
    console.log(goals);
}

function changePass() {
    let change_pass = {};
    let current_pass = document.querySelector('#current-pass').value;
    let new_pass = document.querySelector('#new-pass').value;
    let new_pass_confirmation = document.querySelector('#new-pass-confirmation').value;
    if (new_pass != new_pass_confirmation) {
        alert('New password and confirmation dont match')
        return
    }
    change_pass = {'current': current_pass, 'new': new_pass, 'confirmation': new_pass_confirmation};
    fetch("/password_change", {
        method: 'POST',
        body: JSON.stringify({
            change_pass: change_pass
        })
    })
    .then(response => response.text())
    .then(result => {
        console.log(result)
        alert(result)
        document.querySelector('#change-pass-form').reset();
    })
    
}