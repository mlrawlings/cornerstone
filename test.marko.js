function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      __loadTag = __helpers.t,
      cms = __loadTag(require("./cms-renderer"));

  return function render(data, out) {
    cms({
        id: "test",
        editable: {
            text: true
          },
        tag: "img"
      }, out);

    out.w(" ");
  };
}

(module.exports = require("marko").c(__filename)).c(create);
