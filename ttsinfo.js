const html = `
  <div id="tts-contents"></div>
  <script>
        const cb = (block) => {
          if (block && block.property && block.property.default && block.property.default.textdata) {
            const textdata = block.property.default.textdata
            document.getElementById("tts-contents").innerHTML = textdata;
          }
        };

        addEventListener("message", e => {
          if (e.source !== parent || !e.data.block) return;
          cb(e.data);
        });

        cb(${JSON.stringify(reearth.block)});
    </script>
`;

reearth.ui.show(html);

reearth.on("update", () => {
  reearth.ui.postMessage({
        block: reearth.block
    });
});