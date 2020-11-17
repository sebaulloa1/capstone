document.addEventListener('DOMContentLoaded', function() {
    renderChart();  
    document.querySelectorAll('.add-meal-btn').forEach(function(btn) {
        let meal = btn.dataset.meals
        btn.addEventListener('click', () => {addMealStart(meal)})
    });
    document.querySelector("#food-search").addEventListener('click', function() {
        fatSecret(0)
    });
    document.querySelector('#food-search-form').onsubmit = function() {
        console.log('submitted');
        fatSecret(0);
        return false;
    }
})

let new_meal_dict = {};

function addMealStart(meal) {
    console.log('clicked', meal);
    const add_meal_container = document.querySelector('.add-meal-container');
    add_meal_container.style.display = "grid";
    const new_meal_list_container = document.querySelector('.new-meal-list-container');
    new_meal_list_container.innerHTML = `
        <h2>New <span id="meal">${meal.toUpperCase()}</span></h2>
        <ol class="new-meal-list">
        </ol>
    `;
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
        if (result['results'].hasOwnProperty('error')) {
            alert('Invalid IP')
            return
        }
        const food_search_container = document.querySelector('#food-search-container');
        const food_search_results = document.createElement('div');
        food_search_results.id = 'foods-search';
        food_search_results.innerHTML = `
            <table id="foods-search-table" cellpadding='0' cellspacing='0'>
                <tbody>
                    <colgroup>
                        <col width="*">
                        <col width="*">
                    </colgroup>
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
                <td class="table-bottom-border foods-search-table-heading">Search results for: ${food_name}</td>
                <td class="table-bottom-border foods-search-total" align="right">${(page_num * 10) + 1} to ${(page_num * 10) + 10} of ${result['results']['foods']['total_results']}</td>
            </tr>
        `;
        for (food of result['results']['foods']['food']) {
            console.log(food)
            let table_row = `
                <tr>
                    <td colspan="2" class="table-bottom-border table-food-option">
                        <a href="javascript:void(0)" onclick="foodSearch(${food.food_id},'${food_name}',${page_num}, 0);">${food.food_name} ${food.hasOwnProperty('brand_name') ? '(' + food.brand_name + ')' : ''}</a>
                        <div>${food.food_description}</div>
                    </td>
                </tr>
            `;
            table_body.insertAdjacentHTML('beforeend', table_row);
        }
        let pages_btns = document.createElement('tr');
        pages_btns.innerHTML = `
            <td colspan="2" align="center" class="paging-btns-td">
                <span class="pages-btns-label">Result Page: </span>
                <a class="paging-btns" href="javascript:void(0)" onclick="fatSecret(0);">First</a>
                <a class="paging-btns" href="javascript:void(0)" onclick="fatSecret(${page_num - 1});">Prev</a>
                <span class="selected">${page_num + 1}</span>
                <a class="paging-btns" href="javascript:void(0)" onclick="fatSecret(${page_num + 1});">Next</a>
                <a class="paging-btns" href="javascript:void(0)" onclick="fatSecret(${total_pages + 1});">Last</a>
            </td>
        `;
        table_body.insertAdjacentElement("beforeend", pages_btns);
        return false
    })
    
}

