document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.add-meal-btn').forEach(function(btn) {
        let meal = btn.dataset.meals
        btn.addEventListener('click', () => {addMeal(meal)})
    })
})

const delay = (function(){
    var timer = 0;
    return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();

function addMeal(meal) {
    
    console.log('clicked', meal);
    // Get the meal form container
    const add_meal_form_container = document.querySelector('.add-meal-form-container');
    add_meal_form_container.innerHTML = '';
    // Create a button div to add a form for more ingredients
    const form_btns = document.createElement('div');
    form_btns.innerHTML = `<button class="add-ingredient-btn">Add Ingredient</button><input class="submit-meal" type="submit" value="Submit">`;
    // Create the form
    const meal_form = document.createElement('form');
    // Create a template for the ingredient form
    const form_row = `
        <div>
            <label for="ingredients">Ingredient:</label>
            <input class="ingredient-input" type="text" name="ingredient">
            <label for="measures">Measure:</label>
            <select class="measures-input" disabled name="measures">
            </select>
            <label for="quantity">Quantity:</label>
            <input type="number" class="quantity-input" name="quantity">
        </div>
    `;
    // Set a title for the form depending on the meal clicked and add a row
    meal_form.innerHTML = `<h2>${meal.toUpperCase()}</h2>` + form_row;
    meal_form.className = 'add-ingredient-form';
    // Add the ingredient form to the container
    add_meal_form_container.append(meal_form);
    // Add the buttons div to the container
    add_meal_form_container.insertAdjacentElement('beforeend', form_btns)
    // Create a click listener to the add ingredient button
    document.querySelector('.add-ingredient-btn').addEventListener('click', () => {
        // Add another ingredient form
        meal_form.insertAdjacentHTML('beforeend', form_row);
        // Create an event listener for keyup to fill the measures options depending on the ingredient name
        let ingr_name = document.querySelectorAll('.ingredient-input');
        ingr_name.forEach(function(input) {
            input.addEventListener('keyup', () => {
                // Have a little delay after every keyup, to make sure the user stopped writing
                delay(() => {
                    measuresAPI(input)
                }, 1250)
            })
        });
    })
    let ingr_name = document.querySelector('.ingredient-input')
    ingr_name.addEventListener('keyup', () => {
        delay(() => {
            measuresAPI(ingr_name)
        }, 1250)  
    })

    const datetime = document.querySelector("#date").dataset.timestamp;
    document.querySelector('.submit-meal').addEventListener('click', () => {
        let new_meal = [];
        let form_elements = document.querySelector('.add-ingredient-form').elements;
        for (let x = 0; x < form_elements.length; x += 3) {
            let ingredient = {};
            ingredient['name'] = form_elements[x].value;
            ingredient['id'] = form_elements[x].dataset.ingr_id;
            ingredient['measure'] = form_elements[x+1].value;
            ingredient['qty'] = form_elements[x+2].value;
            new_meal.push(ingredient);
        };
        console.log(new_meal);
        fetch('/new_meal', {
            method: 'POST',
            body: JSON.stringify({
                meal: new_meal,
                date: datetime,
                meal_time: meal
            })
        })
        .then(response => console.log(response))
    });
    
    console.log(datetime)
}

function measuresAPI(input) {
    fetch(`https://api.edamam.com/api/food-database/v2/parser?ingr=${encodeURI(input.value)}&app_id=e572f575&app_key=5e459acdcb817d770ab8212e966bdfb6`)
    .then(response => response.json())
    .then(result => {
        console.log(result);
        console.log(input.value)
        input.parentElement.querySelector('.measures-input').disabled = false;
        for (var x = 0; x < result['hints'].length; x++) {
            if (result['hints'][x]['food']['label'].localeCompare(input.value, undefined, {sensitivity: 'base'}) === 0) {
                for (var i = 0; i < result['hints'][x]['measures'].length; i++) {
                    var option = document.createElement("option");
                    option.value = result['hints'][x]['measures'][i]['uri'];
                    option.text = result['hints'][x]['measures'][i]['label'];
                    input.parentElement.querySelector('.measures-input').appendChild(option);
                }
                input.dataset.ingr_id = result['hints'][x]['food']['foodId'];
                break
            }
        }
        
    })
}

