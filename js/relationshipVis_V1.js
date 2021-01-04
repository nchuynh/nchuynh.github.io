/* * * * * * * * * * * * * *
*      class RelationshipVis     *
* * * * * * * * * * * * * */

class RelationshipVis {

    constructor(parentElement, data_faculty, data_mapAreasInterests, data_areas, data_interests, data_schools, data_centers){
        this.parentElement = parentElement;

        this.data_faculty = data_faculty;
        this.data_mapAreasInterests = data_mapAreasInterests;
        this.data_areas = data_areas;
        this.data_interests = data_interests;
        this.data_schools = data_schools;
        this.data_centers = data_centers;

        this.initVis()
    }

    repress(stat){
        let vis = this;
        vis.Nodes.forEach(function(d){
            d3.select("#" + d.id).classed("repressNode", stat);
        })

        vis.Links.forEach(function(d){
            d3.select("#" + d.id).classed("activeLink", false);
            d3.select("#" + d.id).classed("repressLink", stat);
        })
    }

    mouse_action(val, stat, lvl){
        let vis = this;

        if(lvl === 0 || lvl === 4){
            let area0 = vis.Nodes.filter(obj => {return obj.name === val.name})[0];
            let area4 = vis.Nodes.filter(obj => {return obj.name === val.name})[1];
            let areaFaculty = [];

            d3.select("#" + area0.id).classed("repressNode", false);
            d3.select("#" + area4.id).classed("repressNode", false);

            vis.Links.forEach(function(d){
                if(d.target.id === area0.id || d.target.id === area4.id){
                    d3.select("#" + d.id).classed("repressLink", false);
                    d3.select("#" + d.id).classed("activeLink", stat);
                    areaFaculty.push(d.source);
                    d3.select("#" + d.source.id).classed("repressNode", false);
                    d3.select("#" + d.source.id).classed("activeFaculty", stat);
                }
            })

            vis.Links.forEach(function(d){
                if(d.lvl === 1 || d.lvl === 2){
                    if(areaFaculty.includes(d.source)){
                        d3.select("#" + d.id).classed("repressLink", false);
                        d3.select("#" + d.id).classed("activeLink", stat);
                        d3.select("#" + d.target.id).classed("repressNode", false);
                    }
                }
            })
        }

        if(lvl === 1 || lvl === 3){
            d3.select("#" + val.id).classed("repressNode", false);
            d3.select("#" + val.id).classed("activeFaculty", stat);

            vis.Links.forEach(function(d){
                if(d.source.id === val.id){
                    d3.select("#" + d.id).classed("repressLink", false);
                    d3.select("#" + d.id).classed("activeLink", stat);
                    d3.select("#" + d.target.id).classed("repressNode", false);
                }
            })
        }

        if(lvl === 2){
            let centerFaculty = [];

            d3.select("#" + val.id).classed("repressNode", false);

            vis.Links.forEach(function(d){
                if(d.target.id === val.id){
                    d3.select("#" + d.id).classed("repressLink", false);
                    d3.select("#" + d.id).classed("activeLink", stat);
                    centerFaculty.push(d.source);
                    d3.select("#" + d.source.id).classed("repressNode", false);
                    d3.select("#" + d.source.id).classed("activeFaculty", stat);
                }
            })

            vis.Links.forEach(function(d){
                if(d.lvl === 0 || d.lvl === 3){
                    if(centerFaculty.includes(d.source)){
                        d3.select("#" + d.id).classed("repressLink", false);
                        d3.select("#" + d.id).classed("activeLink", stat);
                        d3.select("#" + d.target.id).classed("repressNode", false);
                    }
                }
            })
        }
    }

    initVis(){
        let vis = this;

        vis.margin = {top: 10, right: 10, bottom: 10, left: 10};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .append("g");

        vis.svg.append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .style("fill", "white")
            .on("click", function () {
                vis.repress(false);
            });

        vis.wrangleData();
    }

