const r = new rive.Rive({
    src: "./superdev_cards.riv",
    // OR the path to a discoverable and public Rive asset
    // src: '/public/example.riv',
    canvas: document.getElementById("canvas"),
    autoplay: true,
    stateMachines: "bumpy",
    onLoad: () => {
      r.resizeDrawingSurfaceToCanvas();
    },
});