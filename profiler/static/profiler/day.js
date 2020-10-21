document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.add-meal-btn').forEach(function(btn) {
        let meal = btn.dataset.meals
        btn.addEventListener('click', () => {addMeal(meal)})
    })
    document.querySelector("#food-search").addEventListener('click', function() {
        fatSecret(0)
    })
})

const delay = (function(){
    var timer = 0;
    return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();


function throttle(fn,d){
    let flag=true;
    return function(){
        let context=this,
        args=arguments
        if(flag){
            fn.apply(context,args);
            flag=false;
            setTimeout(()=>{
                flag=true;
            },d);
        }
    }
}

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
            <input class="ingredient-input" type="text" name="ingredient" list="autocomplete">
            <datalist id="autocomplete"></datalist>
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
                throttle(autocomplete(input), 1000)
                // Have a little delay after every keyup, to make sure the user stopped writing
                delay(() => {
                    measuresAPI(input)
                }, 1250)
            })
        });
    })
    let ingr_name = document.querySelector('.ingredient-input')
    ingr_name.addEventListener('keyup', () => {
        throttle(autocomplete(ingr_name), 1000)
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

function autocomplete(input) {
    let autocomplete_datalist = input.nextElementSibling;
    console.log(autocomplete_datalist);
    fetch(`https://api.edamam.com/auto-complete?q=${input.value}&limit=10&app_id=e572f575&app_key=5e459acdcb817d770ab8212e966bdfb6`, {
        headers: {
            'Access-Control-Allow-Origin': 'https://api.edamam.com/auto-complete'
        }
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        for (let i = 0; i < 10; i++) {
            let option = document.createElement('option');
            option.innerHTML = result[i];
            autocomplete_datalist.appendChild(option)
        }
    })

}

function fatSecret(page_num) {
    if (page_num < 0) {
        page_num = 0
    }
    let food_name = document.querySelector("#food-search-name").value;
    // Add value checker
    fetch(`/foods_search/${food_name}/${page_num}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        const food_search_container = document.querySelector('#food-search-container');
        const food_search_results = document.createElement('div');
        food_search_results.id = 'foods-search';
        food_search_results.innerHTML = `
            <table id="foods-search-table" cellpadding='0' cellspacing='0'>
                <tbody>
                </tbody>
            </table>
        `;
        food_search_container.append(food_search_results);
        let total_pages = result['results']['foods']['total_results'];
        if (total_pages % 10 !== 0) {
            total_pages = Math.floor(total_pages / 10)
        } else (
            total_pages = total_pages / 10
        );
        console.log(total_pages);
        const table_body = document.querySelector('#foods-search-table').querySelector('tbody');
        table_body.innerHTML = `
            <tr>
                <td>Search results for: ${food_name}</td>
                <td align="right">${(page_num * 10) + 1} to ${(page_num * 10) + 10} of ${result['results']['foods']['total_results']}</td>
            </tr>
        `;
        for (food of result['results']['foods']['food']) {
            console.log(food)
            let table_row = `
                <tr>
                    <td class="table-food-option"><a href="javascript:void(0)" onclick="foodSearch(${food.food_id},'${food_name}',${page_num}, 0);">${food.food_name}</a></td>
                    <div>${food.food_description}</div>
                </tr>
            `;
            table_body.insertAdjacentHTML('beforeend', table_row);
        }
        let pages_btns = document.createElement('tr');
        pages_btns.innerHTML = `
            <td align="center">
                <span class="pages-btns-label">Result Page: </span>
                <a href="javascript:void(0)" onclick="fatSecret(0);">First</a>
                <a href="javascript:void(0)" onclick="fatSecret(${page_num - 1});">Prev</a>
                <span>${page_num + 1}</span>
                <a href="javascript:void(0)" onclick="fatSecret(${page_num + 1});">Next</a>
                <a href="javascript:void(0)" onclick="fatSecret(${total_pages + 1});">Last</a>
            </td>
        `;
        table_body.insertAdjacentElement("beforeend", pages_btns);
    })
}

function foodSearch(food_id, food_name, page_num, serving) {
    const food_search_results = document.querySelector('#foods-search');
    food_search_results.innerHTML = '';
    fetch(`food_get/${food_id}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        food_search_results.innerHTML = `
            <div class="nutrition-panel-heading"><b>${result['food']['food']['food_name']}</b>${result['food']['food']['servings']['serving'][0]['measurement_description']}</div>
        `;
        makeNutritionPanel(result, 0);
    })
}

function makeNutritionPanel(json, serving) {
    const food = json['food']['food'];
    console.log(food);
    const nutrition_panel = document.createElement('div');
    nutrition_panel.id = 'nutrition-panel';
    nutrition_panel.innerHTML = `
    <div class="panel-left">
        <table>
            <tbody>
                <tr>
                    <td colspan="3">
                        <span class="nutrition-facts">Nutrition Facts</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <span class="serving-size">${food['servings']['serving'][serving]['measurement_description']}</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">Amount per serving</td>
                </tr>
                <tr>
                    <td colspan="2">Calories</td>
                    <td colspan="1">${food['servings']['serving'][serving]['calories']}</td>
                </tr>
                <tr>
                    <td colspan="2">
                        <span class="nutrition-panel-macro">Total Fat</span>
                    </td>
                    <td colspan="1">${food['servings']['serving'][serving]['fat']}</td>
                </tr>
                <tr>
                    &nbsp;
                    <td colspan="2">Saturated Fat</td>
                    <td colspan="1">${food['servings']['serving'][serving]['saturated_fat']}</td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                    <td colspan="2">Polyunsaturated Fat</td>
                    <td colspan="1">${food['servings']['serving'][serving]['polyunsaturated_fat']}</td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                    <td colspan="2">Monounsaturated Fat</td>
                    <td colspan="1">${food['servings']['serving'][serving]['monounsaturated_fat']}</td>
                </tr>
                <tr>
                    <td colspan="2">
                        <span class="nutrition-panel-macro">Cholesterol</span>
                    </td>
                    <td colspan="1">${food['servings']['serving'][serving]['cholesterol']}</td>
                </tr>
                <tr>
                    <td colspan="2">
                        <span class="nutrition-panel-macro">Sodium</span>
                    </td>
                    <td colspan="1">${food['servings']['serving'][serving]['sodium']}</td>
                </tr>
                <tr>
                    <td colspan="2">
                        <span class="nutrition-panel-macro">Potassium</span>
                    </td>
                    <td colspan="1">${food['servings']['serving'][serving]['potassium']}</td>
                </tr>
                <tr>
                    <td colspan="2">
                        <span class="nutrition-panel-macro">Total Carbohydrate</span>
                    </td>
                    <td colspan="1">${food['servings']['serving'][serving]['carbohydrate']}</td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                    <td colspan="2">Dietary Fiber</td>
                    <td colspan="1">${food['servings']['serving'][serving]['fiber']}</td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                    <td colspan="2">Sugars</td>
                    <td colspan="1">${food['servings']['serving'][serving]['sugar']}</td>
                </tr>
                <tr>
                    <td colspan="2">
                        <span class="nutrition-panel-macro">Protein</span>
                    </td>
                    <td colspan="1">${food['servings']['serving'][serving]['protein']}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="panel-right">
        <div>Common Serving Sizes</div>
        <ul class="servings-list">
        </ul>
    </div>
    `;
    const food_search_results = document.querySelector('#foods-search');
    food_search_results.insertAdjacentElement('beforeend', nutrition_panel);
    const servings_list = document.querySelector('.servings-list');
    for (let i = 0; i < food['servings']['serving'].length; i++) {
        if (i == serving) {
            let list_item = document.createElement('li');
            list_item.className = 'serving-selected';
            list_item.innerHTML = `<a href="javascript=void(0)">${food['servings']['serving'][serving]['measurement_description']}</a>`;
            servings_list.appendChild(list_item);
        } else {
            let list_item = document.createElement('li');
            list_item.innerHTML = `<a href="javascript=void(0)">${food['servings']['serving'][i]['measurement_description']}</a>`;
            servings_list.appendChild(list_item);
        }
    }
}