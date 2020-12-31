document.addEventListener('DOMContentLoaded', function() {
    renderChart(); 
    document.getElementById("tabOpen").click();
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
    add_meal_container.style.display = "table";
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
        if (document.querySelector('#foods-search')) {
            document.querySelector('#foods-search').remove()
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
                        <a class="food-option" href="javascript:void(0)" onclick="foodSearch(${food.food_id},'${food_name}',${page_num}, 0);">${food.food_name} ${food.hasOwnProperty('brand_name') ? '(' + food.brand_name + ')' : ''}</a>
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
        document.querySelector('.food-option').focus();
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
        'number_of_units': quantity,
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
    document.querySelector('#save-new-meal').focus();
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
        new_meal_dict = {};
        alert('Meal saved succesfully')
        document.querySelector('.new-meal-list').innerHTML = '';
        renderChart();
        let foods_search = document.querySelector('#foods-search');
        foods_search.remove();
        openTab('all', 1, document.querySelector('.all'))
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
        let chart_dict = {'protein': {}, 'fat': {}, 'carbs': {}, 'calories': {}};
        goals = result["goals"][0]
        calendar = result["calendar"][0]        
        for (macro in chart_dict) {
            chart_dict[macro]['goal'] = Math.round(goals[macro])
            chart_dict[macro]['remain'] = goals[macro] - calendar[macro];
            chart_dict[macro]['percent'] = (calendar[macro] / goals[macro]) * 100;
            chart_dict[macro]['percent_remain'] = 100 - chart_dict[macro]['percent'];
            if (chart_dict[macro]['remain'] <= 0) {
                chart_dict[macro]['remain'] = calendar[macro];
                chart_dict[macro]['percent_remain'] = 0;
            }
        }

        chart_dict['fat']['monounsaturated'] = {'current': calendar['mono_fat'], 'percent': (calendar['mono_fat'] / chart_dict['fat']['goal']) * 100};
        chart_dict['fat']['polyunsaturated'] = {'current': calendar['poly_fat'], 'percent': (calendar['poly_fat'] / chart_dict['fat']['goal']) * 100};
        chart_dict['fat']['saturated'] = {'current': calendar['sat_fat'], 'percent': (calendar['sat_fat'] / chart_dict['fat']['goal']) * 100};
        chart_dict['carbs']['sugar'] = {'current': calendar['sugar'], 'percent': (calendar['sugar'] / chart_dict['carbs']['goal']) * 100};
        chart_dict['carbs']['fiber'] = {'current': calendar['fiber'], 'percent': (calendar['fiber'] / chart_dict['carbs']['goal']) * 100};

        console.log(chart_dict);
        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            toolTip: {
                shared: true,
                contentFormatter: function(e) {
                    let macro = (e.entries[0].dataPoint.label).toLowerCase();
                    if (macro == 'carbohydrate') {macro = 'carbs'};
                    let str = `${e.entries[0].dataPoint.label} (${Math.round(chart_dict[macro]['percent'])}%)<br><span>Current: ${Number.parseFloat(calendar[macro]).toFixed()}g</span><br><span>Goal: ${chart_dict[macro]['goal']}g</span><hr>`;
                    for (let i = 0; i < e.entries.length; i++) {
                        if (e.entries[i].dataPoint.y && e.entries[i].dataSeries.name != 'Macros') {
                            str += `<span>${e.entries[i].dataSeries.name}: ${Number.parseFloat(chart_dict[macro][(e.entries[i].dataSeries.name).toLowerCase()]['current']).toFixed()}g</span><br>`;
                        }
                    }
                    return str;
                }
            },
            title:{
                text: "Daily Nutrition"
            },
            axisY: {
                title: "Daily Percent",
                labelFormatter: function(e) {
                    return e.value + '%';
                },
                maximum: 100
            },
            data: [{
                type: "stackedColumn",
                name: "Monounsaturated",
                dataPoints: [
                    { y: 0, label: "Calories"},   
                    { y: 0, label: "Protein"},   
                    { y: chart_dict['fat']['monounsaturated']['percent'], label: "Fat"},
                    { y: 0, label: "Carbohydrate"}
                ]
            },
            {
                type: "stackedColumn",
                name: "Polyunsaturated",
                dataPoints: [
                    { y: 0, label: "Calories"},   
                    { y: 0, label: "Protein"},   
                    { y: chart_dict['fat']['polyunsaturated']['percent'], label: "Fat"},
                    { y: 0, label: "Carbohydrate"}
                ]
            },
            {
                type: "stackedColumn",
                name: "Saturated",
                dataPoints: [
                    { y: 0, label: "Calories"},   
                    { y: 0, label: "Protein"},   
                    { y: chart_dict['fat']['saturated']['percent'], label: "Fat"},
                    { y: 0, label: "Carbohydrate"}
                ]
            },
            {
                type: "stackedColumn",
                name: "Sugar",
                dataPoints: [
                    { y: 0, label: "Calories"},   
                    { y: 0, label: "Protein"},   
                    { y: 0, label: "Fat"},
                    { y: chart_dict['carbs']['sugar']['percent'], label: "Carbohydrate"}
                ]
            },
            {
                type: "stackedColumn",
                name: "Fiber",
                dataPoints: [
                    { y: 0, label: "Calories"},   
                    { y: 0, label: "Protein"},   
                    { y: 0, label: "Fat"},
                    { y: chart_dict['carbs']['fiber']['percent'], label: "Carbohydrate"}
                ]
            },
            {        
                type: "stackedColumn",  
                legendMarkerColor: "grey",
                name: "Macros",
                dataPoints: [
                    { y: chart_dict['calories']['percent'], label: "Calories"},   
                    { y: chart_dict['protein']['percent'], label: "Protein"},   
                    { y: (chart_dict['fat']['percent'] - chart_dict['fat']['monounsaturated']['percent'] - chart_dict['fat']['polyunsaturated']['percent'] - chart_dict['fat']['saturated']['percent']), label: "Fat"},
                    { y: (chart_dict['carbs']['percent'] - chart_dict['carbs']['sugar']['percent'] - chart_dict['carbs']['fiber']['percent']), label: "Carbohydrate"}
                ]
            }
            ]
        });
        console.log(chart);
        chart.render();
    })
    
}

