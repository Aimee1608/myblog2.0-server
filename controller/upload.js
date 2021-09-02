class uploaderController {
  static add(ctx) {
    const { filename } = ctx.req.file;
    ctx.data({
      data: {
        filename,
        body: ctx.req.body
      }
    });
  }
}
module.exports = uploaderController;
