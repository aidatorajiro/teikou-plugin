// copy(JSON.stringify(reearth.camera))
// copy(get_all_ttsinfo().join("\n"))

reearth.ui.show(`<div><button id="shu">集中する</button></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js" integrity="sha512-6+YN/9o9BWrk6wSfGxQGpt3EUK6XeHi6yeHV+TYD2GR0Sj/cggRpXr1BrAQf0as6XslxomMUxXp2vIl+fv0QRA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js" integrity="sha512-E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script>
let lock = false;

let camera_from_start = {"position":{"lng":140.02879797881644,"lat":29.13949720659771,"height":59117881.22518135,"heading":6.28318530717958,"pitch":-1.567990247532764,"roll":0,"fov":1.0471975511965976},"viewport":{"north":90,"south":-90,"west":-180,"east":180}};
let camera_from_mid = {"position":{"lng":139.71819628342823,"lat":35.70555617579899,"height":738.736377478599,"heading":6.283185307179518,"pitch":-1.5627148456207833,"roll":0,"fov":1.0471975511965976},"viewport":{"north":35.70672712849253,"south":35.70449567422732,"west":139.71347663445377,"east":139.72291593237688}}

let database = [
    camera_from_start,
    {"position":{"lng":139.7175872641833,"lat":35.70582453492393,"height":159.38704776078922,"heading":6.283185307179524,"pitch":-1.5658174205105073,"roll":0,"fov":1.0471975511965976},"viewport":{"north":35.70607104278182,"south":35.70559271951014,"west":139.7165695511717,"east":139.7186049771974}},
    camera_from_mid,
    {"position":{"lng":139.71808334473658,"lat":35.70475209987065,"height":14.14448821007104,"heading":3.016871018759491,"pitch":-1.4756476339521374,"roll":3.141568324726931,"fov":1.0471975511965976},"viewport":{"north":35.7047689317203,"south":35.70471024027258,"west":139.71799354141046,"east":139.71817966158042}},
    camera_from_mid,
    {"position":{"lng":139.71744743510865,"lat":35.70648508258554,"height":57.691608485362046,"heading":3.0168709151193918,"pitch":-1.475647712846102,"roll":3.1415684288379246,"fov":1.0471975511965976},"viewport":{"north":35.70655975006339,"south":35.70630785586701,"west":139.7170806189846,"east":139.71784171948497}},
    camera_from_mid,
    {"position":{"lng":139.7174042061274,"lat":35.70581301133724,"height":41.68535108693747,"heading":3.0168708552194605,"pitch":-1.47564775844471,"roll":3.1415684890097175,"fov":1.0471975511965976},"viewport":{"north":35.70586696279495,"south":35.70568495549127,"west":139.71713916369782,"east":139.7176890957654}}
];

let m = (from, to, time) => (from + (to - from) * time)
let morph_table = {"lng": m,"lat": m,"height": m,"heading": m,"pitch": m,"roll": m,"fov": m}
let target_position;

addEventListener("message", e => {
    if (e.source !== parent || !e.data.pos) return;
    let initial_pos = e.data.pos;
    let duration = 600;
    let calma = 0;
    let it = setInterval(function () {
        calma += 1/duration;
        if (calma >= 1) {
            clearInterval(it);
            lock = false;
        }
        let arg = {}
        for (let k in target_position) {
            let v1 = initial_pos[k]
            let v2 = target_position[k]
            arg[k] = morph_table[k](v1, v2, calma)
        }
        parent.postMessage({ type: "flycamera", arg: arg }, "*");
    }, 1000/60)
    lock = true;
});

let i = 0;
document.getElementById('shu').addEventListener('click', function () {
    if (lock === true) { return; }

    i %= database.length;
    target_position = database[i].position
    parent.postMessage({ type: "getpos" }, "*");

    i++;
})

parent.postMessage({ type: "get_all_ttsinfo" }, "*");

let all_ttsinfo;

addEventListener("message", e => {
    if (e.source !== parent || !e.data.all_ttsinfo) return;
    all_ttsinfo = e.data.all_ttsinfo;
});

setInterval(function () {
    if (Math.random() < 0.04) {
        let random_tts = all_ttsinfo[Math.floor(Math.random() * all_ttsinfo.length)]
        let segments = random_tts.split("。").filter((x)=>(x !== ""))
        console.log(segments)

        let digests = segments.map(x => CryptoJS.SHA256(x).toString(CryptoJS.enc.Hex));

        let recfun = () => {
            let d = digests.shift();

            console.log('https://aidatorajiro.dev/waveout/' + d + '.wav.hi.wav')

            let sound = new Howl({
                src: ['https://aidatorajiro.dev/waveout/' + d + '.wav.hi.wav'],
                onend: function() {
                    if (digests.length > 0) {
                        recfun()
                    }
                }
            });
        
            sound.play();
        }
    }
}, 1000/60)
</script>`);

reearth.on("message", msg => {
    if (msg.type === "getpos") {
        reearth.ui.postMessage({
            pos: reearth.camera.position
        });
    }
    if (msg.type === "flycamera") {
        reearth.camera.flyTo(msg.arg)
    }
    if (msg.type === "get_all_ttsinfo") {
        reearth.ui.postMessage({
            all_ttsinfo: get_all_ttsinfo()
        });
    }
});

function get_all_ttsinfo() {
    let c = [].concat(...reearth.layers.layers.filter((x)=>(x.infobox))
        .map((x)=>(x.infobox.blocks.filter(y=>y.extensionId==='ttsinfo'))))
    return c.map(x=>x.property.default.textdata)
}