function openTab(meal, page_num, elmnt) {
    let get_date = document.querySelector('#date').dataset.timestamp;
    get_date = new Date(get_date);
    console.log(get_date)
    let date = new Date(get_date.getFullYear(), get_date.getMonth(), get_date.getDate()).getTime() / 1000;
    fetch('/food_list', {
        method: "POST",
        body: JSON.stringify({
            date: date,
            meal: meal,
            page_num: page_num
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result)
        
        if (elmnt) {
            let prev_open = document.querySelector('#tabOpen');
            prev_open.removeAttribute('id');
            console.log(elmnt)
            elmnt.id = 'tabOpen';
        };
        let tab = document.querySelector(`#${meal}`);
        tab.innerHTML = '';
        let foods = result['meal_paginator'];
        if (foods.length == 0) {
            tab.innerHTML = '<span class="no-data">Any new meal saved will be displayed here</span>';
        } else {
            let food_list = '';
            for (food of foods) {
                console.log(food_list)
                food_list += `
                    <div class="food-list-item">
                        <span class="food-list-ingredient">${food.ingredient}</span><span class="food-list-measure">(${Math.trunc(food.quantity)} x ${food.measure})</span><br>
                        <span class="food-list-macros">Calories: ${Math.round(food.calories)}kcal | Protein: ${Math.round(food.protein)}g | Fat: ${Math.round(food.fat)}g | Carbs: ${Math.round(food.carbs)}g</span>
                    </div>
                `;
            }
            tab.insertAdjacentHTML('afterbegin', food_list);
            let num_pages = result['num_pages'];
            console.log(num_pages)
            if (num_pages > 1) {
                let tab_btns = `<div class="tab-btns">`
                for (i = 1; i <= num_pages; i++) {
                    if (i == page_num) {
                        tab_btns += `
                            <button disabled>${i}</button>
                        `;
                    } else {
                    tab_btns += `
                        <button onclick="openTab('${meal}', 'red', ${i}, false)" class="tab-btn">${i}</button>
                        `; 
                    }
                }
                tab_btns += `</div>`
                tab.insertAdjacentHTML('beforeend', tab_btns);
            };
            console.log(tab)
        }
        
        
        // Hide all elements with class="tabcontent" by default */
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        
        for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        }
    
        // Remove the background color of all tablinks/buttons
        tablinks = document.getElementsByClassName("tablink");
        for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
        }
    
        // Show the specific tab content
        document.getElementById(meal).style.display = "block";
    
        // Add the specific color to the button used to open the tab content
        //elmnt.style.backgroundColor = color;
    })
    
  }
  
  // Get the element with id="defaultOpen" and click on it
  //document.getElementById("defaultOpen").click();
  //document.getElementById("defaultOpen").focus();
