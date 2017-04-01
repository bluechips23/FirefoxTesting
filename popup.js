/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  browser.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    
    callback(url);
  });
}

document.addEventListener('DOMContentLoaded', function() {    
    document.querySelectorAll('a[href]').forEach(function (el) {
        el.addEventListener('click', function (event) {
            event.preventDefault();
            browser.tabs.create({
              url: event.target.getAttribute('href')
            });
        });
    });

    getCurrentTabUrl(function(url) {
        console.debug("Now calling popup.js");
        generateData();
    });

    console.debug("Calling popup.js");

    var generateData = function() {
        console.debug("inside generate data.....");
        var categoryData = new Array();

        for(var index = 0; index < 10; index++) {
            var category = "Category " + index;
            categoryData.push(category);
        }

        for(var index = 0; index < 3; index++) {
            var container = addChartContainer(name);

            var positiveData = getRandomArray();
            var negativeData = getRandomArray();
            var neutralData = getRandomArray();

            var container = addChartContainer(index);
            createChart(name, categoryData, positiveData, negativeData, neutralData, container);
        }
    };

    var getRandomNumber = function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };

    var getRandomArray = function() {
        var min = 0;
        var max = 50;
        var myArray = new Array();

        for(var index = 0; index < 10; index++) {
            var random = getRandomNumber(min, max);
            myArray.push(parseInt(random));
        }

        return myArray;
    };

    var addChartContainer = function(index) {
        var nameContainer = document.createElement('div');
        nameContainer.setAttribute('id', 'container-'+index);
        nameContainer.className = "container";
        var body = document.getElementById("bodyId");
        body.appendChild(nameContainer);
        return nameContainer;
    };

    var clearBodyContainer = function() {
        var bodyContainer = document.getElementById("bodyId");
        document.body.removeChild(bodyContainer);
        bodyContainer = document.createElement("div");
        bodyContainer.className = "bodyContainer";
        bodyContainer.setAttribute("id", "bodyId");
        document.body.appendChild(bodyContainer);
    }

    var createChart = function(name, categoryData, positiveData, 
                                    negativeData, neutralData, container) {
        var titleString = "Chart " + name;
        var subTitleString = "This is a test";

        console.debug("PositiveData: " + positiveData);
        console.debug("NegativeData: " + negativeData);
        console.debug("NeutralData: " + neutralData);
        console.debug("CategoryData: " + categoryData);

        Highcharts.chart(container, {
            chart: {
                type: 'bar',
                style: {
                    color: '#333'
                },
                backgroundColor: "#f2f2f2"
            },
            title: {
                text: titleString,
                style: {
                    color: '#333'
                }
            },

            subtitle: {
                text: subTitleString,
                style: {
                    color: '#333',
                    fontSize: "15px"
                }
            },

            xAxis: {
                categories: categoryData,
                labels: {
                    style: {
                        fontSize: "12px"
                    }
                },
            },

            yAxis: {
                min: 0,
                title: {
                    text: 'Values',
                    align: 'high',
                    style: {
                        fontSize: '18px',
                    }
                },
                labels: {
                    overflow: 'justify',
                    style: {
                        fontSize: '14px',
                    }
                },
                tickPositioner: function () {
                    var positions = [],
                        tick = Math.floor(this.dataMin),
                        increment = Math.ceil((this.dataMax - this.dataMin) / 6);

                    if (this.dataMax !== null && this.dataMin !== null) {
                        for (tick; tick - increment <= this.dataMax; tick += increment) {
                            positions.push(tick);
                        }
                    }
                    return positions;
                },
                gridLineWidth: 0,
            },

            colors: [
                '#4be8a1', 
                '#ed6764', 
                '#adadad', 
            ],
            plotOptions: {
                series: {
                    pointWidth: 5, //width of the column bars irrespective of the chart size
                    groupPadding: 0.1,
                    pointPadding: 0
                },
                column: {
                    colorByPoint: true
                },
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            tooltip: {
                shadow: true,
                useHTML: true,
                shared: true,
                backgroundColor: '#f2f2f2'
            },

            series: [{
                name: 'Positive',
                data: positiveData

            }, {
                name: 'Negative',
                data: negativeData

            }, {
                name: 'Neutral',
                data: neutralData
            }]
        });
        
    };


});
