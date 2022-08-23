import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';
import './LineGraph.scss';

const options = {
    legend: {
        display: false
    },
    elements: {
        point: {
            radius: 0
        }
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0")
            }
        }
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    parser: "MM/DD/YY",
                    tooltipFormat: "ll"
                }
            }
        ],
        yAxes: [
            {
                gridLines: {
                    display: false
                },
                ticks: {
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    }
                }
            }
        ]
    }
};

const buildChartData = (data, caseType) => {
    const chartData = [];
    let lastDataPoint;

    for (let date in data[caseType]) {
        if (lastDataPoint) {
            const newDataPoint = {
                x: date,
                y: data[caseType][date] - lastDataPoint
            }
            chartData.push(newDataPoint)
        }
        lastDataPoint = data[caseType][date]
    };
    return chartData;
};
function getTitle(caseType) {
    let title = "World's new registered ";
    switch (caseType) {
        case 'cases':
            title += 'cases';
            break;
        case 'recovered':
            title += 'recovered cases';
            break;
        case 'deaths':
            title += 'deaths';
            break;
        default:
            title = "World's new cases ";
            break;
    }
    return title;
}
function LineGraph({ caseType, ...props }) {

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=30")
                .then(response => response.json())
                .then(data => {
                    const chartData = buildChartData(data, caseType);
                    setData(chartData);
                })
        }
        fetchData();
    }, [caseType]);


    return (
        <div className={props.className}>
            <h3 className="app_graphTitle">{getTitle(caseType)}</h3>
            {
                data?.length > 0 && (
                    <Line
                        data={{
                            datasets: [{
                                data: data,
                                backgroundColor: "rgba(204, 16, 52, 0.5)",
                                borderColor: "#cc1034"
                            }]
                        }}
                        options={options}
                    />
                )
            }
        </div>
    )
}

export default LineGraph;