    wrangleData(){
        let vis = this;

        vis.Nodes = [];
        vis.Links = [];

        vis.listFaculty = vis.data_faculty.map(x => x['Title']);
        vis.listAreas = [...new Set(vis.data_areas.map(x => x['Area']))];
        vis.listCenters = [...new Set(vis.data_centers.map(x => x['Center']))];

        vis.facultyHalfCount = Math.ceil(vis.listFaculty.length / 2);
        vis.listFaculty.forEach(function(faculty, index){
            if(index < vis.facultyHalfCount) {
                vis.Nodes.push({
                    "lvl": 1,
                    "name": faculty
                })
            }else{
                vis.Nodes.push({
                    "lvl": 3,
                    "name": faculty
                })
            }
        });

        vis.listAreas.forEach(function(area){
            vis.Nodes.push({
                "lvl": 0,
                "name": area
            })
            vis.Nodes.push({
                "lvl": 4,
                "name": area
            })
        });

        vis.listCenters.forEach(function(center){
            vis.Nodes.push({
                "lvl": 2,
                "name": center
            })
        });

        vis.data_areas.forEach(function(row){
            let title = row['Title'];
            let area = row['Area']

            if (vis.Nodes.filter(obj => { return obj.name === title })[0].lvl === 1) {
                vis.Links.push({
                    "source": title,
                    "target": area,
                    "lvl": 0
                })
            } else {
                vis.Links.push({
                    "source": title,
                    "target": area,
                    "lvl": 3
                })
            }
        });

        vis.data_centers.forEach(function(row){
            let title = row['Title'];
            let center = row['Center']

            if (vis.Nodes.filter(obj => {
                return obj.name === title
            })[0].lvl === 1) {
                vis.Links.push({
                    "source": title,
                    "target": center,
                    "lvl": 1
                })
            } else {
                vis.Links.push({
                    "source": title,
                    "target": center,
                    "lvl": 2
                })
            }
        });

        vis.Nodes.sort(function(a,b){
            if (a.lvl === b.lvl){
                return a.name.localeCompare(b.name);
            }
            return a.lvl - b.lvl;
        });

        vis.listAreas.sort(function(a,b){ return a.localeCompare(b) });
        vis.listFaculty.sort(function(a,b){ return a.localeCompare(b) });
        vis.listCenters.sort(function(a,b){ return a.localeCompare(b) });

        vis.colors = ["#ed1b34", "#00aaad", "#cbdb2a", "#fcb315", "#4e88c7", "#ffde2d", "#77ced9", "#bb89ca"]
        vis.colors2 = ["#808080", "#696969"]
        vis.colorAreas = d3.scaleOrdinal().domain(vis.listAreas).range(vis.colors)
        vis.colorCenters = d3.scaleOrdinal().domain(vis.listCenters).range(vis.colors2)

        vis.areaCount = vis.listAreas.length;
        vis.facultyCount = vis.listFaculty.length;
        vis.centerCount = vis.listCenters.length;

        vis.updateVis();
    }

