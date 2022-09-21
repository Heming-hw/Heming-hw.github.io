import { createTableFromJSON, clearDat } from "./display.js"
import { get_meta, get_annots, event_action} from "./data.js"




/* disabled tracking */
window.HELP_IMPROVE_VIDEOJS = false;


/* display data. */
try {
    window.onload(createTableFromJSON("showAnnot_displays", "annot_displays"))
} catch (error) {
    console.log("No data to show")
}


/* initialize Videojs player */
var player = window.videojs('vid1', {
    controls: true,
    autoplay: false,
    preload: 'auto'
});



/* plugin options for the annotation plugin. */
const pluginOptions = {
    // Collection of annotation data to initialize and show
    annotationsObjects: get_annots(),
    // Flexible meta data object (currently used for user data, but addl data can be provided to wrap each comment with metadata - provide the id of the current user and fullname of the current user at minimum, which are required for the UI)
    meta: get_meta(),
    // meta: {user_id:0, user_name: "test"},
    // Use arrow keys to move through annotations when Annotation mode is active
    bindArrowKeys: true,
    // Show or hide the control panel and annotation toggle button (NOTE - if controls are hidden you must provide custom UI and events to drive the annotations - more on that in "Programmatic Control" below)
    showControls: true,
    // Show or hide the comment list when an annotation is active. If false, the text 'Click and drag to select', will follow the cursor during annotation mode
    showCommentList: true,
    // If false, annotations mode will be disabled in fullscreen
    showFullScreen: true,
    // Show or hide the tooltips with comment preview, and annotation shape, on marker hover or timeline activate
    showMarkerShapeAndTooltips: true,
    // If false, step two of adding annotations (writing and saving the comment) will be disabled
    internalCommenting: true,
    // If true, toggle the player to annotation mode immediately after init. (NOTE - "annotationModeEnabled" event is not fired for this initial state)
    startInAnnotationMode: false
};

/* register annotation plugin. */
var plugin = player.annotationComments(pluginOptions)





plugin.registerListener('annotationClosed', (event) => {
    // for debug purpose
    window.temp = event.detail

    event_action(event)
    
    createTableFromJSON("showAnnot_displays", "annot_displays")
})

document.getElementById("clearBut").addEventListener('click', clearDat)



export{plugin, player}







