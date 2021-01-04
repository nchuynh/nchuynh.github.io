/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// Init global variables & switches
let myRelationshipVis
//let selectedCategory = $('#categorySelector').val();

// Load data using promises
let promises = [
    d3.csv("data/Data_Faculty.csv"),
    d3.csv("data/Data_AreasInterests.csv"),
    d3.csv("data/Data_FacultyAreas.csv"),
    d3.csv("data/Data_FacultyInterests.csv"),
    d3.csv("data/Data_FacultySchools.csv"),
    d3.csv("data/Data_FacultyCenters.csv")
];
Promise.all(promises)
    .then( function(data){ initMainPage(data) })
    .catch( function (err){console.log(err)} );

// initMainPage
function initMainPage(dataArray) {
    let data_faculty = dataArray[0];
    let data_mapAreasInterests = dataArray[1];
    let data_areas = dataArray[2];
    let data_interests = dataArray[3];
    let data_schools = dataArray[4];
    let data_centers = dataArray[5];

    myRelationshipVis = new RelationshipVis("relationshipDiv",
        data_faculty, data_mapAreasInterests, data_areas, data_interests, data_schools, data_centers);
}

/*
// Trigger wrangleData() with user selection
function categoryChange() {
    selectedCategory = $('#categorySelector').val();
    myMatrixVis.wrangleData();
}
*/
