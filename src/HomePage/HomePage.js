import React from 'react'
import axios from 'axios'
import * as d3 from 'd3'
import { Chart } from 'chart.js/auto'
function HomePage() {

    var dataSource = {
        datasets: [
          {
            data: [],
            backgroundColor: [
              '#ffcd56',
              '#ff6384',
              '#36a2eb',
              '#fd6b19'
            ]
          }
        ],
        labels: []
      }



    function getBudget() {
        axios.get('http://localhost:3000/budget')
        .then(function (res) {

            for(var i = 0; i < res.data.myBudget.length; i++) {
                dataSource.datasets[0].data[i] = res.data.myBudget[i].budget
                dataSource.labels[i] = res.data.myBudget[i].title;
            }

            // Check if chart exists
            let chartStatus = Chart.getChart("myChart");
            if (chartStatus !== undefined) {
              chartStatus.destroy();
            }

            const ctx = document.getElementById('myChart');
            new Chart(ctx, {
                type: 'pie',
                data: dataSource
            });

            var data = res.data.myBudget
            console.log("top-level data: " + JSON.stringify(data))
            var width = 600;
            const height = width * 0.6;

            // Check if chart exists
            var svgStatus = document.getElementsByTagName("svg")
            if (svgStatus.length !== 0){
                svgStatus[0].remove();
            }

            var svg = d3.select(".d3-container")
                        .append("svg")
                        .append("g")


            svg.append("g").attr("class", "slices");
            svg.append("g").attr("class", "labels");
            svg.append("g").attr("class", "lines");

            const radius = Math.min(width, height) / 2;

            const pie = d3
                .pie()
                .sort(null)
                .value(d => d.budget);

            const arc = d3
                .arc()
                .outerRadius(radius * 0.8)
                .innerRadius(radius * 0.4);

            const outerArc = d3
                .arc()
                .innerRadius(radius * 0.9)
                .outerRadius(radius * 0.9);

            svg.attr("transform", "translate(" + width / 1.7 + "," + height / 2 + ")");

            var color = d3.scaleOrdinal()
                .domain(data.map(d => d.title))
                .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);


            change(data);

            function change(data) {

                /* ------- PIE SLICES -------*/
                
                const pieData = pie(data);
                const slice = svg
                .select(".slices")
                .selectAll("path.slice")
                .data(pieData);

                slice
                .enter()
                .insert("path")
                .style("fill", function(d) {
                    return color(d.data.title);
                })
                .attr("class", "slice")
                .merge(slice)
                .transition()
                .duration(1000)
                .attrTween("d", function(d) {
                    this._current = this._current || d;
                    const interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                    return arc(interpolate(t));
                    };
                });

                slice.exit().remove();

                /* ------- TEXT LABELS -------*/

                const text = svg
                .select(".labels")
                .selectAll("text")
                .data(pie(data));

                function midAngle(d) {
                return d.startAngle + (d.endAngle - d.startAngle) / 2;
                }

                text
                .enter()
                .append("text")
                .attr("dy", ".35em")
                .text(function(d) {
                    return d.data.title + ": " + d.data.budget;
                })
                .merge(text)
                .transition()
                .duration(1000)
                .attrTween("transform", function(d) {
                    this._current = this._current || d;
                    const interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                    const d2 = interpolate(t);
                    const pos = outerArc.centroid(d2);
                    pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                    return "translate(" + pos + ")";
                    };
                })
                .styleTween("text-anchor", function(d) {
                    this._current = this._current || d;
                    const interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                    const d2 = interpolate(t);
                    return midAngle(d2) < Math.PI ? "start" : "end";
                    };
                });

                text.exit().remove();

                /* ------- SLICE TO TEXT POLYLINES -------*/

                const polyline = svg
                .select(".lines")
                .selectAll("polyline")
                .data(pie(data));

                polyline
                .join("polyline")
                .transition()
                .duration(1000)
                .attrTween("points", function(d) {
                    this._current = this._current || d;
                    const interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                    const d2 = interpolate(t);
                    const pos = outerArc.centroid(d2);
                    pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                    return [arc.centroid(d2), outerArc.centroid(d2), pos];
                    };
                });

                polyline.exit().remove();
            }

            return Object.assign(svg.node(), {
                update() {
                change(data);
                }
            });
        })
    }

    getBudget();

  return (
    <div className="container center" role="article">

        <div className="page-area">

            
            <section className="text-box">
                <h1>Stay on track</h1>
                <p>
                    Do you know where you are spending your money? If you really stop to track it down,
                    you would get surprised! Proper budget management depends on real data... and this
                    app will help you with that!
                </p>
            </section>
            
            
            <section className="text-box">
                <h1>Alerts</h1>
                <p>
                    What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
                </p>
            </section>
                
            
            <section className="text-box">
                <h1>Results</h1>
                <p>
                    People who stick to a financial plan, budgeting every expense, get out of debt faster!
                    Also, they to live happier lives... since they expend without guilt or fear... 
                    because they know it is all good and accounted for.
                </p>
            </section>
                
            
            <section className="text-box">
                <h1>Free</h1>
                <p>
                    This app is free!!! And you are the only one holding your data!
                </p>
            </section>
                
            
            <section className="text-box">
                <h1>Stay on track</h1>
                <p>
                    Do you know where you are spending your money? If you really stop to track it down,
                    you would get surprised! Proper budget management depends on real data... and this
                    app will help you with that!
                </p>
            </section>
                
            
            <section className="text-box">
                <h1>Alerts</h1>
                <p>
                    What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
                </p>
            </section>
                
            
            <section className="text-box">
                <h1>Results</h1>
                <p>
                    People who stick to a financial plan, budgeting every expense, get out of debt faster!
                    Also, they to live happier lives... since they expend without guilt or fear... 
                    because they know it is all good and accounted for.
                </p>
            </section>

            
            <section className="text-box">
                <h1>Free</h1>
                <p>
                    This app is free!!! And you are the only one holding your data!
                </p>
            </section>

            <article>
                <h1>Chart.js chart</h1>
                <p>
                    <canvas id="myChart" width="400" height="400"></canvas>
                </p>
            </article>

            <article>
                <h1>D3 chart</h1>
                <figure id="d3-chart" className="d3-container"></figure>
            </article>
    
        </div>
    </div>
  );
}

export default HomePage;