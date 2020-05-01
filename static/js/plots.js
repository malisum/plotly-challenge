// ********************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------- //
// Main Script:
// --------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************* //


// Get initial data & load the screen
getDataLoadScreen();


// ********************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------- //
// Get the data & load the screen:
// --------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************* //

function getDataLoadScreen() {

  // Use D3 to select dropdown element
  var selectName = d3.select("#selDataset");

  // Get sample names and populate drop down 
  d3.json("static/data/samples.json").then((data) => {

    // names has all the ids/names - save the list 
    var sampleNames = data.names;
    
    // load the sample names to dropdown 
    sampleNames.forEach((name) => {
      // Load name & value (same as name in this case)
      selectName.append("option").text(name).property("value", name);
    });


    // Take the 1st name to load the screeen  
    var startName = sampleNames[0];
    loadMetaData(startName);
    plotNameDataCharts(startName);
  });
}

// ********************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------- //
// Track name selection change & reload screen 
// --------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************* //

function nameChange(name) {
  // Relaod the screen for new name selected (HTML file links to this function name at onchange event)
  loadMetaData(name);
  plotNameDataCharts(name);
}

// ********************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------- //
// Load the meta data:
// --------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************* //

function loadMetaData(pName) {

  // fetch the meta data for the name provided
  d3.json("static/data/samples.json").then((data) => {
    
    // load metadata to a variable 
    var metadata = data.metadata;
    
    // Filter to match the name provided 
    var nameDataList = metadata.filter(data => data.id == pName);
    var nameData = nameDataList[0];

    // Select the element for metadata (id = #sample-metadata)
    var metadataElement = d3.select("#sample-metadata");
    // Clear existing data
    metadataElement.html("");

    // Add each key-value  
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(nameData).forEach(([key, value]) => {
      metadataElement.append("h6").text(`${key}: ${value}`);
    });

    // Gauge Chart
    nameFrequency = nameData.wfreq
    plotGaugeChart(nameFrequency);
  });
}

// ********************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------- //
// Plot the name data:
// --------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************* //

function plotNameDataCharts(pName) {

  // fetch the meta data for the name provided
  d3.json("static/data/samples.json").then((data) => {
  
    // load samples data to a variable 
    var samplesData = data.samples;
    
    // Filter to match the name provided 
    var samplesDataList = samplesData.filter(data => data.id == pName);
    var sampleData = samplesDataList[0];

    // Set id, label & values
    var otu_ids = sampleData.otu_ids;
    var otu_labels = sampleData.otu_labels;
    var sample_values = sampleData.sample_values;


    // Bubble Chart

    // layout
    var bubbleChartLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30}
    };
    // data
    var bubbleChartData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];
    // Plot the bubble chart 
    Plotly.newPlot("bubble", bubbleChartData, bubbleChartLayout);
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    
    
    // Bar chart
    
    // layout
    var barChartLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };
    // data
    var barChartData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];
    // Plot the bar chart 
    Plotly.newPlot("bar", barChartData, barChartLayout);


  });
}

// ********************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************* //
