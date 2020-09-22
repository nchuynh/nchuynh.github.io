// DATASETS

// Global variable with 1198 pizza deliveries
// console.log(deliveryData);

// Global variable with 200 customer feedbacks
// console.log(feedbackData.length);

// FILTER DATA, THEN DISPLAY SUMMARY OF DATA & BAR CHART

createVisualization();

function createVisualization() {

	/* ************************************************************
	 *
	 * ADD YOUR CODE HERE
	 * (accordingly to the instructions in the HW2 assignment)
	 * 
	 * 1) Filter data
	 * 2) Display key figures
	 * 3) Display bar chart
	 * 4) React to user input and start with (1)
	 *
	 * ************************************************************/

    // 1) Filter data
    let selectBoxArea = document.getElementById("area");
    let selectedArea = selectBoxArea.options[selectBoxArea.selectedIndex].value;

    let selectBoxOrderType = document.getElementById("order-type");
    let selectedOrderType = selectBoxOrderType.options[selectBoxOrderType.selectedIndex].value;

    let filteredDeliveryData = deliveryData.filter( (value, index) => {
        if (selectedArea == "all" && selectedOrderType == "all") {
            return value;
        } else if (selectedArea == "all" && selectedOrderType != "all") {
            return value.order_type == selectedOrderType
        } else if (selectedArea != "all" && selectedOrderType == "all") {
            return value.area == selectedArea;
        } else {
            return (value.order_type == selectedOrderType && value.area == selectedArea)
        }
    });

    let idList = filteredDeliveryData.map(function (object) { return object.delivery_id; });
    let filteredFeedbackData = feedbackData.filter( (value, index) => {
        if (idList.includes(value.delivery_id)) {
            return value;
        }
    });

    // 2) Display key figures

    // Number of pizza deliveries
    let num_deliveries = filteredDeliveryData.length;

    // Number of all delivered pizzas (count)
    let num_pizzas = 0;
    // Average delivery time
    let average_time = 0;
    // Total sales in USD
    let total_sales = 0;

    filteredDeliveryData.forEach((element,index) => {
        num_pizzas += element.count;
        average_time += (1/num_deliveries) * (element.delivery_time);
        total_sales += element.price;
    });

    // Number of all feedback entries
    let num_feedback = filteredFeedbackData.length;

    // Number of feedback entries per quality category: low, medium, high
    let num_low = 0;
    let num_med = 0;
    let num_high = 0;

    filteredFeedbackData.forEach((element,index) => {
        if (element.quality == "low") {num_low += 1;}
        else if (element.quality == "medium") {num_med += 1;}
        else if (element.quality == "high") {num_high += 1;}
    })

    document.getElementById("content-1").innerHTML = num_deliveries;
    document.getElementById("content-2").innerHTML = num_pizzas;
    document.getElementById("content-3").innerHTML = (average_time.toFixed(2)+" minutes");
    document.getElementById("content-4").innerHTML = ("$"+total_sales.toFixed(2));
    document.getElementById("content-5").innerHTML = num_feedback;
    document.getElementById("content-6").innerHTML = num_low;
    document.getElementById("content-7").innerHTML = num_med;
    document.getElementById("content-8").innerHTML = num_high;

    // 3) Display bar chart
    renderBarChart(filteredDeliveryData)

    // Bonus Task
    populateTable(filteredFeedbackData)
}

function populateTable(data){
    $("#table_js").empty();
    let tbody = document.getElementById("table_js");
    data.forEach(function(object) {
        let tr = document.createElement("tr");
        tr.innerHTML = "<td>" + object.delivery_id + "</td>" +
            "<td>" + object.punctuality + "</td>" +
            "<td>" + object.quality + "</td>" +
            "<td>" + object.wrong_pizza + "</td>";
        tbody.appendChild(tr);
    });
}
