document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.add-meal-btn').forEach(function(btn) {
        btn.addEventListener('click', () => {addMeal()})
    })
})

const delay = (function(){
    var timer = 0;
    return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();

function addMeal() {
    const test_form_container = document.querySelector('.test-form-container');
    const test_form = document.createElement('form');
    const form_row = `
        <div>
            <input class="ingr-name" type="text">
            <select class="measures-input" disabled>
            <input type="number" class="ingr-qty">
            </select>
        </div>
    `;
    const form_btns = document.createElement('div');
    form_btns.innerHTML = `<button class="add-ingredient-btn">Add Ingredient</button><input class="submit-meal" type="submit" value="Submit">`;
    test_form_container.append(test_form);
    test_form.innerHTML = form_row;
    test_form_container.insertAdjacentElement('beforeend', form_btns);
    document.querySelector('.add-ingredient-btn').addEventListener('click', () => {
        test_form.insertAdjacentHTML('beforeend', form_row);
        let ingr_name = document.querySelectorAll('.ingr-name')
        ingr_name.forEach(function(input) {
            input.addEventListener('keyup', () => {
                delay(() => {
                    api(input)
                }, 1250)
            })
        })
    })
    let ingr_name = document.querySelector('.ingr-name')
    ingr_name.addEventListener('keyup', () => {
        delay(() => {
            api(ingr_name)
        }, 1250)  
    })
}

function api(input) {
    fetch(`https://api.edamam.com/api/food-database/v2/parser?ingr=${encodeURI(input.value)}&app_id=e572f575&app_key=5e459acdcb817d770ab8212e966bdfb6`)
    .then(response => response.json())
    .then(result => {
        console.log(result);
        input.parentElement.querySelector('.measures-input').disabled = false;
        for (var i = 0; i < result['hints'][0]['measures'].length; i++) {
            var option = document.createElement("option");
            option.value = result['hints'][0]['measures'][i]['uri'];
            option.text = result['hints'][0]['measures'][i]['label'];
            input.parentElement.querySelector('.measures-input').appendChild(option);
        }
    })
}

