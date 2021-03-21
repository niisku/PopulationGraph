var currentChart;

//Assigning to 'renderBtn': when clicked, do function 'fetchData'
document.getElementById("renderBtn").addEventListener("click", fetchData);

//async = Function contains asynchorous tasks (= some things in it will take some time) 
//and it'll not finish immediately
async function fetchData() {
    //Gets the current user input & saves it to "countryCode"
    var countryCode = document.getElementById("country").value;
    const indicatorCode = "SP.POP.TOTL";
    const baseUrl = "https://api.worldbank.org/v2/country/";
    const url = baseUrl + countryCode + "/indicator/" + indicatorCode + "?format=json";
    console.log("Fetching data from URL: " + url);

    //fetch = tool for sending HTTP requests
    //So here; giving value of "url" to the fetch-tool
    var response = await fetch(url);

    //If the variable "response" got response of 200 = OK
    if (response.status == 200) {
        //Converting the HTTP response to JSON format
        var fetchedData = await response.json();
        console.log(fetchedData);

        var data = getValues(fetchedData); 
        var labels = getLabels(fetchedData);
        var countryName = getCountryName(fetchedData); 
        //Gives the fetched data, labels, and the countryName to the renderChart-function
        renderChart(data, labels, countryName);
    }
}

function getValues(data) {
    var vals = data[1].sort((a, b) => 
    a.date - b.date).map(item => item.value);
    return vals;
}

function getLabels(data) {
    var labels = data[1].sort((a, b) => 
    a.date - b.date).map(item => item.date);
    return labels; 
}

function getCountryName(data) {
    var countryName = data[1][0].country.value;
    return countryName;
} 

function renderChart(data, labels, countryName) {
    //Finds our element "idChart" & gets its 2d-context(the canvas/whiteboard)
    //This canvas can now be used for drawing
    var ctx = document.getElementById("myChart").getContext("2d");

    if (currentChart) {
        //Clear the prev chart if it exists
        currentChart.destroy();
    }

    //"Draw a new chart ON the 'ctx' (= the 2-d whiteboard) using this data and these labels"
    currentChart = new Chart(ctx, {
        //Type: line = chart type is line chart
        type: "line",
        data: {
            //labels = labels for the line
            labels: labels, 
            datasets: [{
                label: "Population, " + countryName,
                data: data, 
                //Color for the lines
                borderColor: "rgba(75, 192, 192, 1)",
                //Fill color for the chart
                backgroundColor: "rgba(256, 0, 0, 0.2)",
            }]
        }, 
        options: {
            animation: {
                duration: 10000
            },
            scales: {
                yAxes:[{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}