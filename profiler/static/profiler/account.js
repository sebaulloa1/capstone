document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#change-goal-form').onsubmit = function() {
        changeGoal();
        return false
    }
});

function changeGoal() {
    let goals = {}
    goals = {'calories': document.querySelector('#calories').value, 'protein': document.querySelector('#protein').value, 'fat': document.querySelector('#fat').value, 'carbs': document.querySelector('#carbs').value};
    console.log(document.querySelector('#protein').value)
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
    })
    console.log(goals);
}