    updateVis(){
        let vis = this;

        vis.diagonal = function link(d) {
            return "M" + d.source.y + "," + d.source.x
                + "C" + (d.source.y + d.target.y) / 2 + "," + d.source.x
                + " " + (d.source.y + d.target.y) / 2 + "," + d.target.x
                + " " + d.target.y + "," + d.target.x;
        };

        let count = [];
        vis.Nodes.forEach(function (d) {
            count[d.lvl] = 0;
        });
        vis.lvlCount = count.length;

        vis.boxWidth = 130;
        vis.boxWidthArea = 200;
        vis.boxWidthCenter = 325;
        vis.gap = {width: (vis.width - (2*vis.boxWidthArea + 2*vis.boxWidth + vis.boxWidthCenter)) / (vis.lvlCount-1), height: 0.5};

        vis.boxHeight = 12;
        vis.boxHeightArea = (vis.height - vis.areaCount*vis.gap.height) / vis.areaCount;
        vis.boxHeightCenter = (vis.height - vis.centerCount*vis.gap.height) / vis.centerCount;

        if(vis.height < 800){
            vis.facultyOffset1 = 0;
            vis.facultyOffset2 = 0;
        }else{
            vis.facultyOffset1 = (vis.height - (vis.facultyHalfCount * vis.boxHeight)) / 2;
            vis.facultyOffset2 = (vis.height - ((vis.facultyCount - vis.facultyHalfCount) * vis.boxHeight)) / 2;
        }

        vis.Nodes.forEach(function (d, i) {
            if(d.lvl === 0) {
                d.x = 0;
                d.y = (vis.boxHeightArea + vis.gap.height) * count[d.lvl];
                d.id = "n" + i;
                count[d.lvl] += 1;
            }else if(d.lvl === 4){
                d.x = vis.boxWidthArea + 2*vis.boxWidth + vis.boxWidthCenter + d.lvl*vis.gap.width;
                d.y = (vis.boxHeightArea + vis.gap.height) * count[d.lvl];
                d.id = "n" + i;
                count[d.lvl] += 1;
            }else if(d.lvl === 2){
                d.x = vis.boxWidthArea + vis.boxWidth + d.lvl*vis.gap.width;
                d.y = (vis.boxHeightCenter + vis.gap.height) * count[d.lvl];
                d.id = "n" + i;
                count[d.lvl] += 1;
            }else if(d.lvl === 1){
                d.x = vis.boxWidthArea + vis.gap.width;
                d.y = vis.facultyOffset1 + (vis.boxHeight + vis.gap.height) * count[d.lvl];
                d.id = "n" + i;
                count[d.lvl] += 1;
            } else{
                d.x = vis.boxWidthArea + vis.boxWidth + vis.boxWidthCenter + d.lvl*vis.gap.width;
                d.y = vis.facultyOffset2 + (vis.boxHeight + vis.gap.height) * count[d.lvl];
                d.id = "n" + i;
                count[d.lvl] += 1;
            }
        });

        vis.Links.forEach(function (d) {
            if(d.lvl === 3){
                d.source = vis.Nodes.filter(obj => {return obj.name === d.source})[0];
                d.target = vis.Nodes.filter(obj => {return obj.name === d.target})[1];
                d.id = "l" + d.source.id + d.target.id;
            }else{
                d.source = vis.Nodes.filter(obj => {return obj.name === d.source})[0];
                d.target = vis.Nodes.filter(obj => {return obj.name === d.target})[0];
                d.id = "l" + d.source.id + d.target.id;
            }
        });

        vis.svg.append("g")
            .attr("class", "nodes");

        let node = vis.svg.select(".nodes")
            .selectAll("g")
            .data(vis.Nodes)
            .enter()
            .append("g")
            .attr("class", "unit");

        node.append("rect")
            .attr("x", function (d) { return d.x; })
            .attr("y", function (d) { return d.y; })
            .attr("id", function (d) { return d.id; })
            .attr("width", function(d) {
                if(d.lvl === 0 || d.lvl === 4){ return vis.boxWidthArea; }
                if(d.lvl === 2){ return vis.boxWidthCenter; }
                else{ return vis.boxWidth; }
            })
            .attr("height", function(d) {
                if(d.lvl === 0 || d.lvl === 4){ return vis.boxHeightArea; }
                if(d.lvl === 2){ return vis.boxHeightCenter; }
                else{ return vis.boxHeight; }
            })
            .attr("fill", function(d){
                if(d.lvl === 0 || d.lvl === 4){ return vis.colorAreas(d.name); }
                else if(d.lvl === 2){ return vis.colorCenters(d.name); }
                else{ return "#ed1b34"; }
            })
            .attr("class", "node")
            .attr("rx", 6)
            .attr("ry", 6)
            .on("click", function () {
                vis.repress(true);
                vis.mouse_action(d3.select(this).datum(), true, d3.select(this).datum().lvl);
            })

        node.append("text")
            .attr("class", "label")
            .attr("x", function (d) { return d.x + 14; })
            .attr("y", function (d) {
                if(d.lvl === 0 || d.lvl === 4){
                    return d.y + vis.boxHeightArea/2+3;
                }else if(d.lvl === 2){
                    return d.y + vis.boxHeightCenter/2+3;
                }else{
                    return d.y + vis.boxHeight-3;
                }
            })
            .text(function (d) { return d.name; });

        vis.Links.forEach(function (li) {
            vis.svg.append("path", "g")
                .attr("class", "link")
                .attr("id", li.id)
                .attr("d", function () {
                    let oTarget;
                    let oSource;

                    if(li.target.lvl === 0 || li.target.lvl === 4){
                        oTarget = {
                            x: li.target.y + 0.5 * vis.boxHeightArea,
                            y: li.target.x
                        };
                        oSource = {
                            x: li.source.y + 0.5 * vis.boxHeight,
                            y: li.source.x
                        };

                        if (oSource.y < oTarget.y) {
                            oSource.y += vis.boxWidth;
                        } else {
                            oTarget.y += vis.boxWidthArea;
                        }
                    }else{
                        oTarget = {
                            x: li.target.y + 0.5 * vis.boxHeightCenter,
                            y: li.target.x
                        };
                        oSource = {
                            x: li.source.y + 0.5 * vis.boxHeight,
                            y: li.source.x
                        };

                        if (oSource.y < oTarget.y) {
                            oSource.y += vis.boxWidth;
                        } else {
                            oTarget.y += vis.boxWidthCenter;
                        }
                    }

                    return vis.diagonal({
                        source: oSource,
                        target: oTarget
                    });
                })
                .attr("stroke", function(){
                    if(li.target.lvl === 0 || li.target.lvl === 4){ return vis.colorAreas(li.target.name); }
                    else{ return vis.colorCenters(li.target.name); }
                });
        });
    }
}
