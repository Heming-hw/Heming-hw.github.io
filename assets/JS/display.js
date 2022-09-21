import {plugin, player} from "./index.js"


/* create table fron Json
   @id is the html element the table to be shown at. A String.
   @dat is the data stored (in localStorage). A Stringified list.
*/
function createTableFromJSON(id, dat) {
    var dat = JSON.parse(localStorage.getItem(dat))

    // check if null
    if (dat == null) {
        dat = []
    }


    // check if it's dictionary, if so, change to array
    if (typeof dat==='object' && dat!==null && !(dat instanceof Array) && !(dat instanceof Date)) {
        dat = Object.values(dat)
    }


    // EXTRACT VALUE FOR HTML HEADER.
    // this contains any values we want to display. 
    var col = [];
    for (var i = 0; i < dat.length; i++) {
        for (var key in dat[i]) {
            if (col.indexOf(key) === -1 
                    && !key.includes("id")) {
                        // don't need to display any kinds of ids.
                col.push(key);
            }
        }
    }



    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.insertRow(-1);                   // TABLE ROW.

    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }

    // add unique annot ids (these are the first comments in each timestamp that are always shown)
    var stays = [];
    
    for (let i=0; i < dat.length; i++) {
        let annot_id = dat[i]['annot_id']
        if (stays.indexOf(annot_id) === -1) {
            stays.push(annot_id)
        }
    }

    // always display the first comments in each timestamp
    
    var  tboyds = {} // a map from parent id to the child tbody. 
    for (let i=0; i < stays.length; i++) {
        let annot_id = stays[i]

        var first = true
        var first_child = true
        for (let j=0; j < dat.length; j++) {
            // loop thorugh parents and childs
            if (dat[j]["annot_id"] === annot_id) {
                if (first) {
                    // only construct the first one (parent)
                    var tbody_parent = document.createElement("tbody")
                    // let class list to be annot id
                    tbody_parent.classList.add('parent')
                    // set id
                    tbody_parent.id = 'P' + annot_id
                    
                    // add content
                    let tr  = tbody_parent.insertRow(-1)

                    for (let k=0; k < col.length; k++) {
                        let tabCell = tr.insertCell(-1)
                        tabCell.innerHTML = dat[j][col[k]]
                    }

                    // locate button
                    var buttonCell = tr.insertCell(-1)
                    var btn = document.createElement("button")
                    btn.innerHTML = "Locate"
                    // make this button identifiable
                    btn.classList.add("locateButt")
                    btn.id = dat[j].annot_id // this is the annotation id for the annotation this comment lives in

                    // add locate event
                    btn.addEventListener('click', function () {
                        
                        plugin.fire('openAnnotation', { id: dat[j].annot_id });
                        
                        // collapse all other annots
                        for (let l = 0; l < stays.length; l++) {
                            let other_annot_id = stays[l]
                            if (other_annot_id != annot_id) {
                                // collapse all other comment threads when locating current thread
                                collapse_children(other_annot_id)
                            }
                        }

                        player.userActive(true)
                        
                    })
                    buttonCell.appendChild(btn)


                    // add icon
                    let label = document.createElement("label")
                    label.innerHTML = "+"
                    let tabCell = tr.insertCell(-1)
                    label.addEventListener("click", function () {
                        return collapse_children(annot_id)
                    })
                    tabCell.appendChild(label)


                    table.appendChild(tbody_parent)
                    first = false
                } else {
                        if (first_child) {
                            // construct child tbody -- only construct for the first child
                            var tbody_child = document.createElement("tbody")
                            
                            tbody_child.classList.add("child")


                            tbody_child.id = 'C' + dat[j]["annot_id"]
                            first_child = false
                        }
                        
                        // add content
                        let tr  = tbody_child.insertRow(-1)
                        for (var k=0; k < col.length; k++) {
                            let tabCell = tr.insertCell(-1)
                            tabCell.innerHTML = dat[j][col[k]]
                        }
                            

                        // add after parent tbody
                        tbody_parent.after(tbody_child)
                }
                
            } 
        }
    }


    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById(id);
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
}

/* take in a parent tbody */
function collapse_children(annot_id) {
    let tbody_child = document.getElementById("C" + annot_id)

    if (tbody_child == null) {return}

    if (tbody_child !== null) {
        if (tbody_child.style.display !== "none") {
            tbody_child.style.display = "none"
        } else {
            // place holder
            tbody_child.style.display = ""
        }
        
    }
}





/* clear data */
function clearDat() {
    localStorage.clear()
    createTableFromJSON("showAnnot_displays", "annot_displays")
}


/* Locate the comment in the video. Notice that the id is annotation id (not comment id)
@ annotId: a String.
*/
function locateComment(annotId) {

    // open annotation
    plugin.fire('openAnnotation', { id: annotId });
}


/*-----------------------------------------------------------------------------------------------------------*/
export{createTableFromJSON, clearDat}