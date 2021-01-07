/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// Init global variables & switches
let myRelationshipVis1
//let selectedCategory = $('#categorySelector').val();

// load data using promises
let promises = [
    d3.csv('data/Final Visualization Data_People.csv'),
    d3.csv('data/Visualization Data_Centers.csv')
    // please add additional data AFTER these, so that people's indexing isn't messed up...
];

Promise.all(promises)
    .then( function(data){ initMainPage(data) })
    .catch( function (err){console.log(err)} );

// initMainPage
function initMainPage(dataArray) {
    let latestPeopleData = dataArray[0];  // this is latest list of faculty (as of 11/21)
    let centers = dataArray[1];

    myRelationshipVis1 = new RelationshipVis1("relationshipDiv", latestPeopleData, centers);
}
