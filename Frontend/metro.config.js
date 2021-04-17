module.exports = {
  resetCache: true,
  resolver: {
    blockList: new RegExp(/.*\.oryx_all_node_modules\/.*/gi),
  },
};
