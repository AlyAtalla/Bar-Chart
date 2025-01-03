// Fetch GDP data
fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(response => response.json())
    .then(data => {
        const dataset = data.data;

        // Chart dimensions
        const width = 800;
        const height = 400;
        const padding = 60;

        // Parse dates
        const parseDate = d3.timeParse("%Y-%m-%d");
        const dates = dataset.map(d => parseDate(d[0]));
        const gdpValues = dataset.map(d => d[1]);

        // Scales
        const xScale = d3.scaleTime()
            .domain([d3.min(dates), d3.max(dates)])
            .range([padding, width - padding]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(gdpValues)])
            .range([height - padding, padding]);

        // Create SVG
        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Tooltip
        const tooltip = d3.select("#tooltip");

        // Bars
        svg.selectAll(".bar")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d, i) => xScale(parseDate(d[0])))
            .attr("y", d => yScale(d[1]))
            .attr("width", width / dataset.length)
            .attr("height", d => height - padding - yScale(d[1]))
            .attr("data-date", d => d[0])
            .attr("data-gdp", d => d[1])
            .on("mouseover", (event, d) => {
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html(`Date: ${d[0]}<br>GDP: $${d[1]} Billion`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px")
                    .attr("data-date", d[0]);
            })
            .on("mouseout", () => {
                tooltip.transition().duration(500).style("opacity", 0);
            });

        // X-Axis
        const xAxis = d3.axisBottom(xScale);
        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", `translate(0, ${height - padding})`)
            .call(xAxis);

        // Y-Axis
        const yAxis = d3.axisLeft(yScale);
        svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", `translate(${padding}, 0)`)
            .call(yAxis);
    });