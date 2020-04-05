//line
var ctxL = document.getElementById("myChart").getContext('2d');
var myLineChart = new Chart(ctxL, {
    type: 'line',
    data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "Current",
            data: [2, 20, 80, 20, 2, 0, 0],
            backgroundColor: [
                'rgba(105, 0, 132, .2)',
            ],
            borderColor: [
                'rgba(105, 0, 132, .2)',
            ],
            borderWidth: 2,
            pointRadius: 1,
        },
        {
            label: "Goal",
            data: [0, 2, 10, 30, 10, 2, 0],
            backgroundColor: [
                'rgba(0, 137, 132, .2)',
            ],
            borderColor: [
                'rgba(0, 10, 130, .7)',
            ],
            borderWidth: 2,
            pointRadius: 1,
        },
        {
            label: "Goal",
            data: [30, 30, 30, 30, 30, 30, 30],
            backgroundColor: [
                'rgba(0, 137, 132, 0)',
            ],
            borderColor: [
                'rgba(130, 130, 130, .7)',
            ],
            borderWidth: 2,
            pointRadius: 1,
        }
        ]
    },
    options: {
        responsive: false,
        legend: {
            display: false,
            labels: {
                fontColor: 'rgb(255, 99, 132)'
            }
        },
        scales: {
            xAxes: [{
                display: false
            }],
            yAxes: [{
                display: false
            }],
        },
        tooltips: {
            enabled: false
        },
        layout: {
            padding: 10
        }
    }
});