function foodSearch(food_id, food_name, page_num, serving) {
    const food_search_results = document.querySelector('#foods-search');
    fetch(`/food_get/${food_id}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        if (result['food'].hasOwnProperty('error')) {
            alert('Invalid IP');
            return
        }
        if (document.querySelector('.nutrition-panel-heading') != null) {
            document.querySelector('.nutrition-panel-heading').innerHTML = `
                <div><span class="heading-food-title">${result['food']['food']['food_name']} ${result['food']['food'].hasOwnProperty('brand_name') ? '(' + result['food']['food']['brand_name'] + ')' : ''}</span></div>
                <div>
                    <span class="heading-food-description">${result['food']['food']['servings']['serving'].hasOwnProperty('0') == true ? result['food']['food']['servings']['serving'][serving]['serving_description'] : result['food']['food']['servings']['serving']['serving_description']}</span>
                    <span class="heading-food-sub-description">${result['food']['food']['servings']['serving'].hasOwnProperty('0') == true ? '(' + Math.round(result['food']['food']['servings']['serving'][serving]['metric_serving_amount']) + ' ' + result['food']['food']['servings']['serving'][serving]['metric_serving_unit'] + ')' : '(' + Math.round(result['food']['food']['servings']['serving']['metric_serving_amount']) + result['food']['food']['servings']['serving']['metric_serving_unit'] + ')'}</span>   
                </div>
            `;
        } else {
            let food_result = `
            <div class="nutrition-panel-heading">
                <div><span class="heading-food-title">${result['food']['food']['food_name']} ${result['food']['food'].hasOwnProperty('brand_name') ? '(' + result['food']['food']['brand_name'] + ')' : ''}</span></div>
                <div>
                    <span class="heading-food-description">${result['food']['food']['servings']['serving'].hasOwnProperty('0') == true ? result['food']['food']['servings']['serving'][serving]['serving_description'] : result['food']['food']['servings']['serving']['serving_description']}</span>
                    <span class="heading-food-sub-description">${result['food']['food']['servings']['serving'].hasOwnProperty('0') == true ? '(' + Math.round(result['food']['food']['servings']['serving'][serving]['metric_serving_amount']) + ' ' + result['food']['food']['servings']['serving'][serving]['metric_serving_unit'] + ')' : '(' + Math.round(result['food']['food']['servings']['serving']['metric_serving_amount']) + result['food']['food']['servings']['serving']['metric_serving_unit'] + ')'}</span>   
                </div>
            </div>
        `;
        food_search_results.insertAdjacentHTML('afterbegin', food_result)
        }
         makeNutritionPanel(result, serving, page_num);
    })
}

function makeNutritionPanel(json, serving, page_num) {
    const food = json['food']['food'];
    console.log(food);
    let nutrition_panel_template = `
    <div class="panel-left">
        <div class="nutrition-table">
            <table>
                <colgroup>
                    <col width="5">
                    <col width="*">
                    <col width="40">
                </colgroup>
                <tbody>
                    <tr>
                        <td colspan="3">
                            <span class="nutrition-facts">Nutrition Facts</span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <span class="serving-size">Serving Size ${food['servings']['serving'].hasOwnProperty(serving) == true ? food['servings']['serving'][serving]['serving_description'] : food['servings']['serving']['serving_description']}</span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" class="table-separator"></td>
                    </tr>
                    <tr>
                        <td class="table-bottom-border" colspan="3"><span class="amount-per-serving">Amount per serving</span></td>
                    </tr>
                    <tr>
                        <td class="table-bottom-border" colspan="2">
                            <span class="nutrition-panel-macro">Calories</span>
                        </td>
                        <td class="table-bottom-border table-nutrient-value">${food['servings']['serving'].hasOwnProperty(serving) ? food['servings']['serving'][serving]['calories'] : food['servings']['serving']['calories']}</td>
                    </tr>
                    <tr>
                        <td class="table-bottom-border" colspan="2">
                            <span class="nutrition-panel-macro">Total Fat</span>
                        </td>
                        <td class="table-bottom-border table-nutrient-value">${food['servings']['serving'].hasOwnProperty(serving) ? food['servings']['serving'][serving]['fat'] : food['servings']['serving']['fat']}</td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td class="table-bottom-border">Saturated Fat</td>
                        <td class="table-bottom-border table-nutrient-value">${food['servings']['serving'].hasOwnProperty(serving) ? food['servings']['serving'][serving]['saturated_fat'] : food['servings']['serving']['saturated_fat']}</td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td class="table-bottom-border">Polyunsaturated Fat</td>
                        <td class="table-bottom-border table-nutrient-value">${food['servings']['serving'].hasOwnProperty(serving) ? food['servings']['serving'][serving]['polyunsaturated_fat'] : food['servings']['serving']['polyunsaturated_fat']}</td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td class="table-bottom-border">Monounsaturated Fat</td>
                        <td class="table-bottom-border table-nutrient-value">${food['servings']['serving'].hasOwnProperty(serving) ? food['servings']['serving'][serving]['monounsaturated_fat'] : food['servings']['serving']['monounsaturated_fat']}</td>
                    </tr>
                    <tr>
                        <td class="table-bottom-border" colspan="2">
                            <span class="nutrition-panel-macro">Cholesterol</span>
                        </td>
                        <td class="table-bottom-border table-nutrient-value">${food['servings']['serving'].hasOwnProperty(serving) ? food['servings']['serving'][serving]['cholesterol'] : food['servings']['serving']['cholesterol']}</td>
                    </tr>
                    <tr>
                        <td class="table-bottom-border" colspan="2">
                            <span class="nutrition-panel-macro">Sodium</span>
                        </td>
                        <td class="table-bottom-border table-nutrient-value">${food['servings']['serving'].hasOwnProperty(serving) ? food['servings']['serving'][serving]['sodium'] : food['servings']['serving']['sodium']}</td>
                    </tr>
                    <tr>
                        <td class="table-bottom-border" colspan="2">
                            <span class="nutrition-panel-macro">Potassium</span>
                        </td>
                        <td class="table-bottom-border table-nutrient-value">${food['servings']['serving'].hasOwnProperty(serving) ? food['servings']['serving'][serving]['potassium'] : food['servings']['serving']['potassium']}</td>
                    </tr>
                    <tr>
                        <td class="table-bottom-border" colspan="2">
                            <span class="nutrition-panel-macro">Total Carbohydrate</span>
                        </td>
                        <td class="table-bottom-border table-nutrient-value">${food['servings']['serving'].hasOwnProperty(serving) ? food['servings']['serving'][serving]['carbohydrate'] : food['servings']['serving']['carbohydrate']}</td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td class="table-bottom-border">Dietary Fiber</td>
                        <td class="table-bottom-border table-nutrient-value">${food['servings']['serving'].hasOwnProperty(serving) ? food['servings']['serving'][serving]['fiber'] : food['servings']['serving']['fiber']}</td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td class="table-bottom-border">Sugars</td>
                        <td class="table-bottom-border table-nutrient-value">${food['servings']['serving'].hasOwnProperty(serving) ? food['servings']['serving'][serving]['sugar'] : food['servings']['serving']['sugar']}</td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span class="nutrition-panel-macro">Protein</span>
                        </td>
                        <td class="table-nutrient-value">${food['servings']['serving'].hasOwnProperty(serving) ? food['servings']['serving'][serving]['protein'] : food['servings']['serving']['protein']}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="panel-right">
        <div class="serving-selector">
            <div class="servings-heading">Common Serving Sizes</div>
            <ul class="servings-list">
            </ul>
            <div class="food-add-container">
                <form id="add-new-food-form">
                    <label for="quantity">Quantity: </label>
                    <input class="quantity-input" name="quantity" type="number">
                </form>    
                <button id="add-new-food" autofocus>Add</button>
            </div>
        </div>
    </div>
    `;
    console.log(document.body.contains(document.querySelector('#nutrition-panel')))
    if (document.body.contains(document.querySelector('#nutrition-panel'))) {
        let nutrition_panel = document.getElementById('nutrition-panel');
        nutrition_panel.innerHTML = nutrition_panel_template;
    } else {
        console.log('is it?')
        let nutrition_panel = document.createElement('div');
        nutrition_panel.id = 'nutrition-panel';
        nutrition_panel.innerHTML = nutrition_panel_template;
        const food_search_heading = document.querySelector('.nutrition-panel-heading');
        food_search_heading.insertAdjacentElement('afterend', nutrition_panel);
    }
    const servings_list = document.querySelector('.servings-list');
    if (food['servings']['serving'].hasOwnProperty(serving) == false) {
        let list_item = document.createElement('li');
        list_item.className = 'table-bottom-border';
        list_item.innerHTML = `<a class="serving-selected" href="javascript:void(0)">${food['servings']['serving']['serving_description']}</a>`;
        servings_list.appendChild(list_item);
    } else {
        for (let i = 0; i < food['servings']['serving'].length; i++) {
            if (i == serving || food['servings']['serving'].hasOwnProperty(serving) == false) {
                let list_item = document.createElement('li');
                list_item.className = 'table-bottom-border';
                list_item.innerHTML = `<a class="serving-selected" href="javascript:void(0)">${food['servings']['serving'][serving]['serving_description']}</a>`;
                servings_list.appendChild(list_item);
            } else {
                let list_item = document.createElement('li');
                list_item.className = 'table-bottom-border';
                list_item.innerHTML = `<a class="serving-list-options" href="javascript:void(0)" onclick="foodSearch(${food['food_id']}, '${food['food_name']}', ${page_num}, ${i});">${Math.round(food['servings']['serving'][i]['number_of_units'])} ${food['servings']['serving'][i]['measurement_description']}</a>`;
                servings_list.appendChild(list_item);
            }
        }
    }
    document.querySelector('#add-new-food').addEventListener('click', () => {
        let quantity = document.querySelector('.quantity-input').value;
        addNewFood(json, serving, quantity)
    });
    document.querySelector('#add-new-food-form').onsubmit = function() {
        let quantity = document.querySelector('.quantity-input').value;
        addNewFood(json, serving, quantity);
        return false;
    }
    
}

function addNewFood(json, serving, quantity) {
    console.log(json, serving)
    const food = json['food']['food']
    console.log('food', food)
    const new_meal_list = document.querySelector('.new-meal-list');
    let new_row = document.createElement('li');
    let food_serving;
    if (food['servings']['serving'].hasOwnProperty(serving)) {
        food_serving = food['servings']['serving'][serving];
    } else {
        food_serving = food['servings']['serving'];
    }
    new_row.innerHTML = `
        <div>
            <span style="font-size:1.5rem; font-weight:bold">${food['food_name']} ${food.hasOwnProperty('brand_name') ? '(' + food['brand_name'] + ')' : ''}</span>
            <span style="font-size:1.5rem">${quantity} x ${food_serving['serving_description']}</span>
        </div>
        <div class="table-bottom-border">
            <span class="meal-list-details">Calories: ${(food_serving['calories'] * quantity).toFixed(2)} | Carbs: ${(food_serving['carbohydrate'] * quantity).toFixed(2)} | Fat: ${(food_serving['fat'] * quantity).toFixed(2)} | Protein: ${(food_serving['protein'] * quantity).toFixed(2)}</span>
        </div>
    `;
    new_meal_list.appendChild(new_row);
    if (document.querySelector('#save-new-meal') == null) {
        let save_btn = `
            <div>
                <button id="save-new-meal">Save</button>
            </div>
        `;
        new_meal_list.insertAdjacentHTML('afterend', save_btn);
        document.querySelector('#save-new-meal').addEventListener('click', saveMeal);
    }
    
    let new_meal = {
        'name': `${food['food_name']} ${food.hasOwnProperty('brand_name')?food['brand_name']:''}`,
        'measurement_description': food_serving['measurement_description'],
        'number_of_units': food_serving['number_of_units'],
        'metric_serving_amount': food_serving['metric_serving_amount'],
        'metric_serving_unit': food_serving['metric_serving_unit'],
        'calories': food_serving['calories'] * quantity,
        'carbs': food_serving['carbohydrate'] * quantity,
        'fat': food_serving['fat'] * quantity,
        'protein': food_serving['protein'] * quantity,
        'cholesterol': food_serving['cholesterol'] * quantity,
        'sat_fat': food_serving['saturated_fat'] * quantity,
        'poly_fat': food_serving['polyunsaturated_fat'] * quantity,
        'mono_fat': food_serving['monounsaturated_fat'] * quantity,
        'fiber': food_serving['fiber'] * quantity,
        'sugars': food_serving['sugar'] * quantity,
        'sodium': food_serving['sodium'] * quantity,
        'potassium': food_serving['potassium'] * quantity,
        'type': document.querySelector('#meal').innerHTML,
        'date': document.querySelector('#date').dataset.timestamp
    };
    console.log(new_meal);
    new_meal_dict[food['food_id']] = new_meal;
    console.log(new_meal_dict)
}

function saveMeal() {
    console.log('working');
    fetch('/save_meal', {
        method: "POST",
        body: JSON.stringify({
            meal: new_meal_dict
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result)
    })
}

function renderChart() {
    let get_date = document.querySelector('#date').dataset.timestamp;
    get_date = new Date(get_date)
    console.log(get_date)
    let date = new Date(get_date.getFullYear(), get_date.getMonth(), get_date.getDate()).getTime() / 1000
    console.log(date)
    fetch(`/get_calendar/${date}`)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        
        // GOALS
        let goal_protein = 93;
        let goal_fat = 201;
        let goal_carbs = 30;
        let goal_calories = 2304;
        // GOALS

        let remain_calories = goal_calories - result['calories'];
        let percent_calories = (result['calories'] / goal_calories) * 100;
        let percent_calories_remain = 100 - percent_calories;
        if (remain_calories <= 0) {
            remain_calories = result['calories'];
            percent_calories_remain = 0;
        }
        let remain_protein = goal_protein - result['protein'];
        let percent_protein = (result['protein'] / goal_protein) * 100;
        let percent_protein_remain = 100 - percent_protein;
        if (remain_protein <= 0) {
            remain_protein = result['protein'];
            percent_protein_remain = 0;
        }
        let remain_fat = goal_fat - result['fat'];
        let percent_fat = (result['fat'] / goal_fat) * 100;
        let percent_fat_remain = 100 - percent_fat;
        if (remain_fat <= 0) {
            remain_fat = result['fat'];
            percent_fat_remain = 0;
        }
        let remain_carbs = goal_carbs - result['carbs'];
        let percent_carbs = (result['carbs'] / goal_carbs) * 100;
        let percent_carbs_remain = 100 - percent_carbs;
        if (remain_carbs <= 0) {
            remain_carbs = result['carbs'];
            percent_carbs_remain = 0;
        }
        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            theme: "light1", // "light1", "light2", "dark1", "dark2"
            toolTip: {
                shared: true
            },
            title:{
                text: "Daily Nutrition"
            },
            axisY: {
                title: "Amount(g)"
            },
            data: [{        
                type: "column",  
                showInLegend: true, 
                legendMarkerColor: "grey",
                tooltipContent: "<br>Protein</br>><hr>{y}",
                dataPoints: [   
                    { y: 300878, label: "Protein", x: 1 },   
                    { y: 300878, label: "Fat", x: 2 },
                    { y: 316469, label: "Carbohydrate", x: 3}
                ]
            },
            /*{
                type: "column",
                name: "Monounsaturated Fat",
                tooltipContent: "",
                dataPoints: [
                    { y: 100000, label: "Fat"}
                ]
            },
            {
                type: "stackedColumn",
                name: "Polyunsaturated Fat",
                dataPoints: [
                    { y: 0, label: "Protein"},
                    { y: 150000, label: "Fat"}
                ]
            },
            {
                type: "stackedColumn",
                name: "Sugar",
                dataPoints: [
                    { y: 0, label: "Protein"},
                    { y: 0, label: "Fat"},
                    { y: 150000, label: "Carbohydrates"}
                ]
            },
            {
                type: "stackedColumn",
                name: "Fiber",
                dataPoints: [
                    { y: 0, label: "Protein"},
                    { y: 0, label: "Fat"},
                    { y: 100000, label: "Carbohydrates"}
                ]
            },
            {
                type: "stackedColumn",
                dataPoints: [
                    { y: 200000, label: "Protein"},
                    { y: 200000, label: "Fat"},
                    { y: 200000, label: "Carbohydrates"}
                ]
            }*/
            ]
        });
        console.log(chart);
        chart.render();
    })
    
}