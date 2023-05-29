const html = `
  <div id="tts-contents" style="color: white; min-height: 60px;">HELLO</div>
  <script>
        const cb = (block) => {
          console.log(block)
          if (block && block.property && block.property.default && block.property.default.textdata) {
            const textdata = block.property.default.textdata
            document.getElementById("tts-contents").innerHTML = textdata;
          } else {
            document.getElementById("tts-contents").innerHTML = "NANANANA";
          }
        };

        addEventListener("message", e => {
          if (e.source !== parent || !e.data.block) return;
          cb(e.data.block);
        });

        cb(${JSON.stringify(reearth.block)});
    </script>
`;

let database = [
  {"position":{"lng":139.7175872641833,"lat":35.70582453492393,"height":159.38704776078922,"heading":6.283185307179524,"pitch":-1.5658174205105073,"roll":0,"fov":1.0471975511965976},"viewport":{"north":35.70607104278182,"south":35.70559271951014,"west":139.7165695511717,"east":139.7186049771974}},
  {"position":{"lng":139.71808334473658,"lat":35.70475209987065,"height":14.14448821007104,"heading":3.016871018759491,"pitch":-1.4756476339521374,"roll":3.141568324726931,"fov":1.0471975511965976},"viewport":{"north":35.7047689317203,"south":35.70471024027258,"west":139.71799354141046,"east":139.71817966158042}},
  {"position":{"lng":139.71744743510865,"lat":35.70648508258554,"height":57.691608485362046,"heading":3.0168709151193918,"pitch":-1.475647712846102,"roll":3.1415684288379246,"fov":1.0471975511965976},"viewport":{"north":35.70655975006339,"south":35.70630785586701,"west":139.7170806189846,"east":139.71784171948497}},
  {"position":{"lng":139.7174042061274,"lat":35.70581301133724,"height":41.68535108693747,"heading":3.0168708552194605,"pitch":-1.47564775844471,"roll":3.1415684890097175,"fov":1.0471975511965976},"viewport":{"north":35.70586696279495,"south":35.70568495549127,"west":139.71713916369782,"east":139.7176890957654}}
];

reearth.ui.show(html);

reearth.on("update", () => {
  reearth.ui.postMessage({
        block: reearth.block
    });
});

console.log("hello")