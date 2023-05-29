// reearth.layers.layers[1].infobox.blocks[0].property.default.text 

reearth.ui.show(`<div><button id="shu">集中する</button></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js" integrity="sha512-6+YN/9o9BWrk6wSfGxQGpt3EUK6XeHi6yeHV+TYD2GR0Sj/cggRpXr1BrAQf0as6XslxomMUxXp2vIl+fv0QRA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script>
let i = 0;

let camera_from_start = {"position":{"lng":-158.54022119458145,"lat":13.168764232337136,"height":28136213.44295596,"heading":6.2831853071795205,"pitch":-1.5658174205135622,"roll":0,"fov":1.0471975511965976},"viewport":{"north":90,"south":-90,"west":-180,"east":180}}
let camera_from_mid = {"position":{"lng":139.71819628342823,"lat":35.70555617579899,"height":738.736377478599,"heading":6.283185307179518,"pitch":-1.5627148456207833,"roll":0,"fov":1.0471975511965976},"viewport":{"north":35.70672712849253,"south":35.70449567422732,"west":139.71347663445377,"east":139.72291593237688}}

let database = [
    {"position":{"lng":139.7175872641833,"lat":35.70582453492393,"height":159.38704776078922,"heading":6.283185307179524,"pitch":-1.5658174205105073,"roll":0,"fov":1.0471975511965976},"viewport":{"north":35.70607104278182,"south":35.70559271951014,"west":139.7165695511717,"east":139.7186049771974}},
    {"position":{"lng":139.71808334473658,"lat":35.70475209987065,"height":14.14448821007104,"heading":3.016871018759491,"pitch":-1.4756476339521374,"roll":3.141568324726931,"fov":1.0471975511965976},"viewport":{"north":35.7047689317203,"south":35.70471024027258,"west":139.71799354141046,"east":139.71817966158042}},
    {"position":{"lng":139.71744743510865,"lat":35.70648508258554,"height":57.691608485362046,"heading":3.0168709151193918,"pitch":-1.475647712846102,"roll":3.1415684288379246,"fov":1.0471975511965976},"viewport":{"north":35.70655975006339,"south":35.70630785586701,"west":139.7170806189846,"east":139.71784171948497}},
    {"position":{"lng":139.7174042061274,"lat":35.70581301133724,"height":41.68535108693747,"heading":3.0168708552194605,"pitch":-1.47564775844471,"roll":3.1415684890097175,"fov":1.0471975511965976},"viewport":{"north":35.70586696279495,"south":35.70568495549127,"west":139.71713916369782,"east":139.7176890957654}}
];

let m = (from, to, time) => (from + (to - from) * time)
let morph_table = {"lng": m,"lat": m,"height": m,"heading": m,"pitch": m,"roll": m,"fov": m}

document.getElementById('shu').addEventListener('click', function () {
    let id = i % database.length
    let duration = 600;
    let calma = 0;
    let initial_pos = reearth.camera.position
    let it = setInterval(function () {
        calma += 1/duration;
        if (calma >= 1) {
            clearInterval(it);
            lock = false;
        }
        let arg = {}
        for (let k in database[id].position) {
            let v1 = initial_pos[k]
            let v2 = database[id].position[k]
            arg[k] = morph_table[k](v1, v2, calma)
        }
        parent.postMessage({ type: "flycamera", arg: arg }, "*");
    }, 1000/60)
    lock = true
    i++;
})
</script>`);

let lock = false;

reearth.on("message", msg => {
    if (msg.type === "flycamera") {
        reearth.camera.flyTo(msg.arg)
    }
});