// Function to fetch data and build metadata
function buildMetadata(sample) {
    
    // Read the samples.json file from the provided URL
    let url = ("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
    // Fetch the JSON data using D3 and extract metadata for the given sample
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let filteredArray = metadata.filter(sampleObj => sampleObj.id == sample);
        let result = filteredArray[0]

        // Select the panel with id of "#sample-metadata"
        let panel = d3.select("#sample-metadata");
        // Clear existing metadata
        panel.html("")

        // Append new tags for each key-value in the metadata
        for (let [key, value] of Object.entries(result)) {
            panel.append("p").text (`${key.toLowerCase()}: ${value}`)
        }
    });
}

// Function to fetch data and build charts
function buildCharts(sample) {

    // Read the samples.json file from the provided URL
    let url = ("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
    // Fetch the JSON data using D3 and extract metadata for the given sample
    d3.json(url).then((data) => {
        let samples = data.samples;
        let filteredSamplesArray = samples.filter(sampleObj => sampleObj.id == sample);
        let result = filteredSamplesArray[0];

        // Extract data for building the Horizontal Bar Chart
        let labels = result.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
        let values = result.sample_values.slice(0,10).reverse();
        let hoverText = result.otu_labels.slice(0,10).reverse();

        // Build the Horizontal Bar Chart
        let barTrace = {
            x: values,
            y: labels,
            text: hoverText,
            type: 'bar',
            orientation: 'h'
        };

        let barData = [barTrace];
        // Plot the Horizontal Bar Chart
        Plotly.newPlot('bar', barData);

        // Extract data for building the Bubble Chart
        let xValues = result.otu_ids;
        let yValues = result.sample_values;
        let markerSize = result.sample_values;
        let textValues = result.otu_labels;
        let markerColors = result.otu_ids; 
        // Build the Bubble Chart
        let bubbleTrace = {
            x: xValues,
            y: yValues,
            text: textValues,
            mode: 'markers',
            marker: {
                color: markerColors,
                size: markerSize
            }
        };

        let bubbleData = [bubbleTrace]
        let bubbleLayout = {
            xaxis: {
                title: {
                    text: "OTU ID"
                }
            }
        };

        // Plot the Bubble Chart
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    });
}

// Function to update all the plots when a new sample is selected
function optionChanged (newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

// Function to initialize the dashboard
function init() {
    
    // Get the reference to the dropdown menu
    let selector = d3.select("#selDataset");

    // Read the sample.json file from the provided URL
    let url = ("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
    // Fetch the JSON data using D3 and extract sample names
    d3.json(url).then((data) => {
        let sampleNames = data.names;

        // Loop through the sample names and append to the dropdown menu
        sampleNames.forEach((sample) => {
            selector.append('option').text(sample).property('value',sample);
        });

        // Use the first sample from the list to build the initial plot
        let firstSample = sampleNames[0];
        buildMetadata(firstSample);
        buildCharts(firstSample);
    });
}

// Call the init function
init();
